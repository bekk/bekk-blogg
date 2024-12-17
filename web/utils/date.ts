export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-')
  return `${day}.${month}.${year}`
}

export function parseDate(dateString: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateString.split('-').map(Number)
  return { year, month, day }
}
