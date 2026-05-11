import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Lock, RefreshCw } from 'lucide-react'
import { getJobs, updateJobStatus } from '../lib/storage'
import type { Job, JobStatus, JobTag } from '../lib/types'

const C = {
  bg:       '#0D0D0D',
  charcoal: '#1A1A1A',
  surface:  '#141414',
  border:   'rgba(166,166,166,0.14)',
  borderHi: 'rgba(166,166,166,0.28)',
  silver:   '#A6A6A6',
  white:    '#FFFFFF',
}

const txt: React.CSSProperties = { fontFamily: '"Poppins", sans-serif', color: C.white }
const label: React.CSSProperties = {
  fontFamily: '"Poppins", sans-serif', fontWeight: 400,
  fontSize: '0.55rem', letterSpacing: '0.32em', textTransform: 'uppercase' as const, color: C.silver,
}

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'detaildoor2025'

const STATUS_OPTIONS: JobStatus[] = ['new', 'assigned', 'completed']
const STATUS_LABELS: Record<JobStatus, string> = { new: 'New', assigned: 'Assigned', completed: 'Completed' }
const STATUS_COLORS: Record<JobStatus, string> = {
  new:       'rgba(255,255,255,0.9)',
  assigned:  'rgba(96,165,250,0.9)',
  completed: 'rgba(74,222,128,0.9)',
}

const TAG_COLORS: Record<JobTag, { bg: string; text: string }> = {
  'URGENT':    { bg: 'rgba(248,113,113,0.12)', text: 'rgba(248,113,113,0.9)' },
  'SPECIALTY': { bg: 'rgba(167,139,250,0.12)', text: 'rgba(167,139,250,0.9)' },
  'HIGH VALUE':{ bg: 'rgba(251,191,36,0.12)',  text: 'rgba(251,191,36,0.9)' },
}

/* ─── Password Gate ──────────────────────────────────────────────────────── */
function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)

  const attempt = () => {
    if (pw === ADMIN_PASSWORD) { onAuth() }
    else { setErr(true); setTimeout(() => setErr(false), 1800) }
  }

  return (
    <div style={{ background: C.bg, minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: 44, height: 44, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
        <Lock style={{ width: 16, height: 16, color: C.silver }} />
      </div>
      <h1 style={{ ...txt, fontWeight: 600, fontSize: '1.4rem', letterSpacing: '-0.02em', marginBottom: 8 }}>
        Admin Access
      </h1>
      <p style={{ ...txt, fontWeight: 300, fontSize: '0.82rem', color: C.silver, marginBottom: 36 }}>
        Enter your password to continue.
      </p>
      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          placeholder="Password"
          autoFocus
          style={{
            width: '100%', background: C.surface, border: `1px solid ${err ? 'rgba(248,113,113,0.5)' : C.border}`,
            padding: '13px 16px', ...txt, fontWeight: 300, fontSize: '0.875rem',
            outline: 'none', boxSizing: 'border-box', color: C.white, transition: 'border-color 0.2s',
          }}
        />
        {err && (
          <p style={{ fontFamily: '"Poppins", sans-serif', fontSize: '0.72rem', color: '#f87171' }}>
            Incorrect password.
          </p>
        )}
        <button
          type="button"
          onClick={attempt}
          style={{
            ...txt, fontWeight: 500, fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase',
            background: C.white, border: `1px solid ${C.white}`, padding: '13px',
            cursor: 'pointer', color: C.bg,
          }}
        >
          Enter
        </button>
      </div>
      <Link to="/" style={{ ...label, fontSize: '0.5rem', marginTop: 32, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
        <ArrowLeft style={{ width: 11, height: 11 }} /> Back to site
      </Link>
    </div>
  )
}

/* ─── Admin Dashboard ───────────────────────────────────────────────────── */
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [filter, setFilter] = useState<JobStatus | 'all'>('all')

  const reload = () => setJobs(getJobs())

  useEffect(() => { if (authed) reload() }, [authed])

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />

  const visible = filter === 'all' ? jobs : jobs.filter(j => j.status === filter)

  const changeStatus = (id: string, status: JobStatus) => {
    updateJobStatus(id, status)
    reload()
  }

  const counts = {
    all:       jobs.length,
    new:       jobs.filter(j => j.status === 'new').length,
    assigned:  jobs.filter(j => j.status === 'assigned').length,
    completed: jobs.filter(j => j.status === 'completed').length,
  }

  return (
    <div style={{ background: C.bg, minHeight: '100svh', color: C.white }}>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, background: C.charcoal }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between" style={{ height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link to="/" style={{ color: C.silver, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
              <ArrowLeft style={{ width: 14, height: 14 }} />
            </Link>
            <span style={{ ...txt, fontWeight: 600, fontSize: '0.9rem', letterSpacing: '-0.01em' }}>
              Detail Door <span style={{ color: C.silver, fontWeight: 300 }}>/ Jobs</span>
            </span>
          </div>
          <button
            type="button"
            onClick={reload}
            title="Refresh"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: C.silver }}
          >
            <RefreshCw style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10">

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
          {(['all', 'new', 'assigned', 'completed'] as const).map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              style={{
                padding: '8px 18px', cursor: 'pointer', transition: 'all 0.2s',
                background: filter === s ? C.white : 'transparent',
                border: `1px solid ${filter === s ? C.white : C.border}`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <span style={{
                fontFamily: '"Poppins", sans-serif', fontWeight: filter === s ? 500 : 400,
                fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: filter === s ? C.bg : C.silver,
              }}>
                {s === 'all' ? 'All Jobs' : STATUS_LABELS[s]}
              </span>
              <span style={{
                fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: '0.65rem',
                color: filter === s ? C.bg : 'rgba(166,166,166,0.5)',
              }}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        {visible.length === 0 ? (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <p style={{ ...label, letterSpacing: '0.2em' }}>No jobs {filter !== 'all' ? `with status "${STATUS_LABELS[filter as JobStatus]}"` : 'yet'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['Customer', 'Vehicle', 'Services', 'Conditions', 'Tags', 'Submitted', 'Status'].map(h => (
                    <th key={h} style={{ ...label, fontSize: '0.5rem', textAlign: 'left', padding: '10px 16px', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((job, i) => (
                  <JobRow
                    key={job.id}
                    job={job}
                    alt={i % 2 === 1}
                    onStatusChange={s => changeStatus(job.id, s)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}

/* ─── Table row ──────────────────────────────────────────────────────────── */
function JobRow({ job, alt, onStatusChange }: { job: Job; alt: boolean; onStatusChange: (s: JobStatus) => void }) {
  const v = job.values
  const dt = new Date(job.createdAt)
  const dateStr = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const timeStr = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const serviceLabels: Record<string, string> = {
    interior: 'Interior', exterior: 'Exterior', pet_hair: 'Pet Hair',
    odor_removal: 'Odor', ceramic_coating: 'Ceramic',
  }

  return (
    <tr style={{ background: alt ? C.surface : 'transparent', borderBottom: `1px solid ${C.border}` }}>

      {/* Customer */}
      <td style={{ padding: '18px 16px', minWidth: 160 }}>
        <p style={{ ...txt, fontWeight: 500, fontSize: '0.82rem', marginBottom: 4 }}>{v.name}</p>
        <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: '0.72rem', color: C.silver }}>{v.phone}</p>
        <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: '0.68rem', color: 'rgba(166,166,166,0.5)', marginTop: 2 }}>{v.address}</p>
      </td>

      {/* Vehicle */}
      <td style={{ padding: '18px 16px', minWidth: 140 }}>
        <p style={{ ...txt, fontWeight: 400, fontSize: '0.82rem', marginBottom: 4 }}>
          {v.vehicleMake} {v.vehicleModel}
        </p>
        <span style={{
          fontFamily: '"Poppins", sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em',
          textTransform: 'uppercase', color: C.silver,
        }}>
          {v.vehicleSize}
        </span>
      </td>

      {/* Services */}
      <td style={{ padding: '18px 16px', minWidth: 140 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {v.services.map(s => (
            <span key={s} style={{
              fontFamily: '"Poppins", sans-serif', fontSize: '0.6rem', letterSpacing: '0.08em',
              padding: '3px 8px', border: `1px solid ${C.border}`, color: C.silver,
            }}>
              {serviceLabels[s] ?? s}
            </span>
          ))}
        </div>
        <p style={{ ...label, fontSize: '0.48rem', marginTop: 8 }}>
          {v.urgency === 'asap' ? '⚑ ASAP' : v.urgency === 'this_week' ? 'This week' : 'Flexible'}
        </p>
      </td>

      {/* Conditions */}
      <td style={{ padding: '18px 16px', minWidth: 120 }}>
        <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: '0.72rem', color: C.silver, marginBottom: 4 }}>
          Int: <span style={{ color: C.white }}>{v.interiorCondition}</span>
        </p>
        <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: '0.72rem', color: C.silver }}>
          Ext: <span style={{ color: C.white }}>{v.exteriorCondition}</span>
        </p>
        {v.photoNames.length > 0 && (
          <p style={{ ...label, fontSize: '0.46rem', marginTop: 6, color: 'rgba(166,166,166,0.5)' }}>
            {v.photoNames.length} photo{v.photoNames.length > 1 ? 's' : ''} attached
          </p>
        )}
      </td>

      {/* Tags */}
      <td style={{ padding: '18px 16px', minWidth: 100 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {job.tags.length === 0 && (
            <span style={{ ...label, fontSize: '0.46rem', color: 'rgba(166,166,166,0.3)' }}>—</span>
          )}
          {job.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: '"Poppins", sans-serif', fontWeight: 500, fontSize: '0.55rem',
              letterSpacing: '0.1em', padding: '3px 8px',
              background: TAG_COLORS[tag].bg, color: TAG_COLORS[tag].text,
              whiteSpace: 'nowrap', display: 'inline-block',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </td>

      {/* Date */}
      <td style={{ padding: '18px 16px', minWidth: 90, whiteSpace: 'nowrap' }}>
        <p style={{ ...txt, fontWeight: 400, fontSize: '0.78rem' }}>{dateStr}</p>
        <p style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: '0.68rem', color: C.silver }}>{timeStr}</p>
        {v.notes && (
          <p style={{ ...label, fontSize: '0.44rem', marginTop: 6, color: 'rgba(166,166,166,0.4)' }}>Has notes</p>
        )}
      </td>

      {/* Status */}
      <td style={{ padding: '18px 16px', minWidth: 130 }}>
        <select
          value={job.status}
          onChange={e => onStatusChange(e.target.value as JobStatus)}
          style={{
            background: C.charcoal, border: `1px solid ${C.border}`,
            padding: '7px 12px', cursor: 'pointer', outline: 'none',
            fontFamily: '"Poppins", sans-serif', fontWeight: 500, fontSize: '0.68rem',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: STATUS_COLORS[job.status], width: '100%',
            appearance: 'none', WebkitAppearance: 'none',
          }}
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s} style={{ color: C.white, background: C.charcoal }}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </td>

    </tr>
  )
}
