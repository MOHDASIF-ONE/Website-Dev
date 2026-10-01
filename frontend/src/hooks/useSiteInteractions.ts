import { useEffect } from 'react'

export function useSiteInteractions() {
  useEffect(() => {
    const root = document.body
    const cleanups: Array<() => void> = []
    const listen = <K extends keyof WindowEventMap>(target: Window, event: K, handler: (event: WindowEventMap[K]) => void, options?: AddEventListenerOptions) => {
      target.addEventListener(event, handler as EventListener, options)
      cleanups.push(() => target.removeEventListener(event, handler as EventListener, options))
    }
    const listenElement = <K extends keyof HTMLElementEventMap>(target: HTMLElement, event: K, handler: (event: HTMLElementEventMap[K]) => void, options?: AddEventListenerOptions) => {
      target.addEventListener(event, handler as EventListener, options)
      cleanups.push(() => target.removeEventListener(event, handler as EventListener, options))
    }

    const header = root.querySelector<HTMLElement>('#siteHeader')
    const menuButton = root.querySelector<HTMLButtonElement>('#menuToggle')
    const siteNav = root.querySelector<HTMLElement>('#siteNav')
    const mobileNav = window.matchMedia('(max-width: 760px)')
    const syncNavVisibility = () => {
      if (siteNav) siteNav.inert = mobileNav.matches && menuButton?.getAttribute('aria-expanded') !== 'true'
    }
    const closeMenu = () => {
      menuButton?.setAttribute('aria-expanded', 'false')
      menuButton?.setAttribute('aria-label', 'Open menu')
      siteNav?.classList.remove('open')
      syncNavVisibility()
    }
    syncNavVisibility()
    const onBreakpointChange = () => syncNavVisibility()
    mobileNav.addEventListener('change', onBreakpointChange)
    cleanups.push(() => mobileNav.removeEventListener('change', onBreakpointChange))

    if (menuButton) {
      listenElement(menuButton, 'click', () => {
        const open = menuButton.getAttribute('aria-expanded') !== 'true'
        menuButton.setAttribute('aria-expanded', String(open))
        menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
        siteNav?.classList.toggle('open', open)
        syncNavVisibility()
      })
    }
    siteNav?.querySelectorAll('a').forEach((link) => listenElement(link, 'click', closeMenu))

    let scrollPending = false
    const syncHeader = () => {
      if (scrollPending) return
      scrollPending = true
      requestAnimationFrame(() => {
        header?.classList.toggle('scrolled', window.scrollY > 18)
        scrollPending = false
      })
    }
    listen(window, 'scroll', syncHeader, { passive: true })
    syncHeader()

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const revealItems = root.querySelectorAll<HTMLElement>('.reveal')
    let revealObserver: IntersectionObserver | undefined
    let counterObserver: IntersectionObserver | undefined
    if (!reducedMotion && 'IntersectionObserver' in window) {
      root.classList.add('motion-ready')
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('visible')
          revealObserver?.unobserve(entry.target)
        })
      }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' })
      revealItems.forEach((item) => revealObserver?.observe(item))
      counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const element = entry.target as HTMLElement
          const end = Number(element.dataset.counter || 0)
          const suffix = element.dataset.suffix || ''
          const started = performance.now()
          const duration = 900
          const tick = (now: number) => {
            const progress = Math.min(1, (now - started) / duration)
            element.textContent = `${Math.round(end * (1 - (1 - progress) ** 4))}${suffix}`
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          counterObserver?.unobserve(element)
        })
      }, { threshold: 0.5 })
      root.querySelectorAll<HTMLElement>('[data-counter]').forEach((item) => counterObserver?.observe(item))
    } else {
      revealItems.forEach((item) => item.classList.add('visible'))
      root.querySelectorAll<HTMLElement>('[data-counter]').forEach((item) => {
        item.textContent = `${item.dataset.counter}${item.dataset.suffix || ''}`
      })
    }

    const filters = [...root.querySelectorAll<HTMLButtonElement>('[data-filter]')]
    const projects = [...root.querySelectorAll<HTMLElement>('.project-card')]
    filters.forEach((button) => listenElement(button, 'click', () => {
      filters.forEach((item) => item.classList.toggle('active', item === button))
      const filter = button.dataset.filter
      projects.forEach((project) => { project.hidden = filter !== 'all' && project.dataset.category !== filter })
    }))

    const planSelect = root.querySelector<HTMLSelectElement>('#planSelect')
    root.querySelectorAll<HTMLElement>('[data-plan]').forEach((link) => listenElement(link, 'click', () => {
      const plan = link.dataset.plan?.toLowerCase() || ''
      const match = [...(planSelect?.options || [])].find((option) => option.value.toLowerCase().includes(plan))
      if (match && planSelect) planSelect.value = match.value
    }))

    root.querySelectorAll<HTMLElement>('.floating-note,.hero-proof,.pricing-card,.contact-form').forEach((surface) => surface.classList.add('glass-surface'))
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (finePointer && !reducedMotion) {
      root.querySelectorAll<HTMLElement>('.magnetic').forEach((button) => {
        listenElement(button, 'pointermove', (event) => {
          const rect = button.getBoundingClientRect()
          const x = (event.clientX - rect.left - rect.width / 2) * 0.055
          const y = (event.clientY - rect.top - rect.height / 2) * 0.07
          button.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
        })
        listenElement(button, 'pointerleave', () => { button.style.transform = '' })
      })
      root.querySelectorAll<HTMLElement>('.glass-surface').forEach((surface) => {
        listenElement(surface, 'pointermove', (event) => {
          const rect = surface.getBoundingClientRect()
          surface.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
          surface.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
        })
        listenElement(surface, 'pointerleave', () => {
          surface.style.setProperty('--spot-x', '50%')
          surface.style.setProperty('--spot-y', '50%')
        })
      })
      root.querySelectorAll<HTMLElement>('.project-card').forEach((card) => {
        listenElement(card, 'pointermove', (event) => {
          const rect = card.getBoundingClientRect()
          const x = (event.clientX - rect.left) / rect.width - 0.5
          const y = (event.clientY - rect.top) / rect.height - 0.5
          card.style.setProperty('--tilt-x', `${(x * 2.4).toFixed(2)}deg`)
          card.style.setProperty('--tilt-y', `${(-y * 2.1).toFixed(2)}deg`)
        })
        listenElement(card, 'pointerleave', () => {
          card.style.setProperty('--tilt-x', '0deg')
          card.style.setProperty('--tilt-y', '0deg')
        })
      })

      const stage = root.querySelector<HTMLElement>('.hero-stage')
      const heroSection = root.querySelector<HTMLElement>('.hero-section')
      const preview = root.querySelector<HTMLElement>('.browser-window')
      const notes = [...root.querySelectorAll<HTMLElement>('.floating-note')]
      let targetX = 0
      let targetY = 0
      let currentX = 0
      let currentY = 0
      let frame = 0
      const animateStage = () => {
        currentX += (targetX - currentX) * 0.13
        currentY += (targetY - currentY) * 0.13
        preview?.style.setProperty('--pointer-x', `${currentX.toFixed(2)}px`)
        preview?.style.setProperty('--pointer-y', `${currentY.toFixed(2)}px`)
        heroSection?.style.setProperty('--glow-x', `${(currentX * 0.45).toFixed(2)}px`)
        heroSection?.style.setProperty('--glow-y', `${(currentY * 0.45).toFixed(2)}px`)
        heroSection?.style.setProperty('--glow-reverse-x', `${(-currentX * 0.3).toFixed(2)}px`)
        heroSection?.style.setProperty('--glow-reverse-y', `${(-currentY * 0.3).toFixed(2)}px`)
        notes.forEach((note, index) => {
          const depth = index === 0 ? -0.65 : 0.8
          note.style.setProperty('--note-x', `${(currentX * depth).toFixed(2)}px`)
          note.style.setProperty('--note-y', `${(currentY * depth).toFixed(2)}px`)
        })
        if (Math.abs(targetX - currentX) > 0.025 || Math.abs(targetY - currentY) > 0.025) frame = requestAnimationFrame(animateStage)
        else frame = 0
      }
      if (stage) {
        listenElement(stage, 'pointermove', (event) => {
          const rect = stage.getBoundingClientRect()
          targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 7
          targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 5
          if (!frame) frame = requestAnimationFrame(animateStage)
        })
        listenElement(stage, 'pointerleave', () => {
          targetX = 0
          targetY = 0
          if (!frame) frame = requestAnimationFrame(animateStage)
        })
      }
      cleanups.push(() => cancelAnimationFrame(frame))
    }

    const processGrid = root.querySelector<HTMLElement>('.process-grid')
    let processObserver: IntersectionObserver | undefined
    let processActive = false
    const updateProcess = () => {
      if (!processActive || !processGrid) return
      const rect = processGrid.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.82 - rect.top) / (rect.height + window.innerHeight * 0.2)))
      processGrid.style.setProperty('--process-progress', progress.toFixed(3))
    }
    if (processGrid && !reducedMotion && 'IntersectionObserver' in window) {
      processObserver = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        processActive = true
        updateProcess()
        listen(window, 'scroll', updateProcess, { passive: true })
        processObserver?.disconnect()
      }, { threshold: 0.05 })
      processObserver.observe(processGrid)
    }

    const year = root.querySelector<HTMLElement>('#yearNow')
    if (year) year.textContent = String(new Date().getFullYear())

    return () => {
      revealObserver?.disconnect()
      counterObserver?.disconnect()
      processObserver?.disconnect()
      cleanups.forEach((cleanup) => cleanup())
      root.classList.remove('motion-ready')
    }
  }, [])
}
