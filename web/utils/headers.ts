import { HeadersFunction } from 'react-router'

function isObject(value: unknown) {
  return value !== null && typeof value === 'object'
}

/**
 * Merges multiple headers objects into a single headers object.
 * @param sources - The headers objects to merge.
 * @returns A new headers object containing the merged headers.
 */
function mergeHeaders(...sources: (HeadersInit | undefined)[]) {
  const result: Record<string, string> = {}

  for (const source of sources) {
    if (!isObject(source)) {
      throw new TypeError('All arguments must be of type object')
    }

    const headers: Headers = new Headers(source)

    for (const [key, value] of headers.entries()) {
      if (value === undefined || value === 'undefined') {
        delete result[key]
      } else {
        result[key] = value
      }
    }
  }
  return new Headers(result)
}

/**
 * Merges the loader, parent, and error headers into a single headers object.
 *
 * Error headers overrides loader headers, which overrides parent headers.
 */
export const combinedHeaders: HeadersFunction = ({ loaderHeaders, parentHeaders, errorHeaders }) => {
  const allHeaders = [parentHeaders, loaderHeaders, errorHeaders].filter(Boolean) as Headers[]
  return mergeHeaders(...allHeaders)
}
