import { create } from 'zustand'
import type {
  ConversationState,
  ScenarioId,
  FeedbackItem,
  ScoreMetrics,
  Scenario,
} from '../types'
import { SCENARIOS } from '../data/scenarios'

const initialState: ConversationState = {
  scenario: null,
  messages: [],
  isRecording: false,
  isAiThinking: false,
  currentTranscript: '',
  feedback: [],
  score: null,
  sttMode: 'native',
  ttsMode: 'native',
}

interface ConversationStore extends ConversationState {
  setScenario: (id: ScenarioId) => void
  addMessage: (role: 'system' | 'ai' | 'user', content: string) => void
  setRecording: (recording: boolean) => void
  setAiThinking: (thinking: boolean) => void
  setTranscript: (text: string) => void
  setFeedback: (feedback: FeedbackItem[]) => void
  setScore: (score: ScoreMetrics | null) => void
  resetScenario: () => void
  toggleSTTMode: () => void
  toggleTTSMode: () => void
  clearMessages: () => void
  getScenario: () => Scenario | undefined
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  ...initialState,

  setScenario: (id) => {
    const scenario = SCENARIOS.find((s) => s.id === id)
    if (!scenario) return
    set({
      scenario: id,
      messages: [
        {
          id: crypto.randomUUID(),
          role: 'ai',
          content: scenario.initialMessage,
          timestamp: Date.now(),
        },
      ],
      feedback: [],
      score: null,
      currentTranscript: '',
    })
  },

  addMessage: (role, content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: crypto.randomUUID(), role, content, timestamp: Date.now() },
      ],
    })),

  setRecording: (isRecording) => set({ isRecording }),
  setAiThinking: (isAiThinking) => set({ isAiThinking }),
  setTranscript: (currentTranscript) => set({ currentTranscript }),
  setFeedback: (feedback) => set({ feedback }),
  setScore: (score) => set({ score }),
  clearMessages: () => set({ messages: [] }),

  resetScenario: () => set(initialState),

  toggleSTTMode: () =>
    set((state) => ({
      sttMode: state.sttMode === 'native' ? 'whisper' : 'native',
    })),

  toggleTTSMode: () =>
    set((state) => ({
      ttsMode: state.ttsMode === 'native' ? 'transformers' : 'native',
    })),

  getScenario: () => {
    const { scenario: id } = get()
    return SCENARIOS.find((s) => s.id === id)
  },
}))
