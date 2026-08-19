import { useConversationStore } from '../store/conversation'
import type { FeedbackItem } from '../types'

export default function CoachPanel() {
  const { feedback, score, scenario, getScenario } = useConversationStore()
  const s = getScenario()!

  if (!scenario) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center">
        <div className="text-4xl mb-3">📊</div>
        <p className="text-surface-500 text-sm">
          Select a scenario to see your performance feedback
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-3 border-b border-surface-700">
        <h3 className="text-sm font-semibold text-surface-200">
          Coach Panel
        </h3>
        <p className="text-xs text-surface-600 mt-0.5">
          Real-time feedback & scoring
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {score ? (
          <div className="p-4 rounded-xl bg-surface-800 border border-surface-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                Overall Score
              </span>
              <span
                className="text-2xl font-bold"
                style={{ color: s.color }}
              >
                {score.overall}
              </span>
            </div>
            <div className="space-y-2">
              <MetricBar label="Fluency" value={score.fluency} color="#0ea5e9" />
              <MetricBar label="Accuracy" value={score.accuracy} color="#22c55e" />
              <MetricBar label="Terminology" value={score.terminology} color="#f59e0b" />
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-surface-800/50 border border-surface-700/50 text-center">
            <p className="text-xs text-surface-600">
              Score will appear after your first response
            </p>
          </div>
        )}

        {feedback.length > 0 && (
          <div>
            <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
              Feedback
            </span>
            <div className="mt-2 space-y-2">
              {feedback.map((item: FeedbackItem) => (
                <FeedbackCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        <div>
          <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
            Key Terms to Use
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {s.expectedKeywords.map((kw: string) => (
              <span
                key={kw}
                className="text-xs px-2 py-1 rounded-full bg-surface-800 border border-surface-700 text-surface-500"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
          <p className="text-xs text-surface-500 leading-relaxed">
            <strong className="text-surface-400">Scenario:</strong> {s.description}
          </p>
        </div>
      </div>
    </div>
  )
}

function MetricBar({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-surface-400 w-20">{label}</span>
      <div className="flex-1 h-1.5 bg-surface-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-xs text-surface-500 w-8 text-right">{value}</span>
    </div>
  )
}

function FeedbackCard({ item }: { item: FeedbackItem }) {
  const icons: Record<string, string> = { grammar: '📝', terminology: '📖', business: '💼', praise: '⭐' }
  const colors: Record<string, string> = {
    grammar: 'border-amber-500/30 bg-amber-500/5',
    terminology: 'border-blue-500/30 bg-blue-500/5',
    business: 'border-purple-500/30 bg-purple-500/5',
    praise: 'border-green-500/30 bg-green-500/5',
  }
  const textColors: Record<string, string> = {
    grammar: 'text-amber-400',
    terminology: 'text-blue-400',
    business: 'text-purple-400',
    praise: 'text-green-400',
  }

  return (
    <div
      className={`p-3 rounded-lg border ${colors[item.type]} animate-slide-up`}
    >
      <div className="flex items-start gap-2">
        <span className="text-base">{icons[item.type]}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-medium ${textColors[item.type]}`}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </p>
          <p className="text-xs text-surface-300 mt-0.5">{item.message}</p>
          {item.suggestion && (
            <p className="text-xs text-surface-500 mt-1 italic">
              → {item.suggestion}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
