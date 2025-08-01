// Simple analytics for mood tracking
export interface MoodEntry {
  timestamp: Date
  emotion: string
  confidence: number
  message: string
}

export class MoodAnalytics {
  private entries: MoodEntry[] = []

  addEntry(entry: MoodEntry) {
    this.entries.push(entry)
    // In a real app, you'd save to database here
    localStorage.setItem("mood-entries", JSON.stringify(this.entries))
  }

  loadEntries(): MoodEntry[] {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mood-entries")
      if (stored) {
        this.entries = JSON.parse(stored)
      }
    }
    return this.entries
  }

  getMoodTrend(days = 7): { date: string; mood: number }[] {
    const now = new Date()
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

    const recentEntries = this.entries.filter((entry) => new Date(entry.timestamp) >= startDate)

    // Group by day and calculate average mood
    const dailyMoods: { [key: string]: number[] } = {}

    recentEntries.forEach((entry) => {
      const date = new Date(entry.timestamp).toDateString()
      const moodScore = this.emotionToScore(entry.emotion)

      if (!dailyMoods[date]) {
        dailyMoods[date] = []
      }
      dailyMoods[date].push(moodScore)
    })

    return Object.entries(dailyMoods).map(([date, scores]) => ({
      date,
      mood: scores.reduce((a, b) => a + b, 0) / scores.length,
    }))
  }

  private emotionToScore(emotion: string): number {
    switch (emotion.toLowerCase()) {
      case "happy":
        return 1
      case "neutral":
        return 0
      case "sad":
        return -1
      default:
        return 0
    }
  }
}
