// Enhanced language detection with more realistic patterns
export async function detectLanguage(text: string): Promise<{ language: string; confidence: number }> {
  const languagePatterns = {
    en: {
      words: [
        "the",
        "and",
        "or",
        "but",
        "in",
        "on",
        "at",
        "to",
        "for",
        "of",
        "with",
        "by",
        "from",
        "this",
        "that",
        "is",
        "are",
        "was",
        "were",
      ],
      patterns: [/\b(the|and|or|but|in|on|at|to|for|of|with|by)\b/gi],
    },
    es: {
      words: ["el", "la", "y", "o", "pero", "en", "con", "de", "para", "por", "que", "es", "un", "una", "los", "las"],
      patterns: [/\b(el|la|y|o|pero|en|con|de|para|por|que|es)\b/gi],
    },
    fr: {
      words: [
        "le",
        "la",
        "et",
        "ou",
        "mais",
        "dans",
        "sur",
        "à",
        "pour",
        "de",
        "avec",
        "par",
        "un",
        "une",
        "les",
        "des",
      ],
      patterns: [/\b(le|la|et|ou|mais|dans|sur|à|pour|de|avec|par)\b/gi],
    },
    de: {
      words: [
        "der",
        "die",
        "das",
        "und",
        "oder",
        "aber",
        "in",
        "auf",
        "zu",
        "für",
        "von",
        "mit",
        "ein",
        "eine",
        "den",
        "dem",
      ],
      patterns: [/\b(der|die|das|und|oder|aber|in|auf|zu|für|von|mit)\b/gi],
    },
    it: {
      words: ["il", "la", "e", "o", "ma", "in", "su", "a", "per", "di", "con", "da", "un", "una", "gli", "le"],
      patterns: [/\b(il|la|e|o|ma|in|su|a|per|di|con|da)\b/gi],
    },
    pt: {
      words: ["o", "a", "e", "ou", "mas", "em", "sobre", "para", "de", "com", "por", "um", "uma", "os", "as"],
      patterns: [/\b(o|a|e|ou|mas|em|sobre|para|de|com|por)\b/gi],
    },
  }

  const words = text.toLowerCase().split(/\s+/).slice(0, 200) // First 200 words
  let bestMatch = { language: "en", confidence: 0 }

  for (const [lang, data] of Object.entries(languagePatterns)) {
    let score = 0

    // Count word matches
    const wordMatches = words.filter((word) => data.words.includes(word)).length
    score += wordMatches / Math.min(words.length, data.words.length)

    // Count pattern matches
    for (const pattern of data.patterns) {
      const matches = (text.match(pattern) || []).length
      score += matches / 100 // Normalize pattern matches
    }

    const confidence = Math.min(score, 0.95) // Cap confidence at 95%

    if (confidence > bestMatch.confidence) {
      bestMatch = { language: lang, confidence }
    }
  }

  // Ensure minimum confidence
  if (bestMatch.confidence < 0.3) {
    bestMatch = { language: "en", confidence: 0.5 }
  }

  return bestMatch
}
