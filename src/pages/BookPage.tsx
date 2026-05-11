import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Upload, X, Check, ArrowLeft, ArrowRight } from 'lucide-react'
import { saveJob } from '../lib/storage'
import type { JobFormValues, ServiceKey, VehicleSize, Condition, Urgency } from '../lib/types'
import { Logo } from '../components/Logo'

const C = {
  bg:       '#0D0D0D',
  surface:  '#141414',
  border:   'rgba(166,166,166,0.14)',
  borderHi: 'rgba(166,166,166,0.28)',
  silver:   '#A6A6A6',
  white:    '#FFFFFF',
  charcoal: '#1A1A1A',
}

const txt: React.CSSProperties = {
  fontFamily: '"Poppins", sans-serif',
  color: C.white,
}

const label: React.CSSProperties = {
  fontFamily: '"Poppins", sans-serif',
  fontWeight: 400,
  fontSize: '0.6rem',
  letterSpacing: '0.38em',
  textTransform: 'uppercase' as const,
  color: C.silver,
}

const SERVICES: { key: ServiceKey; label: string; note?: string }[] = [
  { key: 'interior',        label: 'Interior Detail' },
  { key: 'exterior',        label: 'Exterior Detail' },
  { key: 'pet_hair',        label: 'Pet Hair Removal', note: 'SPECIALTY' },
  { key: 'odor_removal',    label: 'Odor Treatment' },
  { key: 'ceramic_coating', label: 'Ceramic Coating',  note: 'HIGH VALUE' },
]

const empty: JobFormValues = {
  name: '', phone: '', address: '',
  vehicleMake: '', vehicleModel: '', vehicleSize: '',
  interiorCondition: '', exteriorCondition: '',
  services: [], urgency: '', notes: '', photoNames: [],
}

type Step = 0 | 1 | 2 | 3

export default function BookPage() {
  const [step, setStep] = useState<Step>(0)
  const [form, setForm] = useState<JobFormValues>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormValues, string>>>({})
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof JobFormValues>(k: K, v: JobFormValues[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const toggleService = (key: ServiceKey) =>
    set('services', form.services.includes(key)
      ? form.services.filter(s => s !== key)
      : [...form.services, key])

  const validateStep = (): boolean => {
    const e: typeof errors = {}
    if (step === 0) {
      if (!form.name.trim())    e.name    = 'Required'
      if (!form.phone.trim())   e.phone   = 'Required'
      if (!form.address.trim()) e.address = 'Required'
    }
    if (step === 1) {
      if (!form.vehicleMake.trim())  e.vehicleMake  = 'Required'
      if (!form.vehicleModel.trim()) e.vehicleModel = 'Required'
      if (!form.vehicleSize)         e.vehicleSize  = 'Select one'
    }
    if (step === 2) {
      if (!form.interiorCondition) e.interiorCondition = 'Select one'
      if (!form.exteriorCondition) e.exteriorCondition = 'Select one'
      if (form.services.length === 0) e.services = 'Select at least one service'
      if (!form.urgency) e.urgency = 'Select one'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validateStep()) return
    setStep(s => (s + 1) as Step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const back = () => {
    setStep(s => (s - 1) as Step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const addPhotos = (files: FileList | null) => {
    if (!files) return
    const next = [...photoFiles, ...Array.from(files)].slice(0, 8)
    setPhotoFiles(next)
    set('photoNames', next.map(f => f.name))
  }

  const removePhoto = (i: number) => {
    const next = photoFiles.filter((_, idx) => idx !== i)
    setPhotoFiles(next)
    set('photoNames', next.map(f => f.name))
  }

  const handleSubmit = () => {
    saveJob(form)
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) return <SuccessScreen />

  const steps = ['Contact', 'Vehicle', 'Services', 'Photos & Notes']
  const pct = ((step) / 3) * 100

  return (
    <div style={{ background: C.bg, minHeight: '100svh', color: C.white }}>

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(13,13,13,0.94)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div className="mx-auto max-w-2xl px-6 flex items-center justify-between" style={{ height: 64 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft style={{ width: 14, height: 14, color: C.silver }} />
            <Logo scale={0.68} showTagline={false} />
          </Link>
          <span style={{ ...label, fontSize: '0.55rem', letterSpacing: '0.24em' }}>
            Step {step + 1} of 4
          </span>
        </div>
        {/* Progress bar */}
        <div style={{ height: 2, background: C.border }}>
          <div style={{ height: 2, width: `${pct + 25}%`, background: C.white, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 pb-24" style={{ paddingTop: 56 }}>

        {/* Step labels */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 48 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                margin: '0 auto 8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i <= step ? C.white : 'transparent',
                border: `1px solid ${i <= step ? C.white : C.border}`,
                transition: 'all 0.3s',
              }}>
                {i < step
                  ? <Check style={{ width: 12, height: 12, color: C.bg }} strokeWidth={3} />
                  : <span style={{ ...txt, fontSize: '0.65rem', fontWeight: 500, color: i === step ? C.bg : C.silver }}>{i + 1}</span>
                }
              </div>
              <span style={{ ...label, fontSize: '0.5rem', letterSpacing: '0.18em', color: i === step ? C.white : C.silver }}>
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* ── Step 0: Contact ── */}
        {step === 0 && (
          <Section title="Contact Info" sub="We'll use this to confirm your booking.">
            <Field label="Full Name" error={errors.name}>
              <Input value={form.name} onChange={v => set('name', v)} placeholder="Jane Smith" />
            </Field>
            <Field label="Phone Number" error={errors.phone}>
              <Input value={form.phone} onChange={v => set('phone', v)} placeholder="(555) 000-0000" type="tel" />
            </Field>
            <Field label="Service Address" error={errors.address}>
              <Input value={form.address} onChange={v => set('address', v)} placeholder="123 Main St, City, State" />
            </Field>
          </Section>
        )}

        {/* ── Step 1: Vehicle ── */}
        {step === 1 && (
          <Section title="Your Vehicle" sub="So we bring the right supplies.">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Make" error={errors.vehicleMake}>
                <Input value={form.vehicleMake} onChange={v => set('vehicleMake', v)} placeholder="Toyota" />
              </Field>
              <Field label="Model" error={errors.vehicleModel}>
                <Input value={form.vehicleModel} onChange={v => set('vehicleModel', v)} placeholder="Camry" />
              </Field>
            </div>
            <Field label="Vehicle Size" error={errors.vehicleSize}>
              <ToggleGroup<VehicleSize>
                options={[
                  { value: 'sedan', label: 'Sedan / Coupe' },
                  { value: 'suv',   label: 'SUV / Minivan' },
                  { value: 'truck', label: 'Truck / Van' },
                ]}
                value={form.vehicleSize}
                onChange={v => set('vehicleSize', v)}
              />
            </Field>
          </Section>
        )}

        {/* ── Step 2: Services ── */}
        {step === 2 && (
          <Section title="Service Details" sub="Tell us what the car needs.">
            <Field label="Interior Condition" error={errors.interiorCondition}>
              <ToggleGroup<Condition>
                options={[
                  { value: 'light',    label: 'Light' },
                  { value: 'moderate', label: 'Moderate' },
                  { value: 'heavy',    label: 'Heavy' },
                ]}
                value={form.interiorCondition}
                onChange={v => set('interiorCondition', v)}
              />
            </Field>
            <Field label="Exterior Condition" error={errors.exteriorCondition}>
              <ToggleGroup<Condition>
                options={[
                  { value: 'light',    label: 'Light' },
                  { value: 'moderate', label: 'Moderate' },
                  { value: 'heavy',    label: 'Heavy' },
                ]}
                value={form.exteriorCondition}
                onChange={v => set('exteriorCondition', v)}
              />
            </Field>
            <Field label="Services Needed" error={errors.services}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SERVICES.map(s => {
                  const checked = form.services.includes(s.key)
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => toggleService(s.key)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 18px',
                        background: checked ? C.charcoal : 'transparent',
                        border: `1px solid ${checked ? C.borderHi : C.border}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 18, height: 18, border: `1px solid ${checked ? C.white : C.border}`,
                          background: checked ? C.white : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, transition: 'all 0.2s',
                        }}>
                          {checked && <Check style={{ width: 10, height: 10, color: C.bg }} strokeWidth={3} />}
                        </div>
                        <span style={{ ...txt, fontWeight: 400, fontSize: '0.875rem' }}>{s.label}</span>
                      </div>
                      {s.note && (
                        <span style={{
                          ...label, fontSize: '0.5rem', letterSpacing: '0.16em',
                          padding: '3px 8px', border: `1px solid ${C.border}`,
                          color: s.note === 'HIGH VALUE' ? 'rgba(251,191,36,0.7)' : 'rgba(167,139,250,0.7)',
                          borderColor: s.note === 'HIGH VALUE' ? 'rgba(251,191,36,0.2)' : 'rgba(167,139,250,0.2)',
                        }}>
                          {s.note}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </Field>
            <Field label="Urgency" error={errors.urgency}>
              <ToggleGroup<Urgency>
                options={[
                  { value: 'asap',      label: 'ASAP' },
                  { value: 'this_week', label: 'This Week' },
                  { value: 'flexible',  label: 'Flexible' },
                ]}
                value={form.urgency}
                onChange={v => set('urgency', v)}
              />
            </Field>
          </Section>
        )}

        {/* ── Step 3: Photos & Notes ── */}
        {step === 3 && (
          <Section title="Photos & Notes" sub="Optional — helps us prepare.">
            <Field label="Upload Photos (up to 8)">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={e => addPhotos(e.target.files)}
              />
              {photoFiles.length < 8 && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  style={{
                    width: '100%', padding: '32px 0',
                    border: `1px dashed ${C.borderHi}`,
                    background: 'transparent', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(166,166,166,0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.borderHi)}
                >
                  <Upload style={{ width: 20, height: 20, color: C.silver }} />
                  <span style={{ ...label, letterSpacing: '0.18em' }}>
                    Tap to select photos
                  </span>
                </button>
              )}
              {photoFiles.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                  {photoFiles.map((f, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img
                        src={URL.createObjectURL(f)}
                        alt={f.name}
                        style={{ width: 80, height: 80, objectFit: 'cover', display: 'block' }}
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        style={{
                          position: 'absolute', top: 4, right: 4,
                          width: 20, height: 20, borderRadius: '50%',
                          background: 'rgba(0,0,0,0.8)', border: 'none',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <X style={{ width: 10, height: 10, color: C.white }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p style={{ ...label, fontSize: '0.55rem', marginTop: 10, lineHeight: 1.8 }}>
                Photos are previewed here. We'll follow up to collect them via text.
              </p>
            </Field>

            <Field label="Additional Notes">
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Anything else we should know about the vehicle or service..."
                rows={4}
                style={{
                  width: '100%', background: C.surface,
                  border: `1px solid ${C.border}`, padding: '14px 16px',
                  ...txt, fontWeight: 300, fontSize: '0.875rem', lineHeight: 1.7,
                  resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                  color: C.white,
                }}
                onFocus={e => (e.target.style.borderColor = C.borderHi)}
                onBlur={e => (e.target.style.borderColor = C.border)}
              />
            </Field>

            {/* Summary */}
            <div style={{ border: `1px solid ${C.border}`, padding: '28px 24px', background: C.charcoal, marginTop: 8 }}>
              <p style={{ ...label, letterSpacing: '0.28em', marginBottom: 18 }}>Booking Summary</p>
              <SummaryRow k="Name"     v={form.name} />
              <SummaryRow k="Phone"    v={form.phone} />
              <SummaryRow k="Address"  v={form.address} />
              <SummaryRow k="Vehicle"  v={`${form.vehicleMake} ${form.vehicleModel} (${form.vehicleSize})`} />
              <SummaryRow k="Services" v={form.services.map(s => SERVICES.find(x => x.key === s)?.label).join(', ')} />
              <SummaryRow k="Urgency"  v={form.urgency === 'asap' ? 'ASAP' : form.urgency === 'this_week' ? 'This Week' : 'Flexible'} />
              {form.photoNames.length > 0 && (
                <SummaryRow k="Photos" v={`${form.photoNames.length} attached`} />
              )}
            </div>
          </Section>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 }}>
          {step > 0 ? (
            <button type="button" onClick={back} style={{
              ...txt, fontWeight: 500, fontSize: '0.7rem', letterSpacing: '0.12em',
              textTransform: 'uppercase', background: 'transparent', border: `1px solid ${C.border}`,
              padding: '12px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              color: C.silver, transition: 'color 0.2s, border-color 0.2s',
            }}>
              <ArrowLeft style={{ width: 13, height: 13 }} /> Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button type="button" onClick={next} style={{
              ...txt, fontWeight: 500, fontSize: '0.7rem', letterSpacing: '0.12em',
              textTransform: 'uppercase', background: C.white, border: `1px solid ${C.white}`,
              padding: '12px 28px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              color: C.bg, transition: 'opacity 0.2s',
            }}>
              Continue <ArrowRight style={{ width: 13, height: 13 }} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} style={{
              ...txt, fontWeight: 500, fontSize: '0.7rem', letterSpacing: '0.12em',
              textTransform: 'uppercase', background: C.white, border: `1px solid ${C.white}`,
              padding: '13px 32px', cursor: 'pointer', color: C.bg, transition: 'opacity 0.2s',
            }}>
              Submit Booking
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

/* ─── Success screen ─────────────────────────────────────────────────────── */
function SuccessScreen() {
  return (
    <div style={{ background: C.bg, minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', border: `1px solid ${C.white}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
        <Check style={{ width: 22, height: 22, color: C.white }} strokeWidth={1.5} />
      </div>
      <h1 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: 'clamp(2rem, 6vw, 3rem)', color: C.white, marginBottom: 16, textAlign: 'center', letterSpacing: '-0.02em' }}>
        You're booked.
      </h1>
      <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: '0.9rem', color: C.silver, lineHeight: 1.9, textAlign: 'center', maxWidth: 340, marginBottom: 40 }}>
        We've received your request. Expect a confirmation text shortly. Clean car incoming.
      </p>
      <Link to="/" style={{
        fontFamily: '"Poppins", sans-serif', fontWeight: 500, fontSize: '0.7rem',
        letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none',
        color: C.silver, border: `1px solid ${C.border}`, padding: '12px 24px',
      }}>
        Back to Home
      </Link>
    </div>
  )
}

/* ─── Shared sub-components ─────────────────────────────────────────────── */
function Section({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', color: C.white, letterSpacing: '-0.02em', marginBottom: 8 }}>
        {title}
      </h2>
      <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: '0.875rem', color: C.silver, marginBottom: 40, lineHeight: 1.7 }}>
        {sub}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {children}
      </div>
    </div>
  )
}

function Field({ label: lbl, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ ...label, marginBottom: 10 }}>{lbl}</p>
      {children}
      {error && <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '0.7rem', color: '#f87171', marginTop: 6 }}>{error}</p>}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', background: C.surface, border: `1px solid ${C.border}`,
        padding: '13px 16px', ...txt, fontWeight: 300, fontSize: '0.875rem',
        outline: 'none', boxSizing: 'border-box', color: C.white,
        transition: 'border-color 0.2s',
      }}
      onFocus={e => (e.target.style.borderColor = 'rgba(166,166,166,0.4)')}
      onBlur={e => (e.target.style.borderColor = C.border)}
    />
  )
}

function ToggleGroup<T extends string>({
  options, value, onChange,
}: {
  options: { value: T; label: string }[]
  value: T | ''
  onChange: (v: T) => void
}) {
  return (
    <div style={{ display: 'flex', gap: 0 }}>
      {options.map((o, i) => {
        const active = value === o.value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            style={{
              flex: 1,
              padding: '12px 8px',
              background: active ? C.white : 'transparent',
              border: `1px solid ${active ? C.white : C.border}`,
              borderLeft: i > 0 ? 'none' : undefined,
              cursor: 'pointer',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: active ? 500 : 400,
              fontSize: '0.75rem',
              letterSpacing: '0.06em',
              color: active ? C.bg : C.silver,
              transition: 'all 0.2s',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function SummaryRow({ k, v }: { k: string; v: string }) {
  if (!v || v.trim() === '') return null
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
      <span style={{ ...label, fontSize: '0.55rem' }}>{k}</span>
      <span style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: '0.78rem', color: C.silver, textAlign: 'right' }}>{v}</span>
    </div>
  )
}
