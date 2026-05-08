import { useId } from 'react'

// ─── Coordinate system ────────────────────────────────────────────────────────
// Font: Comfortaa Regular 400, 96px
// ViewBox width: 900
// Wordmark baseline: y = 135
//
// Estimated advance widths at 96px (Comfortaa Regular):
//   d≈63  e≈58  t≈43  a≈60  i≈28  l≈28  sp≈28  d≈63  → "detail d" ≈ 371px
//   o≈64  o≈64  r≈43  → total "detail door" ≈ 542px
//   text-anchor="middle" at x=450 → left edge at 450−271 = 179px
//
// First "o" in "door" (the door):
//   starts at 179+371 = 550px, center x = 550+32 = 582
//   x-height ≈ 51px → top at 135−51=84, center y = 84+25.5 ≈ 110
//   stroke width ≈ 9px  →  outer r ≈ 27,  inner r ≈ 18
//   inner right edge: 582+18 = 600,  outer right edge: 582+27 = 609

const OX  = 582   // "o" center x
const OCY = 110   // "o" center y
const IR  = 18    // inner radius
const SW  = 9     // stroke width (outer r − inner r)

// Door seam: vertical cut through the right stroke of the "o"
const SEAM_X = OX + IR - 1       // 599 — start 1px inside inner wall
const SEAM_Y = OCY - 19          // 91
const SEAM_W = SW + 3            // 12 — spans through stroke + small overshoot
const SEAM_H = 38                // ≈ 0.75 × x-height

// Doorknob: small circle inside the "o", right half, slightly above center
const KNOB_CX = OX + 5           // 587 — right portion of interior
const KNOB_CY = OCY - 7          // 103 — slightly above center
const KNOB_R  = 4

// ─── Component ────────────────────────────────────────────────────────────────

export interface DetailDoorLogoProps {
  /** Rendered height in px. Width scales to preserve aspect ratio. */
  height?: number
  /** Fill color for all elements. */
  color?: string
  /** Show "clean. delivered." tagline below the wordmark. */
  showTagline?: boolean
  /** Render a solid black background (for preview/social use). */
  preview?: boolean
}

/**
 * Detail Door brand logo — "detail door" wordmark with door-handle motif
 * in the first "o" of "door" + "clean. delivered." tagline.
 *
 * Font: Comfortaa (must be loaded via Google Fonts or @font-face).
 * Adjust OX constant if the seam appears misaligned after visual check.
 */
export function DetailDoorLogo({
  height    = 64,
  color     = '#FFFFFF',
  showTagline = true,
  preview   = false,
}: DetailDoorLogoProps) {
  const uid    = useId()
  const maskId = `ddl-${uid.replace(/[^a-z0-9]/gi, '')}`
  const VH     = showTagline ? 220 : 160

  return (
    <svg
      viewBox={`0 0 900 ${VH}`}
      height={height}
      aria-label="detail door — clean. delivered."
      style={{ display: 'block' }}
    >
      {preview && <rect width="900" height={VH} fill="#000000" />}

      <defs>
        <mask id={maskId}>
          <rect width="900" height={VH} fill="white" />
          {/* Door seam — cuts through right wall of first "o" in "door" */}
          <rect
            x={SEAM_X} y={SEAM_Y}
            width={SEAM_W} height={SEAM_H}
            fill="black"
          />
        </mask>
      </defs>

      {/* ── Wordmark ── */}
      <text
        x="450"
        y="135"
        textAnchor="middle"
        fontFamily="'Comfortaa', 'Nunito', 'Varela Round', sans-serif"
        fontWeight="400"
        fontSize="96"
        letterSpacing="1"
        fill={color}
        mask={`url(#${maskId})`}
      >
        detail door
      </text>

      {/* ── Doorknob ── */}
      <circle cx={KNOB_CX} cy={KNOB_CY} r={KNOB_R} fill={color} />

      {/* ── Tagline ── */}
      {showTagline && (
        <text
          x="450"
          y="181"
          textAnchor="middle"
          fontFamily="'Comfortaa', 'Nunito', 'Varela Round', sans-serif"
          fontWeight="300"
          fontSize="19"
          letterSpacing="7"
          fill={color}
          opacity="0.88"
        >
          clean. delivered.
        </text>
      )}
    </svg>
  )
}
