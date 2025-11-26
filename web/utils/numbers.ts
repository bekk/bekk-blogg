export const isNumericString = (str: string | null): str is string => {
  return str !== null && !Number.isNaN(Number(str))
}
