import { useConversationStore } from '../store/conversation'

export default function TopBar() {
  const { sttMode, ttsMode, toggleSTTMode, toggleTTSMode, resetScenario, getScenario } =
    useConversationStore()

  const s = getScenario()

  return (
    <header className="h-14 border-b border-surface-700 flex items-center justify-between px-5 bg-surface-900/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-lg">
          🌐
        </div>
        <div>
          <h1 className="text-sm font-bold text-surface-100 leading-none">
            Acquiring Risk English
          </h1>
          <p className="text-xs text-surface-500 leading-none mt-0.5">
            Training Platform
          </p>
        </div>
      </div>

      {s && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-800 border border-surface-700">
          <span className="text-sm">{s.icon}</span>
          <span className="text-xs text-surface-300 max-w-[160px] truncate">
            {s.title}
          </span>
          <button
            onClick={resetScenario}
            className="ml-1 text-surface-600 hover:text-surface-400 text-xs transition-colors"
            title="Reset scenario"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={toggleSTTMode}
          className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
            sttMode === 'native'
              ? 'border-primary-500/50 bg-primary-500/10 text-primary-400'
              : 'border-surface-700 bg-surface-800 text-surface-500 hover:border-surface-600'
          }`}
          title="Toggle STT mode"
        >
          🎙️ {sttMode === 'native' ? 'Native' : 'Whisper'}
        </button>
        <button
          onClick={toggleTTSMode}
          className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
            ttsMode === 'native'
              ? 'border-primary-500/50 bg-primary-500/10 text-primary-400'
              : 'border-surface-700 bg-surface-800 text-surface-500 hover:border-surface-600'
          }`}
          title="Toggle TTS mode"
        >
          🔊 {ttsMode === 'native' ? 'Native' : 'AI'}
        </button>
      </div>
    </header>
  )
}
