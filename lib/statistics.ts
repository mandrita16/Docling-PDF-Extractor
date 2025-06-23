export function calculateStatistics(pageTexts: string[]): {
  totalWords: number
  totalCharacters: number
  pageStats: { page: number; words: number; characters: number }[]
} {
  let totalWords = 0
  let totalCharacters = 0
  const pageStats: { page: number; words: number; characters: number }[] = []

  pageTexts.forEach((text, index) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const characters = text.length

    totalWords += words
    totalCharacters += characters

    pageStats.push({
      page: index + 1,
      words,
      characters,
    })
  })

  return {
    totalWords,
    totalCharacters,
    pageStats,
  }
}
