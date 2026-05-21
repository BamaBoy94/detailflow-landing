import { useState, useEffect } from 'react'
import { Menu, ArrowRight, MapPin, Check, ChevronRight, Quote } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

const BOOKING_URL = 'https://form.typeform.com/to/CnNOTLPV'

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Nav />
      <Hero />
      <TrustBar />
      <Services />
      <Process />
      <Gallery />
      <Reviews />
      <CtaBanner />
      <Footer />
    </div>
  )
}

/* ─── WORDMARK ────────────────────────────────────────────────────────────── */

function Wordmark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const nameSize = { sm: 'text-[1.05rem]', md: 'text-[1.25rem]', lg: 'text-[1.6rem]' }[size]
  const tagSize  = { sm: 'text-[0.48rem]', md: 'text-[0.55rem]', lg: 'text-[0.65rem]' }[size]

  return (
    <div className="flex flex-col leading-none gap-[3px]">
      <span
        className={`font-brand font-[300] text-white tracking-[0.04em] ${nameSize}`}
        style={{ fontFamily: '"Outfit", sans-serif' }}
      >
        detail door
      </span>
      <span
        className={`font-sans font-[300] text-white/40 tracking-[0.28em] uppercase ${tagSize}`}
      >
        clean. delivered.
      </span>
    </div>
  )
}

/* ─── NAV ─────────────────────────────────────────────────────────────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Services',     href: '#services' },
    { label: 'About',        href: '#process' },
    { label: 'Gallery',      href: '#gallery' },
    { label: 'Reviews',      href: '#reviews' },
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/96 border-b border-white/[0.07]' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between h-[80px]">

        {/* Logo lockup: icon mark + stacked wordmark */}
        <a href="#" className="no-underline flex items-center gap-3.5 group">
          <img
            src="/favicon.svg"
            alt="Detail Door"
            className="h-[28px] w-auto shrink-0 transition-opacity duration-200 group-hover:opacity-80"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          {/* Hairline divider */}
          <span className="hidden sm:block w-px h-7 bg-white/[0.12]" />
          <Wordmark size="md" />
        </a>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              className="font-sans text-[0.72rem] font-[400] tracking-[0.14em] uppercase text-white/45 hover:text-white transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* BOOK NOW — rectangular border button matching brand kit */}
        <div className="flex items-center gap-3">
          <a
            href={BOOKING_URL}
            className="hidden md:inline-flex items-center justify-center px-5 py-2 border border-white/60 text-white text-[0.72rem] font-[500] tracking-[0.14em] uppercase hover:bg-white hover:text-black transition-all duration-200"
          >
            Book Now
          </a>

          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 text-white/50 hover:text-white transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-white/[0.07] w-72">
              <div className="flex flex-col h-full pt-8 pb-10 px-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/favicon.svg"
                    alt="Detail Door"
                    className="h-[22px] w-auto shrink-0"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  <span className="w-px h-5 bg-white/[0.12]" />
                  <Wordmark size="sm" />
                </div>
                <nav className="flex flex-col gap-0 flex-1 mt-10">
                  {links.map((l, i) => (
                    <div key={l.label}>
                      <a
                        href={l.href}
                        className="block py-4 text-[0.82rem] tracking-[0.1em] uppercase text-white/50 hover:text-white transition-colors"
                      >
                        {l.label}
                      </a>
                      {i < links.length - 1 && <Separator className="bg-white/[0.06]" />}
                    </div>
                  ))}
                </nav>
                <a
                  href={BOOKING_URL}
                  className="mt-auto flex items-center justify-center py-3 border border-white/50 text-white text-[0.75rem] tracking-[0.14em] uppercase hover:bg-white hover:text-black transition-all"
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
    <section className="relative min-h-svh flex flex-col justify-end overflow-hidden bg-black">

      {/* Automotive image layer — swap src for production photography */}
      <div className="absolute inset-0">
        {/* Gradient overlays to match brand's dark cinematic look */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: [
              'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.0) 25%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.98) 100%)',
              'linear-gradient(to right, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 100%)',
            ].join(', '),
          }}
        />
        {/* Placeholder dark texture — replace with glossy car photo */}
        <div
          className="absolute inset-0 bg-[#0c0c0c]"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 90% 70% at 75% 45%, rgba(255,255,255,0.035) 0%, transparent 65%),
              repeating-linear-gradient(-52deg, transparent, transparent 60px, rgba(255,255,255,0.008) 60px, rgba(255,255,255,0.008) 61px)
            `,
          }}
        />
      </div>

      {/* Hero content */}
      <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-10 pb-24 pt-36 w-full">
        <div className="max-w-xl">

          <p
            className="font-sans text-[0.65rem] font-[400] tracking-[0.35em] uppercase text-white/35 mb-8"
            style={{ animation: 'fadeUp 0.5s ease both 0.05s' }}
          >
            Mobile · Solano County · Sacramento
          </p>

          {/* Primary display — brand tagline as hero headline */}
          <h1
            className="font-brand font-[200] text-white leading-[0.95] mb-8"
            style={{
              fontSize: 'clamp(5rem, 16vw, 10.5rem)',
              letterSpacing: '-0.01em',
              animation: 'fadeUp 0.55s ease both 0.15s',
              fontFamily: '"Outfit", sans-serif',
            }}
          >
            clean.<br />delivered.
          </h1>

          <p
            className="font-sans font-[300] text-[0.95rem] text-white/45 max-w-xs leading-[1.8] mb-10"
            style={{ animation: 'fadeUp 0.55s ease both 0.28s' }}
          >
            Book a mobile detail in 60 seconds. A vetted pro arrives at your door — no shop, no hassle.
          </p>

          <div
            className="flex flex-wrap gap-3 items-center"
            style={{ animation: 'fadeUp 0.55s ease both 0.38s' }}
          >
            {/* Primary — solid white, matches brand CTA */}
            <a
              href={BOOKING_URL}
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-white text-black font-sans font-[500] text-[0.8rem] tracking-[0.1em] uppercase hover:bg-off-white transition-colors group"
            >
              Book My Detail
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>

            {/* Secondary — ghost rectangular border */}
            <a
              href="#process"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/[0.18] text-white/55 font-sans text-[0.8rem] tracking-[0.1em] uppercase hover:border-white/35 hover:text-white transition-all"
            >
              How it works
            </a>
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
    <div className="border-y border-white/[0.07] bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.07]">
          {stats.map(s => (
            <div key={s.label} className="py-8 px-6 lg:px-10 text-center">
              <div
                className="font-brand font-[200] text-white leading-none mb-1.5"
                style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontFamily: '"Outfit", sans-serif' }}
              >
                {s.value}
              </div>
              <div className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-white/30">
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
    <section id="services" className="py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <div className="mb-16 lg:mb-20">
          <p className="font-sans text-[0.65rem] tracking-[0.3em] uppercase text-white/30 mb-4">
            What we offer
          </p>
          <h2
            className="font-brand font-[300] text-white leading-none"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', fontFamily: '"Outfit", sans-serif' }}
          >
            Services
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 border border-white/[0.08]">
          {services.map((s, i) => (
            <div
              key={s.number}
              className={`relative flex flex-col p-8 lg:p-10 border-b lg:border-b-0 border-white/[0.08] ${
                i < services.length - 1 ? 'lg:border-r' : ''
              } ${s.featured ? 'bg-[#0d0d0d]' : 'bg-black'}`}
            >
              {s.featured && (
                <span className="absolute top-6 right-6 font-sans text-[0.6rem] tracking-[0.18em] uppercase px-3 py-1 border border-white/[0.14] text-white/40">
                  Most popular
                </span>
              )}

              <span
                className="font-brand font-[200] text-white/[0.06] leading-none mb-6 select-none"
                style={{ fontSize: '4rem', fontFamily: '"Outfit", sans-serif' }}
              >
                {s.number}
              </span>

              <h3
                className="font-brand font-[300] text-white mb-1"
                style={{ fontSize: '1.65rem', fontFamily: '"Outfit", sans-serif' }}
              >
                {s.name}
              </h3>
              <p className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-white/30 mb-6">
                {s.tagline}
              </p>
              <p className="font-sans font-[300] text-[0.875rem] text-white/45 leading-[1.8] mb-8 flex-1">
                {s.description}
              </p>

              <ul className="flex flex-col gap-3 mb-8">
                {s.items.map(item => (
                  <li key={item} className="flex items-center gap-3 font-sans text-[0.82rem] text-white/50">
                    <Check className="w-3 h-3 text-white/25 shrink-0" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href={BOOKING_URL}
                className={`inline-flex items-center justify-between gap-2 px-5 py-3 font-sans text-[0.75rem] tracking-[0.1em] uppercase transition-all ${
                  s.featured
                    ? 'bg-white text-black hover:bg-off-white'
                    : 'border border-white/[0.12] text-white/50 hover:border-white/25 hover:text-white'
                }`}
              >
                Book this service
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
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
    <section id="process" className="py-28 lg:py-40 bg-[#080808]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-start">

          {/* Left — sticky heading */}
          <div className="lg:sticky lg:top-28">
            <p className="font-sans text-[0.65rem] tracking-[0.3em] uppercase text-white/30 mb-4">
              Simple process
            </p>
            <h2
              className="font-brand font-[300] text-white leading-[0.95] mb-6"
              style={{ fontSize: 'clamp(2.8rem, 8vw, 5rem)', fontFamily: '"Outfit", sans-serif' }}
            >
              Three steps.<br />Zero hassle.
            </h2>
            <p className="font-sans font-[300] text-[0.875rem] text-white/40 max-w-xs leading-[1.85]">
              We built the booking flow so you spend less time arranging and more time driving a clean car.
            </p>
          </div>

          {/* Right — numbered steps */}
          <div className="flex flex-col">
            {steps.map((s, i) => (
              <div key={s.n}>
                <div className="flex gap-7 py-9">
                  <span
                    className="font-brand font-[200] text-white/[0.09] leading-none min-w-[2.5rem] pt-0.5 select-none"
                    style={{ fontSize: '2.2rem', fontFamily: '"Outfit", sans-serif' }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-sans font-[500] text-[0.95rem] text-white mb-2.5">{s.title}</h3>
                    <p className="font-sans font-[300] text-[0.85rem] text-white/40 leading-[1.85]">{s.body}</p>
                  </div>
                </div>
                {i < steps.length - 1 && <Separator className="bg-white/[0.06]" />}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─── GALLERY ─────────────────────────────────────────────────────────────── */

const GALLERY_ITEMS = [
  { label: 'Exterior Detail',   loc: 'Dixon',         grad: 'from-[#1c1c1c] via-[#2a2a2a] to-[#111]',   span: 'lg:col-span-2 lg:row-span-2' },
  { label: 'Interior Detail',   loc: 'Fairfield',     grad: 'from-[#181818] via-[#202020] to-[#0e0e0e]', span: '' },
  { label: 'Full Detail',       loc: 'Vacaville',     grad: 'from-[#141414] via-[#1e1e1e] to-[#0c0c0c]', span: '' },
  { label: 'Engine Bay',        loc: 'Sacramento',    grad: 'from-[#1a1a1a] via-[#252525] to-[#101010]', span: '' },
  { label: 'Ceramic Coating',   loc: 'Suisun City',   grad: 'from-[#111] via-[#1d1d1d] to-[#0a0a0a]',   span: '' },
  { label: 'Paint Correction',  loc: 'Fairfield',     grad: 'from-[#161616] via-[#222] to-[#0d0d0d]',   span: 'lg:col-span-2' },
]

function Gallery() {
  return (
    <section id="gallery" className="py-28 lg:py-40 bg-[#080808]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <div className="mb-16 lg:mb-20">
          <p className="font-sans text-[0.65rem] tracking-[0.3em] uppercase text-white/30 mb-4">
            Our work
          </p>
          <h2
            className="font-brand font-[300] text-white leading-none"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', fontFamily: '"Outfit", sans-serif' }}
          >
            The results
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04]">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.label + item.loc}
              className={`group relative bg-[#0a0a0a] overflow-hidden ${item.span}`}
            >
              {/* Simulated automotive surface */}
              <div
                className={`w-full h-full min-h-[160px] lg:min-h-[200px] bg-gradient-to-br ${item.grad} flex items-end transition-all duration-500 group-hover:brightness-125`}
                style={{
                  backgroundImage: `
                    radial-gradient(ellipse 60% 50% at 75% 30%, rgba(255,255,255,0.045) 0%, transparent 60%),
                    repeating-linear-gradient(-48deg, transparent, transparent 40px, rgba(255,255,255,0.005) 40px, rgba(255,255,255,0.005) 41px)
                  `,
                }}
              >
                {/* Bottom label bar */}
                <div className="w-full px-4 py-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="font-sans text-[0.7rem] font-[400] text-white/80 leading-tight">{item.label}</p>
                  <p className="font-sans text-[0.58rem] tracking-[0.15em] uppercase text-white/30 mt-0.5">{item.loc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-7 font-sans text-[0.65rem] tracking-[0.15em] uppercase text-white/20 text-center">
          New project photos added as work is documented
        </p>

      </div>
    </section>
  )
}

/* ─── REVIEWS ─────────────────────────────────────────────────────────────── */

const REVIEWS = [
  {
    quote: "Booked at 8am, detailer arrived by 10. Interior looks brand new — didn't think it could get that clean.",
    name: 'Danielle M.',
    location: 'Fairfield, CA',
    service: 'Interior Detail',
  },
  {
    quote: "Easiest car service I've ever scheduled. Full detail on my truck took under 3 hours and the results were insane.",
    name: 'Kevin S.',
    location: 'Sacramento, CA',
    service: 'Full Detail',
  },
  {
    quote: "I've tried other mobile detailers. Detail Door is the only one that showed up on time and actually finished what they promised.",
    name: 'Aisha B.',
    location: 'Vacaville, CA',
    service: 'Exterior Detail',
  },
  {
    quote: "Ceramic coating turned out perfect. Car was sitting in my driveway, done before noon. Will be back every season.",
    name: 'Tyler R.',
    location: 'Dixon, CA',
    service: 'Full Detail',
  },
]

function Reviews() {
  return (
    <section id="reviews" className="py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <div className="mb-16 lg:mb-20">
          <p className="font-sans text-[0.65rem] tracking-[0.3em] uppercase text-white/30 mb-4">
            Client reviews
          </p>
          <h2
            className="font-brand font-[300] text-white leading-none"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', fontFamily: '"Outfit", sans-serif' }}
          >
            What they say
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
          {REVIEWS.map((r) => (
            <div key={r.name} className="bg-black p-8 flex flex-col gap-6">
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-white/40 text-[0.6rem]">★</span>
                ))}
              </div>

              <Quote className="w-5 h-5 text-white/[0.08] -mb-3 -ml-0.5 shrink-0" />

              <p className="font-sans font-[300] text-[0.875rem] text-white/55 leading-[1.85] flex-1">
                "{r.quote}"
              </p>

              <div className="border-t border-white/[0.07] pt-5 flex flex-col gap-1">
                <span className="font-sans font-[500] text-[0.8rem] text-white">{r.name}</span>
                <span className="font-sans text-[0.65rem] tracking-[0.1em] text-white/30">{r.location}</span>
                <span className="font-sans text-[0.6rem] tracking-[0.16em] uppercase text-white/20 mt-1 border border-white/[0.07] px-2 py-0.5 self-start">
                  {r.service}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

/* ─── CTA BANNER ──────────────────────────────────────────────────────────── */

function CtaBanner() {
  const areas = ['Dixon', 'Fairfield', 'Vacaville', 'Suisun City', 'Sacramento']

  return (
    <section id="areas" className="py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="relative border border-white/[0.08] bg-[#0a0a0a] p-10 lg:p-16 overflow-hidden">

          {/* Subtle right-side glow — references glossy car imagery */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 50% 70% at 90% 50%, rgba(255,255,255,0.025) 0%, transparent 65%)',
            }}
          />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="flex items-center gap-2.5 mb-7">
                <MapPin className="w-3.5 h-3.5 text-white/25" />
                <span className="font-sans text-[0.65rem] tracking-[0.28em] uppercase text-white/30">
                  Serving your area
                </span>
              </div>

              <h2
                className="font-brand font-[300] text-white leading-[0.95] mb-5"
                style={{ fontSize: 'clamp(2.4rem, 7vw, 4.2rem)', fontFamily: '"Outfit", sans-serif' }}
              >
                Your driveway<br />is our shop.
              </h2>

              <p className="font-sans font-[300] text-[0.875rem] text-white/40 max-w-sm leading-[1.85] mb-7">
                Connecting customers with mobile detailers across Solano County and Greater Sacramento.
              </p>

              <div className="flex flex-wrap gap-2">
                {areas.map(a => (
                  <span
                    key={a}
                    className="font-sans text-[0.68rem] tracking-[0.08em] px-3.5 py-1.5 border border-white/[0.09] text-white/35"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-5">
              <p className="font-sans font-[300] text-[0.8rem] text-white/30 max-w-[220px] lg:text-right leading-[1.85]">
                Takes 60 seconds. No commitment, no calls — just a clean car at your door.
              </p>
              <a
                href={BOOKING_URL}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-sans font-[500] text-[0.78rem] tracking-[0.12em] uppercase hover:bg-off-white transition-colors group"
              >
                Start My Request
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
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
    <footer className="border-t border-white/[0.07] bg-[#080808]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <img
            src="/favicon.svg"
            alt="Detail Door"
            className="h-[18px] w-auto shrink-0 opacity-40"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <span className="w-px h-4 bg-white/[0.10]" />
          <Wordmark size="sm" />
        </div>
        <p className="font-sans text-[0.65rem] tracking-[0.1em] text-white/20 uppercase">
          Serving Solano County + Sacramento · © 2025
        </p>
        <div className="flex gap-6">
          {['Privacy', 'Terms'].map(l => (
            <a
              key={l}
              href="#"
              className="font-sans text-[0.65rem] tracking-[0.08em] uppercase text-white/20 hover:text-white/45 transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
