import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ApprovalQueue from './pages/ApprovalQueue'
import Watchlist from './pages/Watchlist'
import Performance from './pages/Performance'
import RulesSettings from './pages/RulesSettings'
import Bankroll from './pages/Bankroll'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/queue" element={<ApprovalQueue />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/settings" element={<RulesSettings />} />
        <Route path="/bankroll" element={<Bankroll />} />
      </Routes>
    </BrowserRouter>
  )
}
