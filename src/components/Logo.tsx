import { useId } from 'react'

// ── Handle geometry (SVG coordinate space: viewBox 0 0 420 80, font-size 72, baseline y=68)
// "detail d" advance width in Poppins Light 72px ≈ 257px → first "o" starts at x=257
// Adjust OX if the slot appears on the wrong letter after visual check.
const OX  = 257   // x-start of first "o" in "door"
const OW  = 46    // advance width of "o" glyph
const OCY = 49    // vertical center of "o" (baseline − x-height/2 = 68 − 19.3)
const SW  = 6     // stroke width of Poppins Light "o" at 72px

// Inner right edge of the "o" ring
const INNER_RIGHT = OX + OW / 2 + (OW / 2 - SW)  // 297

// Door-frame slot: thin vertical cut through the right stroke of "o"
const SLOT_X = INNER_RIGHT - 1   // start 1px inside inner edge
const SLOT_Y = OCY - 8           // centered on OCY
const SLOT_W = 9                  // spans interior→stroke→outer edge
const SLOT_H = 16

// Door knob: small filled circle inside the "o", near the inner right edge
const KNOB_CX = INNER_RIGHT - 7  // 290 — inside the ring
const KNOB_CY = OCY - 4          // 45 — upper portion (handles sit above mid)
const KNOB_R  = 4.5

export function Logo({
  scale = 1,
  color = '#FFFFFF',
  taglineColor = '#A6A6A6',
  showTagline = true,
}: {
  scale?: number
  color?: string
  taglineColor?: string
  showTagline?: boolean
}) {
  const uid = useId()
  const maskId = `dd-h-${uid.replace(/[^a-z0-9]/gi, '')}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: `${3 * scale}px` }}>
      <svg
        viewBox="0 0 420 80"
        height={Math.round(28 * scale)}
        aria-label="detail door"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <mask id={maskId}>
            <rect width="420" height="80" fill="white" />
            {/* Cut door-frame slot into the right stroke of the first "o" in "door" */}
            <rect
              x={SLOT_X} y={SLOT_Y}
              width={SLOT_W} height={SLOT_H}
              rx="1.5"
              fill="black"
            />
          </mask>
        </defs>

        <text
          x="0"
          y="68"
          fontFamily='"Poppins", sans-serif'
          fontWeight="300"
          fontSize="72"
          fill={color}
          mask={`url(#${maskId})`}
        >
          detail door
        </text>

        {/* Door knob — small filled circle inside the "o" ring */}
        <circle cx={KNOB_CX} cy={KNOB_CY} r={KNOB_R} fill={color} />
      </svg>

      {showTagline && (
        <span style={{
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 300,
          fontSize: `${0.52 * scale}rem`,
          letterSpacing: '0.32em',
          color: taglineColor,
          textTransform: 'lowercase',
        }}>
          clean. delivered.
        </span>
      )}
    </div>
  )
}
