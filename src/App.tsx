import { useState, useEffect } from 'react'
import { Menu, ArrowRight, MapPin, Check, ChevronRight } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

const BOOKING_URL = 'https://form.typeform.com/to/CnNOTLPV'

// ── Brand palette ────────────────────────────────────────────────────────────
const C = {
  offBlack:  '#0D0D0D',
  charcoal:  '#1A1A1A',
  silver:    '#A6A6A6',
  white:     '#FFFFFF',
  border:    'rgba(166,166,166,0.15)',   // silver @ 15%
  borderHi:  'rgba(166,166,166,0.25)',
}

export default function App() {
  return (
    <div style={{ background: C.offBlack, color: C.white, minHeight: '100svh' }}>
      <Nav />
      <Hero />
      <TrustBar />
      <Services />
      <Process />
      <CtaBanner />
      <Footer />
    </div>
  )
}

/* ─── WORDMARK ────────────────────────────────────────────────────────────── */

function Wordmark({ scale = 1 }: { scale?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 3 }}>
      <span style={{
        fontFamily: '"Poppins", sans-serif',
        fontWeight: 300,
        fontSize: `${1.35 * scale}rem`,
        letterSpacing: '0.02em',
        color: C.white,
      }}>
        detail door
      </span>
      <span style={{
        fontFamily: '"Poppins", sans-serif',
        fontWeight: 300,
        fontSize: `${0.52 * scale}rem`,
        letterSpacing: '0.32em',
        color: C.silver,
        textTransform: 'lowercase' as const,
      }}>
        clean. delivered.
      </span>
    </div>
  )
}

/* ─── NAV ─────────────────────────────────────────────────────────────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = ['Services', 'About', 'Gallery', 'Reviews']

  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 50,
    background: scrolled ? 'rgba(13,13,13,0.97)' : 'transparent',
    borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
    transition: 'background 0.3s, border-color 0.3s',
  }

  return (
    <header style={headerStyle}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between" style={{ height: 72 }}>

        <a href="#" style={{ textDecoration: 'none' }}>
          <Wordmark scale={1} />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {links.map(l => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              style={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 400,
                fontSize: '0.72rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: C.silver,
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = C.white)}
              onMouseLeave={e => (e.currentTarget.style.color = C.silver)}
            >
              {l}
            </a>
          ))}
        </nav>

        {/* BOOK NOW — rectangular border, matches brand kit exactly */}
        <div className="flex items-center gap-3">
          <a
            href={BOOKING_URL}
            className="hidden md:inline-flex items-center justify-center"
            style={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 500,
              fontSize: '0.7rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: C.white,
              border: `1px solid ${C.white}`,
              padding: '9px 22px',
              textDecoration: 'none',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = C.white
              e.currentTarget.style.color = C.offBlack
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = C.white
            }}
          >
            Book Now
          </a>

          {/* Mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2"
                style={{ color: C.silver, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72"
              style={{ background: C.offBlack, borderLeft: `1px solid ${C.border}` }}
            >
              <div className="flex flex-col h-full pt-8 pb-10 px-4">
                <Wordmark scale={0.9} />
                <nav className="flex flex-col gap-0 flex-1 mt-10">
                  {links.map((l, i) => (
                    <div key={l}>
                      <a
                        href={`#${l.toLowerCase()}`}
                        style={{
                          display: 'block',
                          padding: '16px 0',
                          fontFamily: '"Poppins", sans-serif',
                          fontWeight: 400,
                          fontSize: '0.78rem',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: C.silver,
                          textDecoration: 'none',
                        }}
                      >
                        {l}
                      </a>
                      {i < links.length - 1 && <Separator style={{ background: C.border }} />}
                    </div>
                  ))}
                </nav>
                <a
                  href={BOOKING_URL}
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    border: `1px solid ${C.white}`,
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 500,
                    fontSize: '0.72rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: C.white,
                    textDecoration: 'none',
                  }}
                >
                  Book Now
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  )
}

/* ─── HERO ────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section style={{ position: 'relative', minHeight: '100svh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', background: C.offBlack }}>

      {/* Dark cinematic overlay — place full-bleed automotive photo behind this */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: [
          'linear-gradient(to bottom, rgba(13,13,13,0.6) 0%, rgba(13,13,13,0) 25%, rgba(13,13,13,0.65) 65%, rgba(13,13,13,0.98) 100%)',
          'linear-gradient(to right, rgba(13,13,13,0.75) 0%, rgba(13,13,13,0.1) 60%)',
        ].join(', '),
      }} />

      {/* Texture placeholder — swap for glossy automotive photo */}
      <div style={{
        position: 'absolute', inset: 0, background: '#111111',
        backgroundImage: `
          radial-gradient(ellipse 85% 65% at 72% 42%, rgba(255,255,255,0.03) 0%, transparent 65%),
          repeating-linear-gradient(-50deg, transparent, transparent 55px, rgba(255,255,255,0.007) 55px, rgba(255,255,255,0.007) 56px)
        `,
      }} />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pb-24 pt-40 w-full" style={{ zIndex: 2 }}>
        <div style={{ maxWidth: 560 }}>

          <p style={{
            fontFamily: '"Poppins", sans-serif', fontWeight: 400,
            fontSize: '0.65rem', letterSpacing: '0.38em',
            textTransform: 'uppercase', color: C.silver,
            marginBottom: 28, animation: 'fadeUp 0.5s ease both 0.05s',
          }}>
            Mobile · Solano County · Sacramento
          </p>

          {/* Hero headline — brand tagline at display scale */}
          <h1 style={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: 'clamp(4.2rem, 13vw, 9.5rem)',
            lineHeight: 0.92,
            letterSpacing: '-0.02em',
            color: C.white,
            marginBottom: 28,
            animation: 'fadeUp 0.55s ease both 0.15s',
          }}>
            clean.<br />delivered.
          </h1>

          <p style={{
            fontFamily: '"Poppins", sans-serif', fontWeight: 300,
            fontSize: '0.95rem', lineHeight: 1.85,
            color: C.silver, maxWidth: 320,
            marginBottom: 40, animation: 'fadeUp 0.55s ease both 0.28s',
          }}>
            Book a mobile detail in 60 seconds. A vetted pro arrives at your door — no shop, no hassle.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, animation: 'fadeUp 0.55s ease both 0.38s' }}>
            <HoverBtn href={BOOKING_URL} variant="solid">
              Book My Detail <ArrowRight className="w-3.5 h-3.5" style={{ marginLeft: 10 }} />
            </HoverBtn>
            <HoverBtn href="#services" variant="ghost">
              See services
            </HoverBtn>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─── TRUST BAR ───────────────────────────────────────────────────────────── */

function TrustBar() {
  const stats = [
    { value: '60s',  label: 'Average booking time' },
    { value: '5+',   label: 'Service areas' },
    { value: '100%', label: 'Mobile — we come to you' },
  ]
  return (
    <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.charcoal }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: '36px 24px',
                textAlign: 'center',
                borderRight: i < stats.length - 1 ? `1px solid ${C.border}` : 'none',
              }}
            >
              <div style={{
                fontFamily: '"Poppins", sans-serif', fontWeight: 300,
                fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                color: C.white, lineHeight: 1, marginBottom: 6,
              }}>
                {s.value}
              </div>
              <div style={{
                fontFamily: '"Poppins", sans-serif', fontWeight: 400,
                fontSize: '0.62rem', letterSpacing: '0.22em',
                textTransform: 'uppercase', color: C.silver,
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── SERVICES ────────────────────────────────────────────────────────────── */

function Services() {
  const services = [
    {
      number: '01',
      name: 'Exterior Detail',
      tagline: 'Paint-perfect finish',
      description: 'Hand wash, clay bar, tire dressing, window polish. Every panel treated like it just left the showroom.',
      items: ['Hand wash & dry', 'Clay bar decontamination', 'Tire & trim dressing', 'Window polish'],
    },
    {
      number: '02',
      name: 'Interior Detail',
      tagline: 'Clean inside out',
      description: 'Deep vacuum, surface wipe-down, leather conditioning, odor elimination. Factory-fresh from top to bottom.',
      items: ['Deep vacuum', 'Leather conditioning', 'Dashboard & console wipe', 'Odor treatment'],
    },
    {
      number: '03',
      name: 'Full Detail',
      tagline: 'The complete service',
      description: 'Everything inside and out. Our most thorough package — the one you bring out for special occasions.',
      items: ['Complete exterior detail', 'Complete interior detail', 'Engine bay wipe-down', 'Sealant protection'],
      featured: true,
    },
  ]

  return (
    <section id="services" style={{ padding: '120px 0', background: C.offBlack }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <div style={{ marginBottom: 64 }}>
          <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 400, fontSize: '0.62rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: C.silver, marginBottom: 16 }}>
            What we offer
          </p>
          <h2 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: C.white, lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            Services
          </h2>
        </div>

        <div className="grid lg:grid-cols-3" style={{ border: `1px solid ${C.border}` }}>
          {services.map((s, i) => (
            <div
              key={s.number}
              style={{
                display: 'flex', flexDirection: 'column',
                padding: '40px 36px',
                background: s.featured ? C.charcoal : C.offBlack,
                borderRight: i < services.length - 1 ? `1px solid ${C.border}` : 'none',
                position: 'relative',
              }}
            >
              {s.featured && (
                <span style={{
                  position: 'absolute', top: 24, right: 24,
                  fontFamily: '"Poppins", sans-serif', fontWeight: 400,
                  fontSize: '0.58rem', letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: C.silver,
                  border: `1px solid ${C.border}`,
                  padding: '4px 12px',
                }}>
                  Most popular
                </span>
              )}

              <span style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: '3.5rem', color: 'rgba(166,166,166,0.1)', lineHeight: 1, marginBottom: 24, userSelect: 'none' }}>
                {s.number}
              </span>

              <h3 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 500, fontSize: '1.4rem', color: C.white, marginBottom: 4 }}>
                {s.name}
              </h3>
              <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 400, fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: C.silver, marginBottom: 20 }}>
                {s.tagline}
              </p>
              <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: '0.85rem', lineHeight: 1.85, color: C.silver, marginBottom: 28, flex: 1 }}>
                {s.description}
              </p>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {s.items.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Check style={{ width: 12, height: 12, color: C.silver, flexShrink: 0 }} strokeWidth={2} />
                    <span style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: '0.82rem', color: C.silver }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <HoverBtn href={BOOKING_URL} variant={s.featured ? 'solid' : 'ghost'} small>
                Book this service <ChevronRight className="w-3.5 h-3.5" style={{ marginLeft: 8 }} />
              </HoverBtn>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

/* ─── PROCESS ─────────────────────────────────────────────────────────────── */

function Process() {
  const steps = [
    {
      n: '01',
      title: 'Fill out the form',
      body: 'Answer a few quick questions about your vehicle, location, and the service you need. Under 60 seconds.',
    },
    {
      n: '02',
      title: 'We match you instantly',
      body: 'Our system routes your request to a vetted detailer in your area — no back-and-forth, no calls.',
    },
    {
      n: '03',
      title: 'They come to you',
      body: 'Your detailer arrives at your home, office, or wherever works. You wait for clean.',
    },
  ]

  return (
    <section id="about" style={{ padding: '120px 0', background: C.charcoal }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-start">

          <div className="lg:sticky lg:top-28">
            <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 400, fontSize: '0.62rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: C.silver, marginBottom: 16 }}>
              Simple process
            </p>
            <h2 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', color: C.white, lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: 24 }}>
              Three steps.<br />Zero hassle.
            </h2>
            <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: '0.875rem', lineHeight: 1.85, color: C.silver, maxWidth: 300 }}>
              We built the booking flow so you spend less time arranging and more time driving a clean car.
            </p>
          </div>

          <div>
            {steps.map((s, i) => (
              <div key={s.n}>
                <div style={{ display: 'flex', gap: 28, padding: '36px 0' }}>
                  <span style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: '2rem', color: 'rgba(166,166,166,0.18)', lineHeight: 1, minWidth: '2.5rem', paddingTop: 2, userSelect: 'none' }}>
                    {s.n}
                  </span>
                  <div>
                    <h3 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 500, fontSize: '0.95rem', color: C.white, marginBottom: 10 }}>
                      {s.title}
                    </h3>
                    <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: '0.85rem', lineHeight: 1.85, color: C.silver }}>
                      {s.body}
                    </p>
                  </div>
                </div>
                {i < steps.length - 1 && <div style={{ height: 1, background: C.border }} />}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─── CTA BANNER ──────────────────────────────────────────────────────────── */

function CtaBanner() {
  const areas = ['Dixon', 'Fairfield', 'Vacaville', 'Suisun City', 'Sacramento']

  return (
    <section id="gallery" style={{ padding: '120px 0', background: C.offBlack }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div style={{
          position: 'relative',
          border: `1px solid ${C.border}`,
          background: C.charcoal,
          padding: 'clamp(40px, 6vw, 72px)',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 50% 70% at 85% 50%, rgba(166,166,166,0.04) 0%, transparent 65%)',
          }} />

          <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                <MapPin style={{ width: 14, height: 14, color: C.silver }} />
                <span style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 400, fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: C.silver }}>
                  Serving your area
                </span>
              </div>

              <h2 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: 'clamp(2.2rem, 6vw, 4rem)', color: C.white, lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: 20 }}>
                Your driveway<br />is our shop.
              </h2>

              <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: '0.875rem', lineHeight: 1.85, color: C.silver, maxWidth: 320, marginBottom: 28 }}>
                Connecting customers with mobile detailers across Solano County and Greater Sacramento.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }} id="reviews">
                {areas.map(a => (
                  <span key={a} style={{
                    fontFamily: '"Poppins", sans-serif', fontWeight: 400,
                    fontSize: '0.65rem', letterSpacing: '0.08em',
                    padding: '6px 14px',
                    border: `1px solid ${C.border}`,
                    color: C.silver,
                  }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20 }} className="lg:items-end">
              <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: '0.8rem', lineHeight: 1.85, color: C.silver, maxWidth: 220 }} className="lg:text-right">
                Takes 60 seconds. No commitment, no calls — just a clean car at your door.
              </p>
              <HoverBtn href={BOOKING_URL} variant="solid">
                Start My Request <ArrowRight className="w-3.5 h-3.5" style={{ marginLeft: 10 }} />
              </HoverBtn>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── FOOTER ──────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, background: C.charcoal }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-5">

        <Wordmark scale={0.85} />

        <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(166,166,166,0.4)' }}>
          detaildoor.com · @detaildoor · © 2025
        </p>

        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms'].map(l => (
            <a key={l} href="#" style={{
              fontFamily: '"Poppins", sans-serif', fontWeight: 400,
              fontSize: '0.62rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(166,166,166,0.35)',
              textDecoration: 'none', transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = C.silver)}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(166,166,166,0.35)')}
            >
              {l}
            </a>
          ))}
        </div>

      </div>
    </footer>
  )
}

/* ─── SHARED BUTTON ───────────────────────────────────────────────────────── */

function HoverBtn({
  href, variant, children, small = false,
}: {
  href: string
  variant: 'solid' | 'ghost'
  children: React.ReactNode
  small?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center',
    fontFamily: '"Poppins", sans-serif',
    fontWeight: 500,
    fontSize: small ? '0.7rem' : '0.75rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    padding: small ? '10px 18px' : '14px 28px',
    transition: 'background 0.2s, color 0.2s, border-color 0.2s',
    cursor: 'pointer',
  }

  const solid: React.CSSProperties = {
    ...base,
    background: hovered ? 'rgba(240,240,240,1)' : C.white,
    color: C.offBlack,
    border: `1px solid ${C.white}`,
  }

  const ghost: React.CSSProperties = {
    ...base,
    background: 'transparent',
    color: hovered ? C.white : C.silver,
    border: `1px solid ${hovered ? 'rgba(166,166,166,0.45)' : C.border}`,
  }

  return (
    <a
      href={href}
      style={variant === 'solid' ? solid : ghost}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  )
}
