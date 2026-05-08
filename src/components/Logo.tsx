import { DetailDoorLogo } from './DetailDoorLogo'

/**
 * Convenience wrapper used by Nav / Footer.
 * Converts the legacy `scale` prop into a pixel height for DetailDoorLogo.
 * scale=1 → 64px tall SVG (wordmark + tagline together).
 */
export function Logo({
  scale       = 1,
  color       = '#FFFFFF',
  showTagline = true,
}: {
  scale?: number
  color?: string
  taglineColor?: string   // accepted but not forwarded — SVG handles it internally
  showTagline?: boolean
}) {
  return (
    <DetailDoorLogo
      height={Math.round(64 * scale)}
      color={color}
      showTagline={showTagline}
    />
  )
}
