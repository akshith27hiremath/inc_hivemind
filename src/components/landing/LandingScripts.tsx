'use client'

import { useEffect } from 'react'

export function LandingScripts() {
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2

    // Track all animation frame IDs and observers for cleanup
    const rafIds: number[] = []
    const observers: IntersectionObserver[] = []
    const cleanups: (() => void)[] = []

    // ============================================
    // 1. CURSOR (dot only — no ring)
    // ============================================
    const cursorDot = document.getElementById('cursor-dot')

    if (!isMobile && cursorDot) {
      const onMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX
        mouseY = e.clientY
        cursorDot.style.left = mouseX + 'px'
        cursorDot.style.top = mouseY + 'px'
      }
      document.addEventListener('mousemove', onMouseMove)
      cleanups.push(() => document.removeEventListener('mousemove', onMouseMove))
    }

    // ============================================
    // 2. REVEAL ANIMATIONS
    // ============================================
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt((entry.target as HTMLElement).dataset.delay || '0')
          setTimeout(() => entry.target.classList.add('revealed'), delay)
          revealObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' })
    document.querySelectorAll('.landing-page [data-reveal]').forEach(el => revealObserver.observe(el))
    observers.push(revealObserver)

    // ============================================
    // 3. NAV SCROLL
    // ============================================
    const nav = document.getElementById('nav')
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    cleanups.push(() => window.removeEventListener('scroll', onScroll))
    // Run once immediately
    onScroll()

    // Hamburger menu
    const hamburger = document.getElementById('nav-hamburger')
    const mobileMenu = document.getElementById('mobile-menu')
    if (hamburger && mobileMenu) {
      const toggleMenu = () => {
        hamburger.classList.toggle('active')
        mobileMenu.classList.toggle('open')
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : ''
      }
      hamburger.addEventListener('click', toggleMenu)
      cleanups.push(() => hamburger.removeEventListener('click', toggleMenu))

      const closeMenu = () => {
        hamburger.classList.remove('active')
        mobileMenu.classList.remove('open')
        document.body.style.overflow = ''
      }
      const menuLinks = mobileMenu.querySelectorAll('a')
      menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu)
      })
      cleanups.push(() => {
        menuLinks.forEach(link => link.removeEventListener('click', closeMenu))
        // Ensure body overflow is restored on cleanup
        document.body.style.overflow = ''
      })
    }

    // ============================================
    // 4. BACKGROUND PARTICLE GRAPH
    // ============================================
    const bgCanvas = document.getElementById('bg-graph') as HTMLCanvasElement | null
    if (bgCanvas) {
      const ctx = bgCanvas.getContext('2d')!
      const COUNT = isMobile ? 30 : 70

      const resizeBg = () => { bgCanvas.width = window.innerWidth; bgCanvas.height = window.innerHeight }
      resizeBg()
      window.addEventListener('resize', resizeBg)
      cleanups.push(() => window.removeEventListener('resize', resizeBg))

      class Particle {
        x = 0; y = 0; size = 0; vx = 0; vy = 0; alpha = 0
        constructor() { this.reset() }
        reset() {
          this.x = Math.random() * bgCanvas!.width
          this.y = Math.random() * bgCanvas!.height
          this.size = Math.random() * 1.5 + 0.5
          this.vx = (Math.random() - 0.5) * 0.2
          this.vy = (Math.random() - 0.5) * 0.2
          this.alpha = Math.random() * 0.3 + 0.05
        }
        update() {
          this.x += this.vx
          this.y += this.vy
          if (this.x < 0 || this.x > bgCanvas!.width) this.vx *= -1
          if (this.y < 0 || this.y > bgCanvas!.height) this.vy *= -1
        }
        draw() {
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`
          ctx.fill()
        }
      }

      const particles: Particle[] = []
      for (let i = 0; i < COUNT; i++) particles.push(new Particle())

      const drawBg = () => {
        ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height)
        for (let i = 0; i < particles.length; i++) {
          particles[i].update()
          particles[i].draw()
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 130) {
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.strokeStyle = `rgba(212, 175, 55, ${(1 - dist / 130) * 0.06})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
        rafIds.push(requestAnimationFrame(drawBg))
      }
      rafIds.push(requestAnimationFrame(drawBg))
    }

    // ============================================
    // 5. HERO KNOWLEDGE GRAPH
    // ============================================
    const heroCanvas = document.getElementById('hero-graph') as HTMLCanvasElement | null
    const heroLabelsDiv = document.getElementById('hero-graph-labels')

    if (heroCanvas && heroLabelsDiv) {
      const hctx = heroCanvas.getContext('2d')!
      let hw: number, hh: number

      // Clear any existing labels (prevents duplicates on React Strict Mode re-mount)
      heroLabelsDiv.innerHTML = ''

      const resizeHero = () => {
        const rect = heroCanvas.parentElement!.getBoundingClientRect()
        heroCanvas.width = rect.width
        heroCanvas.height = rect.height
        hw = heroCanvas.width
        hh = heroCanvas.height
      }
      resizeHero()
      window.addEventListener('resize', resizeHero)
      cleanups.push(() => window.removeEventListener('resize', resizeHero))

      const mobileGraph = isMobile
      const heroNodes = [
        { id: 'Your Portfolio', x: 0.5, y: 0.45, size: mobileGraph ? 10 : 14, type: 'center', fixed: true, vx: 0, vy: 0, ox: 0.5, oy: 0.45 },
        { id: 'TSLA', x: 0.25, y: 0.25, size: mobileGraph ? 7 : 10, type: 'portfolio', fixed: false, vx: 0, vy: 0, ox: 0.25, oy: 0.25 },
        { id: 'NVDA', x: 0.75, y: 0.22, size: mobileGraph ? 7 : 10, type: 'portfolio', fixed: false, vx: 0, vy: 0, ox: 0.75, oy: 0.22 },
        { id: 'AMZN', x: 0.68, y: 0.68, size: mobileGraph ? 7 : 10, type: 'portfolio', fixed: false, vx: 0, vy: 0, ox: 0.68, oy: 0.68 },
        { id: 'AAPL', x: 0.28, y: 0.70, size: mobileGraph ? 7 : 10, type: 'portfolio', fixed: false, vx: 0, vy: 0, ox: 0.28, oy: 0.70 },
        { id: 'TSMC', x: 0.90, y: 0.38, size: mobileGraph ? 5 : 7, type: 'entity', fixed: false, vx: 0, vy: 0, ox: 0.90, oy: 0.38 },
        { id: 'Panasonic', x: 0.10, y: 0.15, size: mobileGraph ? 4 : 6, type: 'entity', fixed: false, vx: 0, vy: 0, ox: 0.10, oy: 0.15 },
        { id: 'Foxconn', x: 0.10, y: 0.50, size: mobileGraph ? 4 : 6, type: 'entity', fixed: false, vx: 0, vy: 0, ox: 0.10, oy: 0.50 },
        { id: 'AWS', x: 0.85, y: 0.62, size: mobileGraph ? 5 : 7, type: 'entity', fixed: false, vx: 0, vy: 0, ox: 0.85, oy: 0.62 },
        { id: 'Fed Rates', x: 0.50, y: 0.08, size: mobileGraph ? 5 : 7, type: 'macro', fixed: false, vx: 0, vy: 0, ox: 0.50, oy: 0.08 },
        { id: 'EU Regs', x: 0.88, y: 0.82, size: mobileGraph ? 4 : 6, type: 'macro', fixed: false, vx: 0, vy: 0, ox: 0.88, oy: 0.82 },
        { id: 'China Policy', x: 0.12, y: 0.88, size: mobileGraph ? 4 : 6, type: 'macro', fixed: false, vx: 0, vy: 0, ox: 0.12, oy: 0.88 },
        { id: 'Shipping', x: 0.42, y: 0.88, size: mobileGraph ? 3 : 5, type: 'entity', fixed: false, vx: 0, vy: 0, ox: 0.42, oy: 0.88 },
        { id: 'Lithium', x: 0.15, y: 0.38, size: mobileGraph ? 3 : 5, type: 'entity', fixed: false, vx: 0, vy: 0, ox: 0.15, oy: 0.38 },
        { id: 'AI Chips', x: 0.80, y: 0.12, size: mobileGraph ? 4 : 6, type: 'entity', fixed: false, vx: 0, vy: 0, ox: 0.80, oy: 0.12 },
      ]

      const heroEdges: [number, number][] = [
        [0, 1], [0, 2], [0, 3], [0, 4],
        [1, 6], [1, 13], [1, 12],
        [2, 5], [2, 14],
        [3, 8], [3, 12],
        [4, 7], [4, 5],
        [5, 14],
        [9, 1], [9, 2], [9, 3], [9, 4],
        [10, 3], [10, 8],
        [11, 1], [11, 13],
        [6, 13],
        [7, 11],
      ]

      heroNodes.forEach(n => {
        n.vx = (Math.random() - 0.5) * 0.0003
        n.vy = (Math.random() - 0.5) * 0.0003
      })

      let hoveredNode = -1

      heroNodes.forEach((node, i) => {
        const label = document.createElement('div')
        label.className = `graph-label ${node.type === 'portfolio' ? 'yours' : ''} ${node.type === 'center' ? 'highlight' : ''}`
        label.textContent = node.id
        label.dataset.index = String(i)
        // Set initial position so labels don't flash at 0,0
        label.style.left = (node.x * hw) + 'px'
        label.style.top = (node.y * hh - node.size - 14) + 'px'
        label.addEventListener('mouseenter', () => { hoveredNode = i })
        label.addEventListener('mouseleave', () => { hoveredNode = -1 })
        heroLabelsDiv.appendChild(label)
      })

      const heroLabels = heroLabelsDiv.children

      const getConnected = (idx: number) => {
        const connected = new Set<number>()
        heroEdges.forEach(([a, b]) => {
          if (a === idx) connected.add(b)
          if (b === idx) connected.add(a)
        })
        return connected
      }

      let heroRunning = false
      const heroObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          heroRunning = entry.isIntersecting
          if (heroRunning) drawHeroGraph()
        })
      })
      heroObserver.observe(heroCanvas)
      observers.push(heroObserver)

      const drawHeroGraph = () => {
        if (!heroRunning) return
        hctx.clearRect(0, 0, hw, hh)

        heroNodes.forEach(n => {
          if (!n.fixed) {
            n.x = n.ox + Math.sin(Date.now() * 0.001 * (n.vx * 5000 + 1)) * 0.015
            n.y = n.oy + Math.cos(Date.now() * 0.001 * (n.vy * 5000 + 1)) * 0.012
          }
        })

        const connected = hoveredNode >= 0 ? getConnected(hoveredNode) : null

        heroEdges.forEach(([a, b]) => {
          const ax = heroNodes[a].x * hw, ay = heroNodes[a].y * hh
          const bx = heroNodes[b].x * hw, by = heroNodes[b].y * hh

          let alpha = 0.08
          if (connected) {
            if (a === hoveredNode || b === hoveredNode) alpha = 0.35
            else alpha = 0.03
          }

          hctx.beginPath()
          hctx.moveTo(ax, ay)
          hctx.lineTo(bx, by)
          hctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`
          hctx.lineWidth = alpha > 0.2 ? 1.5 : 0.8
          hctx.stroke()

          if (alpha > 0.2) {
            const t = (Date.now() % 2000) / 2000
            const px = ax + (bx - ax) * t
            const py = ay + (by - ay) * t
            hctx.beginPath()
            hctx.arc(px, py, 2, 0, Math.PI * 2)
            hctx.fillStyle = `rgba(212, 175, 55, ${0.6 * (1 - t)})`
            hctx.fill()
          }
        })

        heroNodes.forEach((node, i) => {
          const x = node.x * hw
          const y = node.y * hh

          let alpha = 0.6
          let size = node.size
          if (connected) {
            if (i === hoveredNode) { alpha = 1; size *= 1.3 }
            else if (connected.has(i)) { alpha = 0.8; size *= 1.1 }
            else { alpha = 0.15 }
          }

          if (alpha > 0.5 && node.type !== 'entity') {
            hctx.beginPath()
            hctx.arc(x, y, size + 8, 0, Math.PI * 2)
            hctx.fillStyle = `rgba(212, 175, 55, ${alpha * 0.08})`
            hctx.fill()
          }

          hctx.beginPath()
          hctx.arc(x, y, size, 0, Math.PI * 2)
          const color = node.type === 'center' ? `rgba(212, 175, 55, ${alpha})` :
                        node.type === 'portfolio' ? `rgba(212, 175, 55, ${alpha * 0.7})` :
                        node.type === 'macro' ? `rgba(200, 160, 80, ${alpha * 0.4})` :
                        `rgba(180, 170, 150, ${alpha * 0.3})`
          hctx.fillStyle = color
          hctx.fill()

          if (heroLabels[i]) {
            const el = heroLabels[i] as HTMLElement
            el.style.left = x + 'px'
            el.style.top = (y - size - 14) + 'px'

            if (connected) {
              if (i === hoveredNode) el.className = 'graph-label highlight'
              else if (connected.has(i)) el.className = `graph-label ${node.type === 'portfolio' ? 'yours' : ''}`
              else el.className = 'graph-label dim'
            } else {
              el.className = `graph-label ${node.type === 'portfolio' ? 'yours' : ''} ${node.type === 'center' ? 'highlight' : ''}`
            }
          }
        })

        rafIds.push(requestAnimationFrame(drawHeroGraph))
      }
    }

    // ============================================
    // 6. RIPPLE EFFECT INTERACTIVE DEMO
    // ============================================
    const rippleCanvas = document.getElementById('ripple-canvas') as HTMLCanvasElement | null
    const rippleLabelsEl = document.getElementById('ripple-labels')
    const rippleInfo = document.getElementById('ripple-info-inner')

    if (rippleCanvas && rippleLabelsEl && rippleInfo) {
      const rctx = rippleCanvas.getContext('2d')!
      let rw: number, rh: number

      const resizeRipple = () => {
        const rect = rippleCanvas.getBoundingClientRect()
        rippleCanvas.width = rect.width
        rippleCanvas.height = rect.height
        rw = rippleCanvas.width
        rh = rippleCanvas.height
      }
      resizeRipple()
      window.addEventListener('resize', resizeRipple)
      cleanups.push(() => window.removeEventListener('resize', resizeRipple))

      type ScenarioNode = { id: string; x: number; y: number; type: string; hop: number; portfolio?: boolean }
      type Scenario = {
        title: string
        nodes: ScenarioNode[]
        edges: [number, number][]
        info: { title: string; desc: string; path: string[] }
      }

      const mob = isMobile
      const scenarios: Scenario[] = [
        {
          title: 'Musk leaves Tesla',
          nodes: [
            { id: mob ? 'Musk Exit' : 'Musk Exits TSLA', x: 0.13, y: 0.30, type: 'event', hop: 0 },
            { id: 'TSLA', x: 0.32, y: 0.15, type: 'direct', hop: 1, portfolio: true },
            { id: mob ? 'TSLA -18%' : 'TSLA Stock -18%', x: 0.32, y: 0.50, type: 'impact', hop: 1 },
            { id: mob ? 'Panasonic' : 'Panasonic (supplier)', x: 0.52, y: 0.10, type: 'supplier', hop: 2 },
            { id: 'CATL Battery', x: 0.52, y: 0.42, type: 'supplier', hop: 2 },
            { id: mob ? 'SpaceX' : 'SpaceX contracts', x: 0.52, y: 0.72, type: 'related', hop: 2 },
            { id: mob ? 'Maersk' : 'Maersk Shipping', x: 0.73, y: 0.20, type: 'indirect', hop: 3, portfolio: true },
            { id: mob ? 'BHP' : 'BHP Lithium', x: 0.73, y: 0.52, type: 'indirect', hop: 3 },
            { id: 'Your: $SHIP', x: 0.88, y: 0.35, type: 'you', hop: 3, portfolio: true },
          ],
          edges: [[0,1],[0,2],[1,3],[1,4],[0,5],[3,6],[4,7],[6,8]],
          info: {
            title: 'Musk Exits Tesla \u2014 3-Hop Cascade',
            desc: 'A leadership change at Tesla ripples through the supply chain. Parts suppliers reduce orders, shipping volumes drop, and your logistics holding ($SHIP) takes an indirect hit you\'d never see coming.',
            path: ['Musk Exit', 'TSLA -18%', 'Panasonic orders \u2193', 'Maersk volume \u2193', 'Your: $SHIP']
          }
        },
        {
          title: 'China bans rare earth exports',
          nodes: [
            { id: mob ? 'China Ban' : 'China Rare Earth Ban', x: 0.12, y: 0.35, type: 'event', hop: 0 },
            { id: mob ? 'Prices \u2191' : 'Rare Earth Prices \u2191', x: 0.32, y: 0.15, type: 'direct', hop: 1 },
            { id: mob ? 'EV Costs \u2191' : 'EV Battery Costs \u2191', x: 0.32, y: 0.55, type: 'impact', hop: 1 },
            { id: mob ? 'TSLA \u2193' : 'TSLA margins \u2193', x: 0.52, y: 0.12, type: 'supplier', hop: 2, portfolio: true },
            { id: mob ? 'AAPL \u2193' : 'AAPL production \u2193', x: 0.52, y: 0.40, type: 'supplier', hop: 2, portfolio: true },
            { id: mob ? 'Defense \u2191' : 'Defense stocks \u2191', x: 0.52, y: 0.68, type: 'related', hop: 2 },
            { id: mob ? 'MP Mtls \u2191' : 'MP Materials \u2191', x: 0.74, y: 0.25, type: 'indirect', hop: 3 },
            { id: mob ? 'Your: NVDA' : 'Your: NVDA delays', x: 0.74, y: 0.55, type: 'you', hop: 3, portfolio: true },
            { id: mob ? 'Lynas \u2191' : 'Lynas Mining \u2191', x: 0.90, y: 0.40, type: 'indirect', hop: 3 },
          ],
          edges: [[0,1],[0,2],[1,3],[2,4],[1,5],[3,6],[4,7],[6,8]],
          info: {
            title: mob ? 'China Rare Earth Ban \u2014 Cascade' : 'China Bans Rare Earth Exports \u2014 Supply Chain Shock',
            desc: 'A geopolitical move in China cascades through EV batteries, smartphone production, and chip manufacturing. Your NVDA position faces production delays through TSMC\'s material shortages.',
            path: ['China Ban', 'Rare Earth \u2191', 'Battery Costs \u2191', 'TSMC delays', 'Your: NVDA']
          }
        },
        {
          title: 'Fed raises rates 50bps',
          nodes: [
            { id: 'Fed +50bps', x: 0.12, y: 0.35, type: 'event', hop: 0 },
            { id: mob ? 'Bonds \u2191' : 'Bond yields \u2191', x: 0.32, y: 0.15, type: 'direct', hop: 1 },
            { id: mob ? 'Growth \u2193' : 'Growth stocks \u2193', x: 0.32, y: 0.55, type: 'impact', hop: 1 },
            { id: mob ? 'NVDA P/E \u2193' : 'NVDA P/E compression', x: 0.52, y: 0.10, type: 'supplier', hop: 2, portfolio: true },
            { id: mob ? 'Housing \u2193' : 'Housing starts \u2193', x: 0.52, y: 0.40, type: 'related', hop: 2 },
            { id: mob ? 'USD \u2191' : 'USD strengthens', x: 0.52, y: 0.68, type: 'related', hop: 2 },
            { id: mob ? 'AMZN \u2193' : 'AMZN cloud spend \u2193', x: 0.74, y: 0.22, type: 'indirect', hop: 3, portfolio: true },
            { id: mob ? 'EM FX \u2193' : 'EM currencies \u2193', x: 0.74, y: 0.55, type: 'indirect', hop: 3 },
            { id: mob ? 'Your: AAPL' : 'Your: AAPL intl rev \u2193', x: 0.90, y: 0.38, type: 'you', hop: 3, portfolio: true },
          ],
          edges: [[0,1],[0,2],[2,3],[1,4],[1,5],[3,6],[5,7],[7,8]],
          info: {
            title: mob ? 'Fed Rate Hike \u2014 Macro Ripple' : 'Fed Raises Rates \u2014 Macro Ripple Effect',
            desc: 'A rate hike compresses growth stock valuations, strengthens the dollar, and reduces international revenue for your AAPL position \u2014 a connection most retail investors completely miss.',
            path: ['Fed +50bps', 'USD \u2191', 'EM currencies \u2193', 'Int\'l revenue \u2193', 'Your: AAPL']
          }
        }
      ]

      let currentScenario = 0
      let activeNode = -1
      let rippleWaves: Array<{ x: number; y: number; r: number; maxR: number; alpha: number; hop: number }> = []
      let revealedHops = new Set([0])

      const buildLabels = () => {
        rippleLabelsEl!.innerHTML = ''
        const nodes = scenarios[currentScenario].nodes
        nodes.forEach((node, i) => {
          const label = document.createElement('div')
          label.className = `ripple-node-label ${node.type === 'you' || node.portfolio ? 'portfolio' : ''} ${node.type === 'event' ? 'event-cue' : ''}`
          label.textContent = node.id
          label.style.left = (node.x * rw) + 'px'
          label.style.top = (node.y * rh) + 'px'
          label.style.opacity = node.hop === 0 ? '1' : '0'
          label.style.transform = `translate(-50%, -50%) scale(${node.hop === 0 ? 1 : 0.8})`
          label.dataset.index = String(i)
          label.addEventListener('click', () => triggerRipple(i))
          rippleLabelsEl!.appendChild(label)
        })
      }

      const rpBefore = document.getElementById('rp-before')
      const rpAfter = document.getElementById('rp-after')
      const rpArrow = document.querySelector('.landing-page .ripple-perspective-arrow')

      const triggerRipple = (nodeIdx: number) => {
        const scenario = scenarios[currentScenario]
        const node = scenario.nodes[nodeIdx]
        activeNode = nodeIdx

        // Remove pulse cue once user has clicked
        rippleLabelsEl!.querySelectorAll('.event-cue').forEach(el => el.classList.remove('event-cue'))

        rippleWaves.push({
          x: node.x * rw,
          y: node.y * rh,
          r: 0,
          maxR: Math.max(rw, rh),
          alpha: 0.4,
          hop: node.hop
        })

        const maxHop = Math.max(...scenario.nodes.map(n => n.hop))
        let delay = 0
        for (let h = 0; h <= maxHop; h++) {
          const hopVal = h
          setTimeout(() => {
            revealedHops.add(hopVal)
            updateLabelVisibility()
            // Transition perspective labels when cascade expands
            if (hopVal >= 1 && rpBefore && rpAfter && rpArrow) {
              rpBefore.classList.remove('active')
              rpAfter.classList.add('active')
              rpArrow.classList.add('active')
            }
          }, delay)
          delay += 400
        }

        const info = scenario.info
        rippleInfo!.innerHTML = `
          <span class="ripple-info-tag">RIPPLE ANALYSIS \u2014 ${node.hop + 1}-HOP CASCADE</span>
          <div class="ripple-info-title">${info.title}</div>
          <div class="ripple-info-desc">${info.desc}</div>
          <div class="ripple-info-path">
            ${info.path.map((p, i) =>
              `<span class="rip-path-node ${i === 0 ? 'origin' : ''} ${i === info.path.length - 1 ? 'yours' : ''}">${p}</span>` +
              (i < info.path.length - 1 ? '<span class="rip-path-arrow">&rarr;</span>' : '')
            ).join('')}
          </div>
        `

        const labels = rippleLabelsEl!.children
        for (let i = 0; i < labels.length; i++) {
          if (i === nodeIdx) labels[i].classList.add('active')
          else labels[i].classList.remove('active')
        }
      }

      const updateLabelVisibility = () => {
        const scenario = scenarios[currentScenario]
        const labels = rippleLabelsEl!.children
        for (let i = 0; i < labels.length; i++) {
          const node = scenario.nodes[i]
          if (revealedHops.has(node.hop)) {
            const el = labels[i] as HTMLElement
            el.style.opacity = '1'
            el.style.transform = 'translate(-50%, -50%) scale(1)'
            if (node.type === 'you' || node.portfolio) {
              el.classList.add('affected')
            }
          }
        }
      }

      const switchScenario = (idx: number) => {
        currentScenario = idx
        activeNode = -1
        revealedHops = new Set([0])
        rippleWaves = []
        buildLabels()
        rippleInfo!.innerHTML = '<span class="ripple-info-tag">Click a node to explore the cascade</span>'

        // Reset perspective labels
        if (rpBefore && rpAfter && rpArrow) {
          rpBefore.classList.add('active')
          rpAfter.classList.remove('active')
          rpArrow.classList.remove('active')
        }

        document.querySelectorAll('.landing-page .ripple-btn').forEach((btn, i) => {
          btn.classList.toggle('active', i === idx)
        })
      }

      document.querySelectorAll('.landing-page .ripple-btn').forEach(btn => {
        const handler = () => switchScenario(parseInt((btn as HTMLElement).dataset.scenario || '0'))
        btn.addEventListener('click', handler)
        cleanups.push(() => btn.removeEventListener('click', handler))
      })

      let rippleRunning = false
      const rippleObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          rippleRunning = entry.isIntersecting
          if (rippleRunning) { resizeRipple(); buildLabels(); drawRipple() }
        })
      }, { threshold: 0.2 })
      rippleObserver.observe(rippleCanvas)
      observers.push(rippleObserver)

      const drawRipple = () => {
        if (!rippleRunning) return
        rctx.clearRect(0, 0, rw, rh)

        const scenario = scenarios[currentScenario]
        const nodes = scenario.nodes
        const edges = scenario.edges

        edges.forEach(([a, b]) => {
          if (!revealedHops.has(nodes[a].hop) || !revealedHops.has(nodes[b].hop)) return
          const ax = nodes[a].x * rw, ay = nodes[a].y * rh
          const bx = nodes[b].x * rw, by = nodes[b].y * rh

          rctx.beginPath()
          rctx.moveTo(ax, ay)
          rctx.lineTo(bx, by)
          const isActive = (a === activeNode || b === activeNode)
          rctx.strokeStyle = isActive ? 'rgba(212, 175, 55, 0.4)' : 'rgba(212, 175, 55, 0.1)'
          rctx.lineWidth = isActive ? 1.5 : 0.8
          rctx.stroke()

          if (revealedHops.size > 1) {
            const t = ((Date.now() + a * 300) % 2000) / 2000
            const px = ax + (bx - ax) * t
            const py = ay + (by - ay) * t
            rctx.beginPath()
            rctx.arc(px, py, 1.5, 0, Math.PI * 2)
            rctx.fillStyle = `rgba(212, 175, 55, ${0.5 * (1 - t)})`
            rctx.fill()
          }
        })

        nodes.forEach((node, i) => {
          if (!revealedHops.has(node.hop)) return
          const x = node.x * rw
          const y = node.y * rh
          const size = node.type === 'event' ? 10 : node.type === 'you' ? 9 : 6

          if (node.type === 'event' || node.type === 'you') {
            rctx.beginPath()
            rctx.arc(x, y, size + 12, 0, Math.PI * 2)
            rctx.fillStyle = `rgba(212, 175, 55, ${0.06 + Math.sin(Date.now() * 0.003) * 0.03})`
            rctx.fill()
          }

          rctx.beginPath()
          rctx.arc(x, y, size, 0, Math.PI * 2)
          const alpha = node.type === 'event' ? 0.9 : node.type === 'you' ? 0.8 : node.portfolio ? 0.5 : 0.3
          rctx.fillStyle = `rgba(212, 175, 55, ${alpha})`
          rctx.fill()
        })

        rippleWaves = rippleWaves.filter(w => w.alpha > 0.01)
        rippleWaves.forEach(wave => {
          wave.r += 3
          wave.alpha *= 0.98
          rctx.beginPath()
          rctx.arc(wave.x, wave.y, wave.r, 0, Math.PI * 2)
          rctx.strokeStyle = `rgba(212, 175, 55, ${wave.alpha})`
          rctx.lineWidth = 1
          rctx.stroke()
        })

        const labels = rippleLabelsEl!.children
        for (let i = 0; i < labels.length && i < nodes.length; i++) {
          const el = labels[i] as HTMLElement
          el.style.left = (nodes[i].x * rw) + 'px'
          el.style.top = (nodes[i].y * rh) + 'px'
        }

        rafIds.push(requestAnimationFrame(drawRipple))
      }
    }

    // ============================================
    // 7. COUNTER ANIMATION
    // ============================================
    document.querySelectorAll('.landing-page [data-count]').forEach(el => {
      const htmlEl = el as HTMLElement
      const cObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = parseFloat(htmlEl.dataset.count || '0')
            const duration = 2000
            const start = performance.now()
            const update = (now: number) => {
              const elapsed = now - start
              const progress = Math.min(elapsed / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              const current = target * eased
              if (target >= 100) htmlEl.textContent = Math.floor(current).toLocaleString()
              else if (target >= 10) htmlEl.textContent = String(Math.floor(current))
              else htmlEl.textContent = current.toFixed(target % 1 !== 0 ? 2 : 0)
              if (progress < 1) rafIds.push(requestAnimationFrame(update))
            }
            rafIds.push(requestAnimationFrame(update))
            cObserver.unobserve(el)
          }
        })
      }, { threshold: 0.5 })
      cObserver.observe(el)
      observers.push(cObserver)
    })

    // ============================================
    // 8. DAILY BRIEF INSIGHT ANIMATION
    // ============================================
    const insightEl = document.getElementById('mockup-insight-1')
    if (insightEl) {
      const insightObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            insightEl.style.borderLeft = '3px solid var(--amber)'
            insightEl.style.background = 'rgba(212,175,55,0.03)'
            insightObserver.unobserve(entry.target)
          }
        })
      }, { threshold: 0.5 })
      insightObserver.observe(insightEl)
      observers.push(insightObserver)
    }

    // ============================================
    // 9. SMOOTH ANCHORS
    // ============================================
    document.querySelectorAll('.landing-page a[href^="#"]').forEach(a => {
      const handler = (e: Event) => {
        const href = a.getAttribute('href')
        if (href && href !== '#') {
          const target = document.querySelector(href)
          if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }) }
        }
      }
      a.addEventListener('click', handler)
      cleanups.push(() => a.removeEventListener('click', handler))
    })

    // ============================================
    // 10. INITIAL REVEAL (visible elements on load)
    // ============================================
    document.querySelectorAll('.landing-page [data-reveal]').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        const delay = parseInt((el as HTMLElement).dataset.delay || '0')
        setTimeout(() => el.classList.add('revealed'), delay)
      }
    })

    // ============================================
    // CLEANUP
    // ============================================
    return () => {
      rafIds.forEach(id => cancelAnimationFrame(id))
      observers.forEach(obs => obs.disconnect())
      cleanups.forEach(fn => fn())
      // Remove dynamically created DOM elements to prevent duplicates on re-mount
      if (heroLabelsDiv) heroLabelsDiv.innerHTML = ''
      if (rippleLabelsEl) rippleLabelsEl.innerHTML = ''
      // Reset reveal animations so they can re-trigger on re-mount
      document.querySelectorAll('.landing-page .revealed').forEach(el => el.classList.remove('revealed'))
    }
  }, [])

  return null
}
