import { useState } from 'react'
import { useConversationStore } from '../store/conversation'
import { SCENARIOS } from '../data/scenarios'
import type { ScenarioId } from '../types'

export default function SceneSelector() {
  const { scenario, setScenario, resetScenario } = useConversationStore()
  const [selected, setSelected] = useState<ScenarioId | null>(scenario)

  const handleSelect = (id: ScenarioId) => {
    setSelected(id)
    resetScenario()
    setTimeout(() => setScenario(id), 50)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-surface-700">
        <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-widest">
          Training Scenarios
        </h2>
        <p className="text-xs text-surface-600 mt-1">
          Select a scenario to begin your training session
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {SCENARIOS.map((s) => {
          const isActive = selected === s.id
          return (
            <button
              key={s.id}
              onClick={() => handleSelect(s.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                isActive
                  ? 'border-primary-500 bg-primary-900/30 shadow-lg shadow-primary-500/10'
                  : 'border-surface-700 bg-surface-800/50 hover:border-surface-600 hover:bg-surface-700/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{s.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-surface-100">
                      {s.title}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        s.difficulty === 'Expert'
                          ? 'bg-danger-500/20 text-danger-500'
                          : s.difficulty === 'Advanced'
                          ? 'bg-accent-500/20 text-accent-500'
                          : 'bg-success-500/20 text-success-500'
                      }`}
                    >
                      {s.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-surface-500 mt-0.5">{s.subtitle}</p>
                  <p className="text-xs text-surface-600 mt-1.5 line-clamp-2">
                    {s.description}
                  </p>
                </div>
              </div>
              {isActive && (
                <div
                  className="mt-2 h-0.5 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="px-5 py-3 border-t border-surface-700">
        <p className="text-xs text-surface-600 text-center">
          {scenario ? 'Currently active — switch scenarios to start fresh' : 'Choose a scenario to begin training'}
        </p>
      </div>
    </div>
  )
}
