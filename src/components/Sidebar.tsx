import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardCheck,
  Eye,
  TrendingUp,
  Settings,
  DollarSign,
} from 'lucide-react'

interface NavItem {
  to: string
  label: string
  icon: React.ElementType
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard',   label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/queue',       label: 'Approval Queue',  icon: ClipboardCheck },
  { to: '/watchlist',   label: 'Watchlist',        icon: Eye },
  { to: '/performance', label: 'Performance',      icon: TrendingUp },
  { to: '/settings',    label: 'Rules & Settings', icon: Settings },
  { to: '/bankroll',    label: 'Bankroll',         icon: DollarSign },
]

export const Sidebar: React.FC = () => {
  return (
    <aside
      className="flex flex-col h-full w-56 shrink-0"
      style={{
        background: '#0a0a0a',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Branding */}
      <div
        className="px-5 py-5 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="text-base font-bold tracking-tight"
          style={{ color: '#10b981', fontFamily: 'var(--font-brand)' }}
        >
          Sharp Filter
        </div>
        <div
          className="text-[10px] tracking-widest uppercase mt-0.5"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          V2 · Analysis Engine
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3" aria-label="Primary navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-5 py-2.5 text-sm transition-colors duration-150 relative',
                isActive
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200',
              ].join(' ')
            }
            style={({ isActive }) =>
              isActive
                ? {
                    color: 'rgba(255,255,255,0.92)',
                    background: 'rgba(16,185,129,0.07)',
                    borderLeft: '2px solid #10b981',
                    paddingLeft: '18px', // compensate for border width
                  }
                : {
                    color: 'rgba(255,255,255,0.4)',
                    borderLeft: '2px solid transparent',
                    paddingLeft: '18px',
                  }
            }
            aria-current={undefined}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={15}
                  strokeWidth={isActive ? 2.5 : 1.75}
                  style={{ color: isActive ? '#10b981' : 'rgba(255,255,255,0.35)', flexShrink: 0 }}
                />
                <span style={{ fontWeight: isActive ? 500 : 400 }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom disclaimer */}
      <div
        className="px-5 py-3 shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Analysis only. Does not place bets.
          <br />
          Use responsibly.
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
