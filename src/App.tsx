import { useState, useEffect } from 'react'
import { Menu, ArrowRight, MapPin, Check, ChevronRight } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Logo } from '@/components/Logo'

const BOOKING_URL = 'https://form.typeform.com/to/CnNOTLPV'

const C = {
  offBlack:  '#0D0D0D',
  charcoal:  '#1A1A1A',
  silver:    '#A6A6A6',
  white:     '#FFFFFF',
  border:    'rgba(166,166,166,0.15)',
  borderHi:  'rgba(166,166,166,0.25)',
}

const label: React.CSSProperties = {
  fontFamily: '"Poppins", sans-serif',
  fontWeight: 400,
  fontSize: '0.6rem',
  letterSpacing: '0.38em',
  textTransform: 'uppercase',
  color: C.silver,
}

export default function App() {
  return (
    <div style={{ background: C.offBlack, color: C.white, minHeight: '100svh' }}>
      <Nav />
      <Hero />
      <TrustBar />
      <BrandStatement />
      <Services />
      <Process />
      <Testimonials />
      <CtaBanner />
      <Footer />
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

  const links = ['Services', 'About', 'Reviews', 'Coverage']

  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 50,
    background: scrolled ? 'rgba(13,13,13,0.96)' : 'transparent',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
    transition: 'background 0.35s, border-color 0.35s, backdrop-filter 0.35s',
  }

  return (
    <header style={headerStyle}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between" style={{ height: 72 }}>

        <a href="#" style={{ textDecoration: 'none' }}>
          <Logo scale={1} />
        </a>

        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {links.map(l => (
            <a
              key={l}
              href={`#${l === 'Coverage' ? 'coverage' : l.toLowerCase()}`}
              style={{
                ...label,
                letterSpacing: '0.16em',
                fontSize: '0.68rem',
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

        <div className="flex items-center gap-3">
          <a
            href={BOOKING_URL}
            className="hidden md:inline-flex items-center justify-center"
            style={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 500,
              fontSize: '0.68rem',
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
                <Logo scale={0.9} />
                <nav className="flex flex-col gap-0 flex-1 mt-10">
                  {links.map((l, i) => (
                    <div key={l}>
                      <a
                        href={`#${l === 'Coverage' ? 'coverage' : l.toLowerCase()}`}
                        style={{
                          display: 'block',
                          padding: '16px 0',
                          fontFamily: '"Poppins", sans-serif',
                          fontWeight: 400,
                          fontSize: '0.75rem',
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
                    padding: '13px',
                    border: `1px solid ${C.white}`,
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 500,
                    fontSize: '0.7rem',
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
    <section style={{
      position: 'relative',
      minHeight: '100svh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      background: '#0A0A0A',
    }}>

      {/*
        ── Photo slot ─────────────────────────────────────────────────────────
        Swap this div for a full-bleed automotive close-up:
        deep paint reflection, wheel arch, or interior leather.
        Suggested: 1920×1080, high contrast, minimal saturation.
      */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* Film-grain texture — editorial quality feel */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.055, pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
        {/* Subtle vignette for depth when no photo is present */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 90% 70% at 68% 38%, rgba(28,28,28,0.5) 0%, #0A0A0A 75%)',
        }} />
      </div>

      {/* Cinematic overlay — works with or without photo */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: [
          'linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, transparent 22%, rgba(10,10,10,0.55) 60%, rgba(10,10,10,0.98) 100%)',
          'linear-gradient(to right, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.1) 65%)',
        ].join(', '),
      }} />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pb-28 pt-44 w-full" style={{ zIndex: 3 }}>
        <div style={{ maxWidth: 580 }}>

          <p style={{
            ...label,
            letterSpacing: '0.42em',
            marginBottom: 32,
            animation: 'fadeUp 0.5s ease both 0.05s',
          }}>
            Professional Mobile Detailing · Nationwide
          </p>

          <h1 style={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: 'clamp(4.4rem, 13vw, 9.5rem)',
            lineHeight: 0.91,
            letterSpacing: '-0.025em',
            color: C.white,
            marginBottom: 36,
            animation: 'fadeUp 0.55s ease both 0.15s',
          }}>
            clean.<br />delivered.
          </h1>

          <p style={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 300,
            fontSize: '0.975rem',
            lineHeight: 1.95,
            color: C.silver,
            maxWidth: 360,
            marginBottom: 44,
            animation: 'fadeUp 0.55s ease both 0.28s',
          }}>
            Fully equipped. Independently vetted. At your door within the day.
            This is how car care should work.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, animation: 'fadeUp 0.55s ease both 0.38s' }}>
            <HoverBtn href={BOOKING_URL} variant="solid">
              Book My Detail <ArrowRight className="w-3.5 h-3.5" style={{ marginLeft: 10 }} />
            </HoverBtn>
            <HoverBtn href="#services" variant="ghost">
              View services
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
    { value: '60s',  label: 'Time to book' },
    { value: '100%', label: 'Mobile — no shop required' },
    { value: '50+',  label: 'Cities & growing' },
  ]
  return (
    <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.charcoal }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: '40px 28px',
                textAlign: 'center',
                borderRight: i < stats.length - 1 ? `1px solid ${C.border}` : 'none',
              }}
            >
              <div style={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 300,
                fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                color: C.white,
                lineHeight: 1,
                marginBottom: 8,
              }}>
                {s.value}
              </div>
              <div style={{ ...label, letterSpacing: '0.22em', fontSize: '0.6rem' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── BRAND STATEMENT ─────────────────────────────────────────────────────── */

function BrandStatement() {
  return (
    <section style={{ padding: '100px 0 96px', background: C.offBlack, borderBottom: `1px solid ${C.border}` }}>
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          <div className="lg:col-span-4">
            <span style={{ ...label, marginBottom: 20, display: 'block' }}>
              Why Detail Door
            </span>
            <div style={{ height: 1, width: 36, background: C.border }} />
          </div>

          <div className="lg:col-span-8">
            <p style={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(1rem, 1.9vw, 1.22rem)',
              lineHeight: 2,
              color: C.silver,
              marginBottom: 32,
            }}>
              We built Detail Door because quality car care shouldn't require a trip
              across town and an afternoon in a waiting room. Every detailer on our
              platform is vetted, background-checked, and fully equipped. Every service
              is priced clearly upfront.
            </p>
            <p style={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(1rem, 1.9vw, 1.22rem)',
              lineHeight: 2,
              color: 'rgba(166,166,166,0.55)',
            }}>
              No surprises at the end. No upselling in the middle.
              Just a clean car at your door.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─── SERVICES ────────────────────────────────────────────────────────────── */

function Services() {
  const services = [
    {
      tag: '01',
      name: 'Exterior',
      tagline: 'Paint-perfect finish',
      description: 'Every panel hand-washed and clay-decontaminated. Windows polished. Tires and trim dressed. We treat your paint the way it deserves to be treated.',
      items: ['Hand wash & hand dry', 'Clay bar decontamination', 'Window & glass polish', 'Tire & trim dressing'],
    },
    {
      tag: '02',
      name: 'Interior',
      tagline: 'Factory-clean, every time',
      description: 'Thorough vacuum, every surface wiped, leather conditioned, odors addressed at the source. You get in and it feels like day one.',
      items: ['Full deep vacuum', 'Dashboard & console detail', 'Leather conditioning', 'Odor treatment'],
    },
    {
      tag: '03',
      name: 'Full Detail',
      tagline: 'The complete treatment',
      description: 'Inside, outside, and everything between. For the car you take care of, or the one that needs it most. The standard for how your car should look.',
      items: ['Complete exterior detail', 'Complete interior detail', 'Engine bay wipe-down', 'Paint sealant protection'],
      featured: true,
    },
  ]

  return (
    <section id="services" style={{ padding: '128px 0 112px', background: C.offBlack }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
          marginBottom: 64,
        }}>
          <div>
            <p style={{ ...label, marginBottom: 14 }}>What we offer</p>
            <h2 style={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(2.8rem, 7vw, 5rem)',
              color: C.white,
              lineHeight: 0.93,
              letterSpacing: '-0.025em',
            }}>
              Services
            </h2>
          </div>
          <p style={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 300,
            fontSize: '0.82rem',
            lineHeight: 1.8,
            color: 'rgba(166,166,166,0.6)',
            maxWidth: 240,
          }}>
            All services include equipment, products, and cleanup. Nothing extra.
          </p>
        </div>

        <div className="grid lg:grid-cols-3">
          {services.map((s, i) => (
            <div
              key={s.tag}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '44px 40px 40px',
                background: s.featured ? C.charcoal : 'transparent',
                borderTop: `1px solid ${s.featured ? C.borderHi : C.border}`,
                borderLeft: i > 0 ? `1px solid ${C.border}` : 'none',
                position: 'relative',
              }}
            >
              {s.featured && (
                <span style={{
                  position: 'absolute', top: 24, right: 24,
                  ...label,
                  fontSize: '0.55rem',
                  letterSpacing: '0.2em',
                  border: `1px solid ${C.border}`,
                  padding: '4px 10px',
                }}>
                  Most popular
                </span>
              )}

              <span style={{
                ...label,
                fontSize: '0.58rem',
                letterSpacing: '0.3em',
                color: 'rgba(166,166,166,0.28)',
                marginBottom: 28,
              }}>
                {s.tag}
              </span>

              <h3 style={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 500,
                fontSize: '1.45rem',
                color: C.white,
                marginBottom: 6,
              }}>
                {s.name}
              </h3>
              <p style={{ ...label, letterSpacing: '0.2em', marginBottom: 24 }}>
                {s.tagline}
              </p>
              <p style={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 300,
                fontSize: '0.85rem',
                lineHeight: 1.9,
                color: C.silver,
                marginBottom: 32,
                flex: 1,
              }}>
                {s.description}
              </p>

              <div style={{ height: 1, background: C.border, marginBottom: 24 }} />

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 32 }}>
                {s.items.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <Check style={{ width: 11, height: 11, color: 'rgba(166,166,166,0.45)', flexShrink: 0 }} strokeWidth={2.5} />
                    <span style={{
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 300,
                      fontSize: '0.82rem',
                      color: C.silver,
                    }}>
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
      title: 'Tell us about your car',
      body: 'Two minutes. Your vehicle, location, and the service you need. No account required — just the essentials.',
    },
    {
      n: '02',
      title: 'We find your detailer',
      body: 'Your request goes to a vetted professional in your area. No bidding, no callbacks, no negotiating. A confirmation arrives instead.',
    },
    {
      n: '03',
      title: 'They arrive. You don\'t move.',
      body: 'Your detailer shows up fully equipped — at home, at work, wherever works. You stay where you are. The car gets taken care of.',
    },
  ]

  return (
    <section id="about" style={{ padding: '128px 0 120px', background: C.charcoal }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">

          <div className="lg:sticky lg:top-28">
            <p style={{ ...label, marginBottom: 18 }}>How it works</p>
            <h2 style={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(2.8rem, 7vw, 4.8rem)',
              color: C.white,
              lineHeight: 0.93,
              letterSpacing: '-0.025em',
              marginBottom: 28,
            }}>
              Three steps.<br />Zero friction.
            </h2>
            <p style={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 300,
              fontSize: '0.875rem',
              lineHeight: 1.95,
              color: C.silver,
              maxWidth: 300,
              marginBottom: 40,
            }}>
              We designed the booking flow to get out of your way. Two minutes
              from start to confirmation — then just wait for clean.
            </p>
            <p style={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 400,
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              color: 'rgba(166,166,166,0.45)',
              textTransform: 'uppercase',
            }}>
              No hidden fees. No upselling.
            </p>
          </div>

          <div>
            {steps.map((s, i) => (
              <div key={s.n}>
                <div style={{ display: 'flex', gap: 28, padding: '40px 0' }}>
                  <span style={{
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 300,
                    fontSize: '1.9rem',
                    color: 'rgba(166,166,166,0.16)',
                    lineHeight: 1,
                    minWidth: '2.4rem',
                    paddingTop: 3,
                    userSelect: 'none',
                  }}>
                    {s.n}
                  </span>
                  <div>
                    <h3 style={{
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 500,
                      fontSize: '0.98rem',
                      color: C.white,
                      marginBottom: 12,
                    }}>
                      {s.title}
                    </h3>
                    <p style={{
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 300,
                      fontSize: '0.85rem',
                      lineHeight: 1.9,
                      color: C.silver,
                    }}>
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

/* ─── TESTIMONIALS ────────────────────────────────────────────────────────── */

function Testimonials() {
  const reviews = [
    {
      text: 'Booked it Tuesday morning. By noon my car looked like I\'d just picked it up from the dealership. I haven\'t been to a detail shop since.',
      name: 'Marcus L.',
      location: 'Atlanta, GA',
    },
    {
      text: 'I\'ve had mobile details before. Detail Door is the only one that felt like a real service company — showed up on time, fully equipped, no surprises on the invoice.',
      name: 'Stephanie K.',
      location: 'Charlotte, NC',
    },
    {
      text: 'Sixty seconds to book, two hours to complete. My car hasn\'t looked this good since I drove it off the lot. Simple.',
      name: 'Daniel P.',
      location: 'Brooklyn, NY',
    },
  ]

  return (
    <section id="reviews" style={{ padding: '128px 0 112px', background: C.offBlack }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <div style={{ marginBottom: 64 }}>
          <p style={{ ...label, marginBottom: 14 }}>From our customers</p>
          <h2 style={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: 'clamp(2.8rem, 7vw, 5rem)',
            color: C.white,
            lineHeight: 0.93,
            letterSpacing: '-0.025em',
          }}>
            Reviews
          </h2>
        </div>

        <div className="grid lg:grid-cols-3" style={{ borderTop: `1px solid ${C.border}` }}>
          {reviews.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '44px 36px 40px',
                borderLeft: i > 0 ? `1px solid ${C.border}` : 'none',
              }}
            >
              <span style={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 300,
                fontSize: '3rem',
                color: 'rgba(166,166,166,0.13)',
                lineHeight: 1,
                marginBottom: 20,
                userSelect: 'none',
              }}>
                "
              </span>
              <p style={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 300,
                fontSize: '0.9rem',
                lineHeight: 1.95,
                color: C.silver,
                marginBottom: 32,
                flex: 1,
              }}>
                {r.text}
              </p>
              <div style={{ height: 1, background: C.border, marginBottom: 20 }} />
              <p style={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 500,
                fontSize: '0.68rem',
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: C.white,
                marginBottom: 4,
              }}>
                {r.name}
              </p>
              <p style={{
                ...label,
                fontSize: '0.58rem',
                color: 'rgba(166,166,166,0.45)',
              }}>
                {r.location}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

/* ─── CTA BANNER ──────────────────────────────────────────────────────────── */

function CtaBanner() {
  const metros = ['New York', 'Atlanta', 'Charlotte', 'Miami', 'Washington D.C.', 'Nashville']

  return (
    <section id="coverage" style={{ padding: '0 0 128px', background: C.offBlack }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div style={{
          position: 'relative',
          border: `1px solid ${C.border}`,
          background: C.charcoal,
          padding: 'clamp(44px, 6vw, 80px)',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 55% 80% at 88% 50%, rgba(166,166,166,0.03) 0%, transparent 65%)',
          }} />

          <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                <MapPin style={{ width: 13, height: 13, color: 'rgba(166,166,166,0.5)' }} />
                <span style={{ ...label, letterSpacing: '0.28em', fontSize: '0.6rem' }}>
                  Available nationwide
                </span>
              </div>

              <h2 style={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
                color: C.white,
                lineHeight: 0.93,
                letterSpacing: '-0.025em',
                marginBottom: 24,
              }}>
                Your driveway<br />is our shop.
              </h2>

              <p style={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 300,
                fontSize: '0.875rem',
                lineHeight: 1.9,
                color: C.silver,
                maxWidth: 340,
                marginBottom: 28,
              }}>
                We connect you with vetted mobile detailers wherever you are.
                Priced clearly. Arrive fully equipped.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {metros.map(a => (
                  <span key={a} style={{
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 400,
                    fontSize: '0.63rem',
                    letterSpacing: '0.08em',
                    padding: '6px 14px',
                    border: `1px solid ${C.border}`,
                    color: 'rgba(166,166,166,0.65)',
                  }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}
              className="lg:items-end"
            >
              <p style={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 300,
                fontSize: '0.82rem',
                lineHeight: 1.9,
                color: 'rgba(166,166,166,0.6)',
                maxWidth: 220,
              }}
                className="lg:text-right"
              >
                Two minutes to book. Done within the day. No commitment, no calls.
              </p>
              <HoverBtn href={BOOKING_URL} variant="solid">
                Book My Detail <ArrowRight className="w-3.5 h-3.5" style={{ marginLeft: 10 }} />
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
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12 grid md:grid-cols-3 items-center gap-6">

        <Logo scale={0.85} />

        <p style={{
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 300,
          fontSize: '0.6rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(166,166,166,0.35)',
          textAlign: 'center',
        }}>
          © 2025 Detail Door · detaildoor.com
        </p>

        <div style={{ display: 'flex', gap: 24, justifyContent: 'flex-end' }}>
          {[
            { text: 'Instagram', href: 'https://instagram.com/detaildoor' },
            { text: 'Privacy', href: '#' },
            { text: 'Terms', href: '#' },
          ].map(l => (
            <a
              key={l.text}
              href={l.href}
              style={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 400,
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(166,166,166,0.32)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = C.silver)}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(166,166,166,0.32)')}
            >
              {l.text}
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
