import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import './styles/tailwind.css'
import './styles/styles.css'
import './styles/landing.css'
import './styles/polish.css'

document.body.classList.add('agency-site')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
