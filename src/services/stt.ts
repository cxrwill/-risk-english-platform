export class STTService {
  private recognition: any = null
  private isListening = false

  supportsNative(): boolean {
    if (typeof window === 'undefined') return false
    return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition
  }

  async start(
    onResult: (result: { transcript: string; isFinal: boolean; confidence: number }) => void,
    onEnd: () => void,
    _mode: 'native' | 'whisper' = 'native'
  ): Promise<boolean> {
    if (this.supportsNative()) {
      return this.startNative(onResult, onEnd)
    }
    return false
  }

  private startNative(
    onResult: (result: { transcript: string; isFinal: boolean; confidence: number }) => void,
    onEnd: () => void
  ): boolean {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) return false

    this.recognition = new SpeechRecognition()
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = 'en-US'
    this.recognition.maxAlternatives = 1

    this.recognition.onresult = (event: any) => {
      let finalText = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript
        }
      }
      if (finalText) {
        onResult({
          transcript: finalText.trim(),
          isFinal: true,
          confidence: event.results[event.results.length - 1][0].confidence,
        })
      }
    }

    this.recognition.onend = () => {
      this.isListening = false
      onEnd()
    }

    this.recognition.onerror = () => {
      this.isListening = false
      onEnd()
    }

    try {
      this.recognition.start()
      this.isListening = true
      return true
    } catch {
      return false
    }
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }
}

export const sttService = new STTService()
