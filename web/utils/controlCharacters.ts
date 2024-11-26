// eslint-disable-next-line no-control-regex
const controlCharactersRegex = /[\u200B-\u200D\uFEFF\u0000-\u001F\u007F-\u009F\u2000-\u200F\u2028-\u202F]/g
/**
 * Removes any Sanity Visual Editing control characters from a string
 */
export const cleanControlCharacters = (text?: string) => text?.replace(controlCharactersRegex, '') ?? ''
