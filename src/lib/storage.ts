import type { Job, JobFormValues, JobTag, JobStatus } from './types'

const KEY = 'detaildoor_jobs'

export function computeTags(v: JobFormValues): JobTag[] {
  const tags: JobTag[] = []
  if (v.services.includes('pet_hair'))         tags.push('SPECIALTY')
  if (v.urgency === 'asap')                    tags.push('URGENT')
  if (v.services.includes('ceramic_coating'))  tags.push('HIGH VALUE')
  return tags
}

export function getJobs(): Job[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') }
  catch { return [] }
}

export function saveJob(values: JobFormValues): Job {
  const job: Job = {
    id:        crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    values,
    tags:      computeTags(values),
    status:    'new',
  }
  localStorage.setItem(KEY, JSON.stringify([job, ...getJobs()]))
  return job
}

export function updateJobStatus(id: string, status: JobStatus): void {
  const updated = getJobs().map(j => j.id === id ? { ...j, status } : j)
  localStorage.setItem(KEY, JSON.stringify(updated))
}
