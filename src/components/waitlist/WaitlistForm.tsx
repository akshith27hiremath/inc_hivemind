'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [position, setPosition] = useState(0)
  const [emailStatus, setEmailStatus] = useState<'sending' | 'sent' | 'failed' | null>(null)
  const formCardRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  // --- Fetch waitlist count on mount ---
  useEffect(() => {
    const countEl = document.getElementById('wl-count')
    if (!countEl) return

    let cancelled = false
    let rafId: number

    fetch('/api/waitlist')
      .then(res => res.json())
      .then(data => {
        if (cancelled) return
        const target = data.count || 0
        if (target === 0) { countEl.textContent = '0'; return }
        const duration = 1200
        const start = performance.now()
        const tick = (now: number) => {
          if (cancelled) return
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          countEl.textContent = Math.floor(target * eased).toLocaleString()
          if (progress < 1) rafId = requestAnimationFrame(tick)
        }
        rafId = requestAnimationFrame(tick)
      })
      .catch(() => { if (!cancelled) countEl.textContent = '0' })

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
    }
  }, [])

  // --- Cursor, particles, reveal animations ---
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const rafIds: number[] = []

    // Cursor
    const cursorDot = document.getElementById('cursor-dot')
    const cursorRing = document.getElementById('cursor-ring')
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2
    let ringX = mouseX, ringY = mouseY

    if (!isMobile && cursorDot && cursorRing) {
      const onMove = (e: MouseEvent) => {
        mouseX = e.clientX; mouseY = e.clientY
        cursorDot.style.left = mouseX + 'px'
        cursorDot.style.top = mouseY + 'px'
      }
      document.addEventListener('mousemove', onMove)

      const animRing = () => {
        ringX += (mouseX - ringX) * 0.12
        ringY += (mouseY - ringY) * 0.12
        cursorRing.style.left = ringX + 'px'
        cursorRing.style.top = ringY + 'px'
        rafIds.push(requestAnimationFrame(animRing))
      }
      rafIds.push(requestAnimationFrame(animRing))

      const hoverEls = document.querySelectorAll('a, button, input')
      const addHover = () => cursorRing.classList.add('hover')
      const removeHover = () => cursorRing.classList.remove('hover')
      hoverEls.forEach(el => {
        el.addEventListener('mouseenter', addHover)
        el.addEventListener('mouseleave', removeHover)
      })

      // Cleanup stored for return
      var cleanupCursor = () => {
        document.removeEventListener('mousemove', onMove)
        hoverEls.forEach(el => {
          el.removeEventListener('mouseenter', addHover)
          el.removeEventListener('mouseleave', removeHover)
        })
      }
    }

    // Particles
    const bgCanvas = document.getElementById('bg-graph') as HTMLCanvasElement | null
    if (bgCanvas) {
      const ctx = bgCanvas.getContext('2d')!
      const COUNT = isMobile ? 30 : 70

      const resize = () => {
        bgCanvas.width = window.innerWidth
        bgCanvas.height = window.innerHeight
      }
      resize()
      window.addEventListener('resize', resize)

      const particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        size: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.3 + 0.05,
      }))

      const draw = () => {
        ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height)
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          p.x += p.vx; p.y += p.vy
          if (p.x < 0 || p.x > bgCanvas.width) p.vx *= -1
          if (p.y < 0 || p.y > bgCanvas.height) p.vy *= -1
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(212,175,55,${p.alpha})`
          ctx.fill()
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j]
            const dx = p.x - q.x, dy = p.y - q.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 130) {
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(q.x, q.y)
              ctx.strokeStyle = `rgba(212,175,55,${(1 - dist / 130) * 0.06})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
        rafIds.push(requestAnimationFrame(draw))
      }
      rafIds.push(requestAnimationFrame(draw))

      var cleanupParticles = () => window.removeEventListener('resize', resize)
    }

    // Reveal animations
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt((entry.target as HTMLElement).dataset.delay || '0')
          setTimeout(() => entry.target.classList.add('revealed'), delay)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' })

    document.querySelectorAll('.waitlist-page [data-reveal]').forEach(el => observer.observe(el))

    // Trigger reveal for elements already in viewport
    const revealTimers: ReturnType<typeof setTimeout>[] = []
    document.querySelectorAll('.waitlist-page [data-reveal]').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        const delay = parseInt((el as HTMLElement).dataset.delay || '0')
        revealTimers.push(setTimeout(() => el.classList.add('revealed'), delay))
      }
    })

    return () => {
      rafIds.forEach(id => cancelAnimationFrame(id))
      revealTimers.forEach(id => clearTimeout(id))
      observer.disconnect()
      cleanupCursor?.()
      cleanupParticles?.()
      // Reset reveal classes so they can re-trigger on strict mode re-mount
      document.querySelectorAll('.waitlist-page .revealed').forEach(el => el.classList.remove('revealed'))
    }
  }, [])

  // --- Form submission ---
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmed = email.trim()
    if (!trimmed) { setError('Email is required.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setError('Please enter a valid email address.'); return }

    setLoading(true)

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })

      const data = await res.json()

      if (res.status === 201) {
        // New signup
        setPosition(data.id)
        setEmailStatus('sending')

        // Transition to success
        if (formCardRef.current) {
          formCardRef.current.style.opacity = '0'
          formCardRef.current.style.transform = 'scale(0.96)'
          formCardRef.current.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }

        setTimeout(() => {
          setSuccess(true)
          // Simulate email status (server sends async — we show optimistic UI)
          setTimeout(() => setEmailStatus('sent'), 2000)
        }, 350)

        // Update count
        const countEl = document.getElementById('wl-count')
        if (countEl) {
          const current = parseInt(countEl.textContent?.replace(/,/g, '') || '0')
          countEl.textContent = (current + 1).toLocaleString()
        }

      } else if (res.status === 200) {
        // Already on waitlist
        setError('This email is already on the waitlist!')
      } else if (data.error) {
        setError(data.error)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [email])

  // --- Share handlers ---
  const handleShare = useCallback((type: string) => {
    if (type === 'twitter') {
      const text = encodeURIComponent('Just joined the @hivemind_app waitlist \u2014 portfolio intelligence that shows you the hidden connections Wall Street sees. Early bird discount locked in.\n\nGet on the list:')
      const url = encodeURIComponent(window.location.href)
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=550,height=420')
    }
    if (type === 'copy') {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const btn = document.querySelector('[data-share="copy"]') as HTMLButtonElement | null
        if (btn) {
          btn.textContent = 'Copied!'
          btn.style.color = 'var(--green)'
          btn.style.borderColor = 'var(--green)'
          setTimeout(() => {
            btn.textContent = 'Copy Link'
            btn.style.color = ''
            btn.style.borderColor = ''
          }, 2000)
        }
      })
    }
  }, [])

  return (
    <div className="wl-form-wrap" data-reveal="" data-delay="200">
      {/* Form card */}
      <div
        className="wl-form-card"
        id="wl-form-card"
        ref={formCardRef}
        style={success ? { display: 'none' } : undefined}
      >
        <div className="wl-form-header">
          <span className="wl-form-tag">JOIN THE WAITLIST</span>
          <h2>Get early access<br />+ <em>40% off forever.</em></h2>
          <p>No spam. Just one email when we launch.</p>
        </div>

        <form className="wl-form" autoComplete="off" onSubmit={handleSubmit}>
          <div className="wl-input-group">
            <label htmlFor="wl-email">Email address</label>
            <div className="wl-input-wrap">
              <svg className="wl-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
              <input
                type="email"
                id="wl-email"
                name="email"
                placeholder="you@email.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <span className="wl-error">{error}</span>
          </div>

          <button type="submit" className={`wl-submit${loading ? ' loading' : ''}`} disabled={loading}>
            <span className="wl-submit-text">Join Waitlist — Get Early Bird Discount</span>
            <span className="wl-submit-loader" />
          </button>

          <div className="wl-terms">
            By joining, you agree to receive product updates. Unsubscribe anytime.
          </div>
        </form>

        <div className="wl-form-decor">
          <div className="wl-decor-line" />
          <span>OR</span>
          <div className="wl-decor-line" />
        </div>

        <a href="/" className="wl-learn-more">
          Learn more about Hivemind
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </a>
      </div>

      {/* SUCCESS STATE */}
      <div className={`wl-success${success ? ' visible' : ''}`} ref={successRef}>
        <div className="wl-success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h2>You&apos;re on the list.</h2>
        <p>We&apos;ll email you when Hivemind launches with your <strong>exclusive 40% early bird discount.</strong></p>
        <div className="wl-email-status">
          {emailStatus === 'sending' && (
            <span className="wl-email-sending">
              <span className="wl-mini-spinner" />
              Sending confirmation email...
            </span>
          )}
          {emailStatus === 'sent' && (
            <span className="wl-email-sent">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" strokeWidth="1.5" /></svg>
              Confirmation email sent
            </span>
          )}
          {emailStatus === 'failed' && (
            <span className="wl-email-failed">
              Could not send confirmation — we&apos;ll still email you at launch.
            </span>
          )}
        </div>
        <div className="wl-success-pos">
          <span className="wl-pos-label">YOUR POSITION</span>
          <span className="wl-pos-num">#{position}</span>
        </div>
        <div className="wl-success-share">
          <span>Spread the word</span>
          <div className="wl-share-btns">
            <button className="wl-share-btn" data-share="twitter" onClick={() => handleShare('twitter')}>&#x1D54F; Post</button>
            <button className="wl-share-btn" data-share="copy" onClick={() => handleShare('copy')}>Copy Link</button>
          </div>
        </div>
        <a href="/" className="wl-success-home">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Explore Hivemind
        </a>
      </div>
    </div>
  )
}
