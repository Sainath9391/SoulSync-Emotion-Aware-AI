interface MoodIndicatorProps {
  emotion: "sad" | "neutral" | "happy"
  confidence?: number
}

export function MoodIndicator({ emotion, confidence }: MoodIndicatorProps) {
  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case "sad":
        return "text-red-400 bg-red-900/20"
      case "happy":
        return "text-green-400 bg-green-900/20"
      default:
        return "text-blue-400 bg-blue-900/20"
    }
  }

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case "sad":
        return "😢"
      case "happy":
        return "😊"
      default:
        return "😐"
    }
  }

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getEmotionColor(emotion)}`}>
      <span className="mr-2">{getEmotionIcon(emotion)}</span>
      <span className="capitalize">{emotion}</span>
      {confidence && <span className="ml-2 text-xs opacity-75">({Math.round(confidence * 100)}%)</span>}
    </div>
  )
}
