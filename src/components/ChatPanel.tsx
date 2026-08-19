import { useEffect, useRef } from 'react'
import { useConversationStore } from '../store/conversation'
import type { Message } from '../types'

export default function ChatPanel() {
  const { messages, scenario, getScenario } = useConversationStore()
  const bottomRef = useRef<HTMLDivElement>(null)
  const s = getScenario()!

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!scenario) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-lg font-semibold text-surface-200 mb-2">
          No Scenario Selected
        </h3>
        <p className="text-sm text-surface-500 max-w-xs">
          Choose a training scenario from the panel to begin your conversation.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-3 border-b border-surface-700">
        <div className="flex items-center gap-2">
          <span className="text-lg">{s.icon}</span>
          <div>
            <h3 className="text-sm font-semibold text-surface-100">{s.title}</h3>
            <p className="text-xs text-surface-500">{s.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-surface-500 text-sm">Waiting for the scenario to begin...</p>
          </div>
        )}

        {messages.map((msg: Message) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-br-sm'
                  : msg.role === 'system'
                  ? 'bg-surface-700 text-surface-300 rounded-lg text-xs italic'
                  : 'bg-surface-800 border border-surface-700 text-surface-200 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {useConversationStore.getState().isAiThinking && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-surface-800 border border-surface-700 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-surface-500">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {messages.length > 0 && messages.length < 4 && (
        <div className="px-4 py-2 border-t border-surface-700 flex flex-wrap gap-2">
          <span className="text-xs text-surface-600 self-center">Quick responses:</span>
          {s.expectedKeywords.slice(0, 3).map((kw: string) => (
            <button
              key={kw}
              onClick={() => {
                const store = useConversationStore.getState()
                store.addMessage('user', `I would like to discuss ${kw.toLowerCase()} in detail.`)
              }}
              className="text-xs px-2 py-1 rounded-full bg-surface-800 border border-surface-700 text-surface-400 hover:border-primary-500 hover:text-primary-400 transition-colors"
            >
              {kw}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
