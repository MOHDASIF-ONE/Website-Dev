import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, LoaderCircle } from 'lucide-react'
import { z } from 'zod'
import { createQuote, type QuotePayload } from '../api/quotes'

const quoteSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.'),
  business_type: z.string().trim().min(2, 'Please enter your business name.'),
  contact: z.string().trim().min(5, 'Please enter an email or phone number.'),
  plan: z.string().trim().min(1, 'Choose the kind of project you have in mind.'),
  message: z.string().trim().max(2000, 'Please keep your note under 2,000 characters.'),
})

export default function QuoteForm() {
  const [validationMessage, setValidationMessage] = useState('')
  const mutation = useMutation({ mutationFn: createQuote })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setValidationMessage('')
    mutation.reset()

    const values = Object.fromEntries(new FormData(form).entries())
    const result = quoteSchema.safeParse({
      name: values.name,
      business_type: values.biz,
      contact: values.contact,
      plan: values.plan,
      message: values.message || '',
    })

    if (!result.success) {
      setValidationMessage(result.error.issues[0]?.message ?? 'Please check the form and try again.')
      return
    }

    mutation.mutate(result.data as QuotePayload, {
      onSuccess: (response) => {
        if (response.ok) form.reset()
      },
    })
  }

  const message = validationMessage || (mutation.isSuccess
    ? 'Thanks for reaching out. We’ll be in touch within one business day.'
    : mutation.error instanceof Error
      ? `We couldn’t send that just now. ${mutation.error.message}`
      : '')
  const state = validationMessage || mutation.isError ? 'error' : 'success'

  return (
    <form id="quoteForm" className="contact-form reveal" onSubmit={handleSubmit} noValidate>
      <div className="form-heading">
        <span>01 — START A CONVERSATION</span>
        <p>No pressure. No pitch deck. Just a good first chat.</p>
      </div>
      <div className="form-grid">
        <label>Your name<input required name="name" autoComplete="name" placeholder="Alex Morgan" /></label>
        <label>Business name<input required name="biz" autoComplete="organization" placeholder="The name people know you by" /></label>
        <label>Email or phone<input required name="contact" autoComplete="email" placeholder="How should we reach you?" /></label>
        <label>What are you looking for?
          <select id="planSelect" name="plan" defaultValue="Business - $499">
            <option value="Business - $499">A business website</option>
            <option value="Starter - $249">A starter website</option>
            <option value="Mega Store - $899">An online store</option>
            <option value="Custom">Something custom</option>
          </select>
        </label>
        <label className="form-full">A little about the project<textarea name="message" rows={3} maxLength={2000} placeholder="What are you hoping to build or improve?" /></label>
      </div>
      <button className="button button-light form-submit" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Sending your details' : 'Send the details'}
        <span aria-hidden="true">{mutation.isPending ? <LoaderCircle className="form-spinner" size={16} /> : <ArrowUpRight size={16} />}</span>
      </button>
      <AnimatePresence mode="wait" initial={false}>
        {message && (
          <motion.p
            className="form-status"
            id="formOk"
            role="status"
            aria-live="polite"
            data-state={state}
            key={message}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.18 }}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}
