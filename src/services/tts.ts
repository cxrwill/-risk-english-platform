export interface TTSOptions {
  voice?: string
  rate?: number
  pitch?: number
  onEnd?: () => void
}

export class TTSService {
  private speaking = false
  private queue: Array<{ text: string; options?: TTSOptions }> = []
  private processing = false

  get isSpeaking(): boolean {
    return this.speaking
  }

  speak(text: string, options?: TTSOptions): Promise<void> {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = options?.rate ?? 0.95
      utterance.pitch = options?.pitch ?? 1.0

      if (options?.voice) {
        const voices = synth.getVoices()
        const voice = voices.find((v) => v.name === options.voice)
        if (voice) utterance.voice = voice
      }

      utterance.onend = () => {
        this.speaking = false
        this.processQueue()
        options?.onEnd?.()
        resolve()
      }

      utterance.onerror = () => {
        this.speaking = false
        this.processQueue()
        resolve()
      }

      this.queue.push({ text, options })
      if (!this.processing) {
        this.processQueue()
      }
    })
  }

  private processQueue(): void {
    if (this.queue.length === 0 || this.processing) return
    this.processing = true
    this.speaking = true

    const { text, options } = this.queue.shift()!
    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = options?.rate ?? 0.95
    utterance.pitch = options?.pitch ?? 1.0

    utterance.onend = () => {
      this.speaking = false
      this.processing = false
      options?.onEnd?.()
      this.processQueue()
    }

    utterance.onerror = () => {
      this.speaking = false
      this.processing = false
      this.processQueue()
    }

    synth.speak(utterance)
  }

  cancel(): void {
    window.speechSynthesis.cancel()
    this.speaking = false
    this.processing = false
    this.queue = []
  }

  loadVoices(): Promise<void> {
    return new Promise((resolve) => {
      if (window.speechSynthesis.getVoices().length > 0) {
        resolve()
        return
      }
      window.speechSynthesis.onvoiceschanged = () => resolve()
    })
  }
}

export const ttsService = new TTSService()
