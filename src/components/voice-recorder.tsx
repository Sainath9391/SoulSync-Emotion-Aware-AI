"use client"

import { useState, useRef } from "react"
import { Mic, Square } from "lucide-react"

interface VoiceRecorderProps {
  onTranscript: (text: string) => void
  language: string
}

export function VoiceRecorder({ onTranscript, language }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef<any | null>(null)

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = language

    recognition.onstart = () => {
      setIsRecording(true)
    }

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("")

      if (event.results[event.results.length - 1].isFinal) {
        onTranscript(transcript)
        setIsProcessing(true)
      }
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      setIsRecording(false)
      setIsProcessing(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
      setIsProcessing(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {!isRecording ? (
        <button
          onClick={startRecording}
          className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
          aria-label="Start recording"
        >
          <Mic className="h-5 w-5" />
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="p-3 bg-red-600 hover:bg-red-700 rounded-full animate-pulse transition-colors"
          aria-label="Stop recording"
        >
          <Square className="h-5 w-5" />
        </button>
      )}

      {isProcessing && <span className="text-sm text-gray-400 animate-pulse">Processing...</span>}

      {isRecording && <span className="text-sm text-red-400 animate-pulse">Recording...</span>}
    </div>
  )
}
