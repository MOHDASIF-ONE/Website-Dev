import { apiRequest } from './client'

export interface QuotePayload {
  name: string
  business_type: string
  contact: string
  plan: string
  message: string
}

export interface QuoteResponse {
  ok: boolean
  id: number
  msg: string
}

export function createQuote(payload: QuotePayload) {
  return apiRequest<QuoteResponse>('/quotes', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
