import { apiRequest } from './client'

export function subscribeToUpdates(email: string) {
  return apiRequest<{ ok: boolean }>('/subscriptions', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}
