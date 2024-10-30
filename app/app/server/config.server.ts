export function getTenantId(): string {
  return process.env.AZURE_AD_TENANT_ID ?? ''
}

export function getClientId(): string {
  return process.env.AZURE_AD_CLIENT_ID ?? ''
}

export function getClientSecret(): string {
  return process.env.AZURE_AD_CLIENT_SECRET ?? ''
}

export function getScopes(): string {
  return process.env.AZURE_AD_SCOPES ?? ''
}

export function getSanityRoot(): string {
  return process.env.APPLICATION_ROOT ?? ''
}

export const getSessionSecret = () => {
  return process.env.SESSION_SECRET ?? ''
}

export function getEmailFromToken(token: string): string | null {
  return "ole.norstrand@bekk.no"
}