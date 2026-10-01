const apiBase = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '')

export interface ApiErrorBody {
  error?: string
  message?: string
}

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  headers.set('Accept', 'application/json')
  if (init?.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers,
  })

  const body = (await response.json().catch(() => ({}))) as T & ApiErrorBody
  if (!response.ok) {
    throw new ApiError(body.error || body.message || 'The request could not be completed.', response.status)
  }
  return body
}
