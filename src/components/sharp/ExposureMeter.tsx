import { cn } from '@/lib/utils'

interface Props {
  used: number
  max: number
  label: string
  stopLoss?: number
  className?: string
}

export function ExposureMeter({ used, max, label, stopLoss, className }: Props) {
  const pct = Math.min((used / max) * 100, 100)
  const isOverhalf = pct >= 50
  const isDanger = pct >= 90

  const barColor = isDanger
    ? 'bg-[#ef4444]'
    : isOverhalf
      ? 'bg-[#f59e0b]'
      : 'bg-[#10b981]'

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="sf-label">{label}</span>
        <span className="text-[0.78rem] sf-mono text-white/60">
          {used.toFixed(1)} / {max} units
        </span>
      </div>
      <div className="relative h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${pct}%` }}
        />
        {stopLoss !== undefined && stopLoss < 0 && (
          <div
            className="absolute top-0 bottom-0 w-px bg-[#ef4444]/50"
            style={{ left: `${Math.min(Math.abs(stopLoss) / max * 100, 100)}%` }}
          />
        )}
      </div>
      <div className="flex items-center justify-between text-[0.65rem] text-white/25">
        <span>0</span>
        {stopLoss !== undefined && (
          <span className="text-[#ef4444]/50">stop: {stopLoss}u</span>
        )}
        <span>max: {max}u</span>
      </div>
    </div>
  )
}
