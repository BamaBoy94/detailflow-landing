import { ArrowRight, MapPin, Check } from 'lucide-react'

const BOOKING_URL = 'https://form.typeform.com/to/CnNOTLPV'

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Divider />
      <HowItWorks />
      <WhyUs />
      <LocalTrust />
      <FinalCta />
      <Footer />
    </>
  )
}

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-[18px]"
      style={{ background: 'linear-gradient(to bottom, rgba(12,12,12,0.97) 0%, rgba(12,12,12,0) 100%)' }}>
      <a href="#" className="font-display text-2xl tracking-[0.15em] text-gold no-underline">
        DETAILFLOW
      </a>
      <a
        href={BOOKING_URL}
        className="inline-block px-[22px] py-[9px] rounded-full border border-gold/[0.18] text-gold text-[0.8rem] font-medium tracking-[0.03em] no-underline transition-colors duration-200 hover:bg-gold hover:text-ink"
      >
        Book Now
      </a>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative min-h-svh flex flex-col items-center justify-center text-center px-6 pt-[120px] pb-[80px] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(200,168,75,0.09) 0%, transparent 65%), radial-gradient(ellipse 40% 30% at 80% 70%, rgba(200,168,75,0.04) 0%, transparent 60%)',
        }}
      />
      <div
        className="inline-block px-4 py-[5px] rounded-full border border-gold/[0.18] text-[0.72rem] tracking-[0.25em] uppercase text-gold font-normal mb-7"
        style={{ animation: 'fadeUp 0.6s ease both 0.1s' }}
      >
        Mobile · Solano County · Sacramento
      </div>
      <h1
        className="font-display leading-[0.95] tracking-[0.02em] text-cream mb-6"
        style={{ fontSize: 'clamp(3.2rem, 12vw, 7.5rem)', animation: 'fadeUp 0.6s ease both 0.25s' }}
      >
        Mobile Car<br />Detailing<br /><span className="text-gold">At Your Home</span>
      </h1>
      <p
        className="text-mist max-w-[480px] leading-[1.65] mb-10 font-light"
        style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', animation: 'fadeUp 0.6s ease both 0.4s' }}
      >
        Book in 60 seconds. We match you with a trusted local detailer — no calls, no hassle.
      </p>
      <CtaButton href={BOOKING_URL} style={{ animation: 'fadeUp 0.6s ease both 0.55s' }}>
        Get My Car Detailed
      </CtaButton>
    </section>
  )
}

function Divider() {
  return (
    <div
      className="w-px h-[60px] mx-auto opacity-40"
      style={{ background: 'linear-gradient(to bottom, #c8a84b, transparent)' }}
    />
  )
}

function HowItWorks() {
  const steps = [
    { num: '01', title: 'Tell us what you need', body: 'Fill out a quick 60-second form — your vehicle, location, and services wanted.' },
    { num: '02', title: 'We match you with a local detailer', body: 'Our system routes your request to a vetted pro in your area instantly.' },
    { num: '03', title: 'They come to you and get it done', body: 'Your detailer arrives at your home, office, or wherever is convenient.' },
  ]
  return (
    <section className="px-6 py-20">
      <div className="max-w-[680px] mx-auto">
        <SectionLabel>Simple process</SectionLabel>
        <SectionTitle>How It Works</SectionTitle>
        <div className="flex flex-col">
          {steps.map((s, i) => (
            <div
              key={s.num}
              className={`flex gap-6 py-7 items-start${i < steps.length - 1 ? ' border-b border-white/[0.06]' : ''}`}
            >
              <div className="font-display text-[3rem] text-gold/[0.25] leading-none min-w-[44px]">{s.num}</div>
              <div>
                <h3 className="text-[1.05rem] font-semibold text-cream mb-1">{s.title}</h3>
                <p className="text-[0.9rem] text-mist leading-[1.6]">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyUs() {
  const items = ['No waiting at shops', 'Vetted local detailers', 'Fast response times']
  return (
    <section className="px-6 py-20 bg-gold/[0.03]">
      <div className="max-w-[680px] mx-auto">
        <SectionLabel>Why us</SectionLabel>
        <SectionTitle>Why People Use Us</SectionTitle>
        <ul className="flex flex-col gap-5 list-none">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-4 text-base text-cream">
              <span className="w-7 h-7 rounded-full bg-gold/[0.12] border border-gold/[0.18] flex items-center justify-center flex-shrink-0">
                <Check className="w-[13px] h-[13px] text-gold" strokeWidth={1.5} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function LocalTrust() {
  const areas = ['Dixon', 'Fairfield', 'Vacaville', 'Suisun City', 'Sacramento']
  return (
    <section className="px-6 py-20">
      <div className="max-w-[680px] mx-auto">
        <div className="bg-ink2 border border-gold/[0.18] rounded-[20px] px-8 py-9 text-center">
          <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/[0.18] flex items-center justify-center mx-auto mb-5">
            <MapPin className="w-5 h-5 text-gold" />
          </div>
          <h3 className="text-[1.1rem] font-semibold text-cream mb-2.5">Serving Your Area</h3>
          <p className="text-[0.9rem] text-mist leading-[1.65] max-w-[340px] mx-auto">
            Connecting customers with mobile detailers in Dixon and surrounding areas.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-5">
            {areas.map((area) => (
              <span
                key={area}
                className="px-3.5 py-[5px] border border-gold/[0.18] rounded-full text-[0.75rem] text-gold tracking-[0.05em]"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="relative text-center px-6 py-[100px] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(200,168,75,0.06) 0%, transparent 70%)' }}
      />
      <h2
        className="font-display text-cream leading-[1.05] mb-4 tracking-[0.03em]"
        style={{ fontSize: 'clamp(2rem, 8vw, 4.5rem)' }}
      >
        Ready to get your car<br />cleaned <span className="text-gold">without leaving home?</span>
      </h2>
      <p className="text-base text-mist mb-9 max-w-[380px] mx-auto leading-[1.6] font-light">
        Takes 60 seconds. No commitment, no calls — just a clean car.
      </p>
      <CtaButton href={BOOKING_URL}>Start My Request</CtaButton>
    </section>
  )
}

function Footer() {
  return (
    <footer className="px-6 py-7 border-t border-white/[0.06] flex flex-col items-center gap-2 text-center">
      <span className="font-display text-[1.2rem] tracking-[0.15em] text-gold">DETAILFLOW</span>
      <p className="text-[0.72rem] text-mist tracking-[0.05em]">Serving Solano County + Sacramento · © 2025</p>
    </footer>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[0.7rem] tracking-[0.3em] uppercase text-gold mb-3 font-normal">{children}</div>
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-display tracking-[0.04em] text-cream mb-12 leading-none"
      style={{ fontSize: 'clamp(2.2rem, 7vw, 3.8rem)' }}
    >
      {children}
    </h2>
  )
}

function CtaButton({
  href,
  children,
  style,
}: {
  href: string
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <a
      href={href}
      style={style}
      className="inline-flex items-center gap-2.5 px-9 py-4 bg-gold text-ink rounded-full font-semibold text-base no-underline transition-all duration-200 hover:bg-gold-lt hover:-translate-y-0.5 group"
    >
      {children}
      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.5} />
    </a>
  )
}
