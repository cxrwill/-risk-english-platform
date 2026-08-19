export type ScenarioId = 'compliance' | 'representment' | 'rdr' | 'mastercom' | 'friendly-fraud'
export type MessageRole = 'system' | 'ai' | 'user'
export type STTMode = 'native' | 'whisper'
export type TTSMode = 'native' | 'transformers'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: number
}

export interface FeedbackItem {
  id: string
  type: 'grammar' | 'terminology' | 'business' | 'praise'
  message: string
  suggestion?: string
}

export interface ScoreMetrics {
  fluency: number
  accuracy: number
  terminology: number
  overall: number
}

export interface Scenario {
  id: ScenarioId
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
  initialMessage: string
  systemPrompt: string
  expectedKeywords: string[]
  difficulty: 'Intermediate' | 'Advanced' | 'Expert'
}

export interface ConversationState {
  scenario: ScenarioId | null
  messages: Message[]
  isRecording: boolean
  isAiThinking: boolean
  currentTranscript: string
  feedback: FeedbackItem[]
  score: ScoreMetrics | null
  sttMode: STTMode
  ttsMode: TTSMode
}
