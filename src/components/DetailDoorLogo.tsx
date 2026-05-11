// logo-full.jpeg / logo-wordmark.jpeg are 1254×1254 square images.
// mix-blend-mode: screen makes the black background disappear over dark site bg.
// The container clips to just the text area via overflow:hidden + negative marginTop.

// logo-full.jpeg: wordmark + tagline occupy y≈34%–58% of image height
const FULL_TOP  = 0.34
const FULL_FRAC = 0.24

// logo-wordmark.jpeg: wordmark only occupies y≈40%–56%
const MARK_TOP  = 0.40
const MARK_FRAC = 0.16

export interface DetailDoorLogoProps {
  height?: number
  showTagline?: boolean
  // color / preview kept for API compatibility but unused — image is always white-on-transparent
  color?: string
  preview?: boolean
}

export function DetailDoorLogo({
  height      = 64,
  showTagline = true,
}: DetailDoorLogoProps) {
  const src       = showTagline ? '/logo-full.jpeg' : '/logo-wordmark.jpeg'
  const top       = showTagline ? FULL_TOP : MARK_TOP
  const frac      = showTagline ? FULL_FRAC : MARK_FRAC
  const imgSize   = Math.round(height / frac)
  const negMargin = Math.round(top * imgSize)

  return (
    <div
      style={{
        height:     `${height}px`,
        width:      `${imgSize}px`,
        overflow:   'hidden',
        display:    'inline-block',
        flexShrink: 0,
      }}
      role="img"
      aria-label={showTagline ? 'detail door — clean. delivered.' : 'detail door'}
    >
      <img
        src={src}
        alt=""
        style={{
          display:       'block',
          width:         `${imgSize}px`,
          height:        `${imgSize}px`,
          marginTop:     `-${negMargin}px`,
          mixBlendMode:  'screen',
        }}
      />
    </div>
  )
}
