import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="site-container" style={{ minHeight: '70vh', display: 'grid', placeContent: 'center', textAlign: 'center' }}>
      <p className="eyebrow" style={{ justifyContent: 'center' }}>PAGE NOT FOUND</p>
      <h1 style={{ fontSize: 'clamp(42px, 8vw, 72px)', letterSpacing: '-.06em', margin: 0 }}>This page took<br />a different route.</h1>
      <Link className="button button-primary" style={{ justifySelf: 'center', marginTop: 24 }} to="/">Back to Reach <span aria-hidden="true">↗</span></Link>
    </main>
  )
}
