import { useState, useEffect } from 'react'
import SceneSelector from './SceneSelector'
import VoicePanel from './VoicePanel'
import ChatPanel from './ChatPanel'
import CoachPanel from './CoachPanel'
import TopBar from './TopBar'

type Panel = 'voice' | 'chat' | 'coach'

export default function App() {
  const [activePanel, setActivePanel] = useState<Panel>('voice')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-dvh bg-surface-900 text-surface-100 flex flex-col">
      <TopBar />

      <div className="flex-1 flex overflow-hidden">
        {isMobile ? (
          <>
            <div className="flex border-b border-surface-700 bg-surface-900 sticky top-0 z-10">
              <TabButton active={activePanel === 'voice'} onClick={() => { setActivePanel('voice'); setSidebarOpen(false) }} icon="🎙️" label="Speak" />
              <TabButton active={activePanel === 'chat'} onClick={() => { setActivePanel('chat'); setSidebarOpen(false) }} icon="💬" label="Chat" />
              <TabButton active={activePanel === 'coach'} onClick={() => { setActivePanel('coach'); setSidebarOpen(false) }} icon="📊" label="Coach" />
              <TabButton active={sidebarOpen} onClick={() => { setSidebarOpen(!sidebarOpen); setActivePanel('voice') }} icon="📋" label="Scenes" />
            </div>
            <div className="flex-1 overflow-hidden">
              {sidebarOpen ? <SceneSelector /> : activePanel === 'voice' ? <VoicePanel /> : activePanel === 'chat' ? <ChatPanel /> : <CoachPanel />}
            </div>
          </>
        ) : (
          <>
            <aside className="w-72 flex-shrink-0 border-r border-surface-700 overflow-hidden hidden lg:block">
              <SceneSelector />
            </aside>
            <main className="flex-1 flex flex-col min-w-0 border-r border-surface-700">
              <VoicePanel />
            </main>
            <aside className="w-80 flex-shrink-0 flex flex-col overflow-hidden hidden lg:flex">
              <div className="flex-1 min-h-0 border-b border-surface-700">
                <ChatPanel />
              </div>
              <div className="h-72 flex-shrink-0 overflow-hidden">
                <CoachPanel />
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors ${
        active ? 'text-primary-400 border-b-2 border-primary-400 bg-primary-500/5' : 'text-surface-500 hover:text-surface-300'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  )
}
