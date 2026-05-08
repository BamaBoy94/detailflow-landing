// ─── Coordinate system ────────────────────────────────────────────────────────
// Font: Comfortaa Regular 400, 96px, viewBox 900 × {220|160}
// Wordmark baseline: y = 135
//
// Advance estimates for "detail door" at 96px Comfortaa:
//   d≈63  e≈58  t≈43  a≈60  i≈28  l≈28  sp≈28  d≈63  → "detail d" ≈ 371px
//   o≈64  o≈64  r≈43  → total ≈ 542px
//   text-anchor="middle" at x=450 → left edge ≈ 179px
//
// First "o" in "door": center x≈582, center y≈110
//   x-height ≈ 51px → inner radius ≈ 18px, stroke width ≈ 9px
//
// Door motif (reference image): "o" ring is INTACT.
//   Two white elements float inside the black interior:
//   1. SEAM  — thin vertical rect touching the right inner wall
//   2. KNOB  — small square to the left of the seam, ≈35% from seam top

const OX  = 582   // "o" center x  (adjust ±10 after visual check)
const OCY = 110   // "o" center y
const IR  = 18    // inner radius

// Seam: thin white rect on right inner wall of "o" interior
const SEAM_X = OX + IR - 3    // 597  (seam right edge touches inner wall at 600)
const SEAM_W = 3
const SEAM_Y = OCY - 14       // 96   (4px from top of inner area)
const SEAM_H = 28             // ends 4px from bottom of inner area

// Knob: small white square to the left of the seam
const KNOB_X  = SEAM_X - 9   // 588
const KNOB_W  = 5
const KNOB_H  = 5
const KNOB_Y  = SEAM_Y + Math.round(SEAM_H * 0.35)  // 106  (~35% from seam top)
const KNOB_RX = 1             // very slight corner rounding

// ─── Component ────────────────────────────────────────────────────────────────

export interface DetailDoorLogoProps {
  /** Rendered height in px. Width scales to preserve aspect ratio. */
  height?: number
  /** Fill color for all elements. */
  color?: string
  /** Show "clean. delivered." tagline below the wordmark. */
  showTagline?: boolean
  /** Add a solid black background (for standalone preview/social use). */
  preview?: boolean
}

export function DetailDoorLogo({
  height      = 64,
  color       = '#FFFFFF',
  showTagline = true,
  preview     = false,
}: DetailDoorLogoProps) {
  const VH = showTagline ? 220 : 160

  return (
    <svg
      viewBox={`0 0 900 ${VH}`}
      height={height}
      aria-label="detail door — clean. delivered."
      style={{ display: 'block' }}
    >
      {preview && <rect width="900" height={VH} fill="#000000" />}

      {/* ── Wordmark — "o" ring is fully intact, no mask ── */}
      <text
        x="450"
        y="135"
        textAnchor="middle"
        fontFamily="'Comfortaa', 'Nunito', 'Varela Round', sans-serif"
        fontWeight="400"
        fontSize="96"
        letterSpacing="1"
        fill={color}
      >
        detail door
      </text>

      {/* ── Door motif: seam (vertical strip) + knob (small square) ── */}
      {/* Both float inside the black interior of the first "o" in "door" */}
      <rect
        x={SEAM_X} y={SEAM_Y}
        width={SEAM_W} height={SEAM_H}
        fill={color}
      />
      <rect
        x={KNOB_X} y={KNOB_Y}
        width={KNOB_W} height={KNOB_H}
        rx={KNOB_RX}
        fill={color}
      />

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
