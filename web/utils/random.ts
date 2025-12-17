export const stableRandomIndex = (seed: string, modulo: number) => {
  if (modulo <= 0) return 0

  // Simple deterministic hash (FNV-1a-ish) to get a stable "random" number from a string
  let hash = 2166136261
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }

  return Math.abs(hash) % modulo
}
