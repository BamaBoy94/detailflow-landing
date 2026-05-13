import React, { useState } from 'react'
import { RefreshCw, Menu, X, FlaskConical } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { DisclaimerBar } from './sharp/DisclaimerBar'

interface LayoutProps {
  children: React.ReactNode
  pageTitle: string
  isMockMode?: boolean
  onRefresh?: () => void
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  pageTitle,
  isMockMode = false,
  onRefresh,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: '#0a0a0a', color: '#ffffff' }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — fixed on mobile, static on desktop */}
      <div
        className={[
          'fixed inset-y-0 left-0 z-40 transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <Sidebar />
      </div>

      {/* Main column */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Top header */}
        <header
          className="flex items-center gap-3 px-4 sm:px-6 h-14 shrink-0"
          style={{
            background: '#111111',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden cursor-pointer p-1 rounded transition-colors duration-150 hover:bg-white/5"
            onClick={() => setSidebarOpen(v => !v)}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Page title */}
          <h1
            className="flex-1 text-sm font-semibold truncate"
            style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-sans)' }}
          >
            {pageTitle}
          </h1>

          {/* Mock mode badge */}
          {isMockMode && (
            <span
              className="hidden sm:inline-flex items-center gap-1.5 rounded border px-2 py-1 text-[11px] font-medium tracking-wide"
              style={{
                background: 'rgba(139,92,246,0.12)',
                borderColor: 'rgba(139,92,246,0.3)',
                color: '#a78bfa',
              }}
              title="Running with mock/demo data"
            >
              <FlaskConical size={11} strokeWidth={2} />
              Mock Mode
            </span>
          )}

          {/* Refresh button */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs cursor-pointer transition-all duration-150 hover:bg-white/5"
              style={{
                background: 'transparent',
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.45)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
              aria-label="Refresh data"
            >
              <RefreshCw size={13} strokeWidth={2} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}
        </header>

        {/* Scrollable content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: '#0a0a0a' }}
        >
          {children}
        </main>

        {/* Sticky disclaimer footer */}
        <DisclaimerBar />
      </div>
    </div>
  )
}

export default Layout
