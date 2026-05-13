import React from 'react'
import { Star } from 'lucide-react'
import type { MarketBookLine } from '@/types'
import { formatOdds, juiceLevel } from '@/utils/odds'

interface MarketComparisonTableProps {
  comparison: MarketBookLine[]
  selectedBook: string
  selectedLine: number
  selectedOdds: number
}

function bestLine(rows: MarketBookLine[], betType: 'over' | 'under' = 'over'): MarketBookLine | null {
  if (!rows.length) return null
  return rows.reduce((best, row) => {
    const isBetter =
      betType === 'over'
        ? row.line < best.line || (row.line === best.line && row.odds > best.odds)
        : row.line > best.line || (row.line === best.line && row.odds > best.odds)
    return isBetter ? row : best
  })
}

function oddsColor(odds: number): string {
  const level = juiceLevel(odds)
  if (level === 'ok') return '#10b981'
  if (level === 'caution') return '#f59e0b'
  return '#ef4444'
}

function deltaLabel(
  row: MarketBookLine,
  selectedLine: number,
  selectedOdds: number,
  isSelected: boolean,
): React.ReactNode {
  if (isSelected) {
    return (
      <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
        —
      </span>
    )
  }
  const lineDelta = row.line - selectedLine
  const oddsDelta = row.odds - selectedOdds

  const linePart = lineDelta !== 0 ? (
    <span style={{ color: lineDelta < 0 ? '#10b981' : '#ef4444' }}>
      {lineDelta > 0 ? '+' : ''}{lineDelta.toFixed(1)}
    </span>
  ) : null

  const oddsPart = oddsDelta !== 0 ? (
    <span style={{ color: oddsDelta > 0 ? '#10b981' : '#ef4444', marginLeft: linePart ? 6 : 0 }}>
      {oddsDelta > 0 ? '+' : ''}{oddsDelta}
    </span>
  ) : null

  if (!linePart && !oddsPart) {
    return <span style={{ color: 'rgba(255,255,255,0.3)' }} className="text-[10px] font-mono">—</span>
  }

  return (
    <span className="inline-flex gap-1.5 text-[10px] font-mono items-center">
      {linePart}
      {oddsPart}
    </span>
  )
}

export const MarketComparisonTable: React.FC<MarketComparisonTableProps> = ({
  comparison,
  selectedBook,
  selectedLine,
  selectedOdds,
}) => {
  const best = bestLine(comparison)

  return (
    <div className="flex flex-col gap-2">
      <span className="sf-label">Market Comparison</span>
      <div
        className="rounded overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              <th
                className="text-left px-3 py-2 font-medium tracking-wider uppercase"
                style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem', letterSpacing: '0.15em' }}
              >
                Sportsbook
              </th>
              <th
                className="text-center px-3 py-2 font-medium tracking-wider uppercase"
                style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem', letterSpacing: '0.15em' }}
              >
                Line
              </th>
              <th
                className="text-center px-3 py-2 font-medium tracking-wider uppercase"
                style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem', letterSpacing: '0.15em' }}
              >
                Odds
              </th>
              <th
                className="text-right px-3 py-2 font-medium tracking-wider uppercase"
                style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem', letterSpacing: '0.15em' }}
              >
                vs Selected
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row, idx) => {
              const isSelected = row.sportsbook === selectedBook
              const isBest =
                best?.sportsbook === row.sportsbook &&
                best?.line === row.line &&
                best?.odds === row.odds

              return (
                <tr
                  key={`${row.sportsbook}-${idx}`}
                  style={{
                    background: isSelected
                      ? 'rgba(59,130,246,0.10)'
                      : idx % 2 === 0
                      ? 'transparent'
                      : 'rgba(255,255,255,0.02)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <span
                          className="w-1 h-1 rounded-full flex-shrink-0"
                          style={{ background: '#3b82f6' }}
                        />
                      )}
                      <span
                        className="font-medium"
                        style={{
                          color: isSelected ? '#60a5fa' : 'rgba(255,255,255,0.8)',
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        {row.sportsbook}
                      </span>
                      {isSelected && (
                        <span
                          className="text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded"
                          style={{
                            color: '#60a5fa',
                            background: 'rgba(59,130,246,0.15)',
                            border: '1px solid rgba(59,130,246,0.3)',
                          }}
                        >
                          Selected
                        </span>
                      )}
                      {isBest && !isSelected && (
                        <span
                          className="inline-flex items-center gap-0.5 text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded"
                          style={{
                            color: '#10b981',
                            background: 'rgba(16,185,129,0.12)',
                            border: '1px solid rgba(16,185,129,0.3)',
                          }}
                        >
                          <Star size={8} strokeWidth={2.5} />
                          Best
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span
                      className="font-mono font-semibold"
                      style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-mono)' }}
                    >
                      {row.line.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span
                      className="font-mono font-semibold"
                      style={{ color: oddsColor(row.odds), fontFamily: 'var(--font-mono)' }}
                    >
                      {formatOdds(row.odds)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    {deltaLabel(row, selectedLine, selectedOdds, isSelected)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MarketComparisonTable
