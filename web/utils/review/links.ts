import { mapWithConcurrency } from '../tts/synthesize'

/** Lenker i markdown på formen `[tekst](https://…)` */
const MARKDOWN_LINK = /\]\((https?:\/\/[^\s)]+)\)/g

/** Alle unike http(s)-lenker i teksten og blant de relevante lenkene */
export function extractLinks(markdown: string, relatedLinks: Array<{ url?: string | null } | null> = []): string[] {
  const fromText = [...markdown.matchAll(MARKDOWN_LINK)].map((match) => match[1])
  const fromRelated = relatedLinks.map((link) => link?.url ?? '').filter((url) => /^https?:\/\//.test(url))
  return [...new Set([...fromText, ...fromRelated])]
}

export type DeadLink = { url: string; reason: string }

/**
 * Bare svar som sikkert betyr at siden er borte, regnes som døde. Mange nettsteder
 * svarer 403 eller 429 til servere, og det ville gitt mange falske alarmer.
 */
export function classifyLinkResult(result: { status: number } | { error: unknown }): string | null {
  if ('status' in result) {
    return result.status === 404 || result.status === 410 ? `HTTP ${result.status}` : null
  }
  const code = (result.error as { cause?: { code?: string } })?.cause?.code
  return code && ['ENOTFOUND', 'ECONNREFUSED', 'EAI_AGAIN', 'CERT_HAS_EXPIRED'].includes(code)
    ? `Fikk ikke kontakt (${code})`
    : null
}

const TIMEOUT_MS = 10_000

async function checkLink(url: string): Promise<DeadLink | null> {
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BekkChristmasLinkCheck/1.0; +https://www.bekk.christmas)' },
    })
    // Vi trenger bare statusen
    await response.body?.cancel()
    const reason = classifyLinkResult({ status: response.status })
    return reason ? { url, reason } : null
  } catch (error) {
    const reason = classifyLinkResult({ error })
    return reason ? { url, reason } : null
  }
}

export async function findDeadLinks(urls: string[]): Promise<DeadLink[]> {
  const results = await mapWithConcurrency(urls, 6, checkLink)
  return results.filter((result): result is DeadLink => result !== null)
}
