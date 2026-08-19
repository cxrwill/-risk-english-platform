import { useEffect, useState, useRef } from 'react'
import { useConversationStore } from '../store/conversation'
import { sttService } from '../services/stt'
import { ttsService } from '../services/tts'
import { AIClient } from '../services/ai'

export default function VoicePanel() {
  const {
    isRecording,
    isAiThinking,
    currentTranscript,
    messages,
    setRecording,
    setAiThinking,
    setTranscript,
    addMessage,
    setFeedback,
    setScore,
    sttMode,
    scenario,
    getScenario,
  } = useConversationStore()

  const [textBuffer, setTextBuffer] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const s = getScenario()

  useEffect(() => {
    ttsService.loadVoices()
  }, [])

  const handleStartRecording = async () => {
    const started = await sttService.start(
      (result: { transcript: string; isFinal: boolean; confidence: number }) => {
        if (result.isFinal) {
          setTextBuffer((prev: string) => prev + ' ' + result.transcript)
        } else {
          setTranscript(result.transcript)
        }
      },
      () => {
        if (textBuffer.trim()) {
          handleSubmit(textBuffer.trim())
        }
        setRecording(false)
      },
      sttMode
    )
    if (started) {
      setRecording(true)
    }
  }

  const handleStopRecording = () => {
    sttService.stop()
    setRecording(false)
    if (textBuffer.trim()) {
      handleSubmit(textBuffer.trim())
    }
  }

  const handleSubmit = async (text: string) => {
    if (!text.trim() || !scenario || isAiThinking) return

    addMessage('user', text)
    const scenarioData = s!
    const history = messages.map((m: { content: string }) => m.content)

    setAiThinking(true)

    try {
      const result = await AIClient.generateResponse(text, scenarioData, history)
      setAiThinking(false)
      addMessage('ai', result.text)

      if (result.feedback.length > 0) {
        setFeedback(result.feedback)
      }
      setScore(result.score)

      ttsService.speak(result.text)
    } catch {
      setAiThinking(false)
    }
  }

  useEffect(() => {
    if (textBuffer.trim().length > 20 && !isRecording) {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        handleSubmit(textBuffer.trim())
      }, 2000)
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [textBuffer, isRecording])

  const handleTextSubmit = () => {
    if (textBuffer.trim()) {
      handleSubmit(textBuffer.trim())
      setTextBuffer('')
      setTranscript('')
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-3 border-b border-surface-700 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isRecording
                ? 'bg-danger-500 animate-pulse'
                : isAiThinking
                ? 'bg-accent-500 animate-pulse-slow'
                : 'bg-surface-600'
            }`}
          />
          <span className="text-xs text-surface-500">
            {isRecording
              ? 'Listening...'
              : isAiThinking
              ? 'AI is thinking...'
              : 'Ready'}
          </span>
        </div>
        <span className="text-xs text-surface-600 hidden sm:block">
          STT: {sttMode === 'native' ? 'Web Speech API' : 'Whisper (local)'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {currentTranscript && (
          <div className="mb-3 p-3 rounded-lg bg-surface-800 border border-surface-700">
            <p className="text-xs text-surface-500 mb-1">Live Transcript</p>
            <p className="text-sm text-surface-300">{currentTranscript}</p>
          </div>
        )}
        {textBuffer && !isRecording && (
          <div className="mb-3 p-3 rounded-lg bg-surface-800 border border-surface-700">
            <p className="text-xs text-surface-500 mb-1">Ready to submit</p>
            <p className="text-sm text-surface-300">{textBuffer}</p>
          </div>
        )}
        {!currentTranscript && !textBuffer && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎙️</div>
            <p className="text-surface-400 text-sm">
              Press the microphone to start speaking
            </p>
            <p className="text-surface-600 text-xs mt-2">
              or type your response below
            </p>
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-surface-700">
        <div className="flex gap-2">
          <textarea
            value={textBuffer}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleTextSubmit()
              }
            }}
            placeholder="Type your response here... (Enter to submit)"
            className="flex-1 bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-surface-200 placeholder-surface-600 resize-none focus:outline-none focus:border-primary-500"
            rows={2}
          />
          <button
            onClick={handleTextSubmit}
            disabled={!textBuffer.trim() || isAiThinking}
            className="px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:bg-surface-700 disabled:text-surface-500 text-white text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-surface-700 flex items-center justify-center">
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={isAiThinking}
          className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-all duration-200 ${
            isRecording
              ? 'bg-danger-500 hover:bg-danger-600 text-white shadow-lg shadow-danger-500/30'
              : isAiThinking
              ? 'bg-surface-700 text-surface-500 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20'
          }`}
        >
          {isRecording ? (
            <>
              <span className="w-3 h-3 bg-white rounded-sm animate-pulse" />
              Stop Speaking
            </>
          ) : (
            <>
              <span className="text-lg">🎤</span>
              {isAiThinking ? 'AI is speaking...' : 'Start Speaking'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
