/**
 * Tar imot antall ord, og returnerer en streng som beskriver hvor lang tid det
 * vil ta å lese det antallet ord */
export const readingTime = (wordCount: number) => {
  if (wordCount === 0) {
    return ''
  }
  return `${Math.ceil(wordCount / 150)} min`
}
