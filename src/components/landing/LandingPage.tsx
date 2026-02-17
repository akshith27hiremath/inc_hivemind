import './landing.css'
import { LandingScripts } from './LandingScripts'

export function LandingPage() {
  return (
    <div className="landing-page">
      {/* Grain */}
      <div className="grain" />

      {/* Cursor */}
      <div className="cursor-dot" id="cursor-dot" />

      {/* Background Graph */}
      <canvas id="bg-graph"></canvas>

      {/* ============== NAV ============== */}
      <nav className="nav" id="nav">
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <img src="/logo.jpeg" alt="" width={28} height={28} style={{ borderRadius: '50%' }} />
            <span>hivemind</span>
          </a>
          <div className="nav-links">
            <a href="#how-it-works">How It Works</a>
            <a href="#ripple">The Ripple Effect</a>
            <a href="#daily-brief">Daily Brief</a>
          </div>
          <div className="nav-right">
            <a href="/waitlist" className="btn btn-primary btn-nav">Join Waitlist</a>
          </div>
          <button className="nav-hamburger" id="nav-hamburger" aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="mobile-menu" id="mobile-menu">
        <a href="#how-it-works" className="mobile-menu-link">How It Works</a>
        <a href="#ripple" className="mobile-menu-link">The Ripple Effect</a>
        <a href="#daily-brief" className="mobile-menu-link">Daily Brief</a>
        <a href="/waitlist" className="btn btn-primary">Join Waitlist</a>
      </div>

      {/* ============== HERO ============== */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <div className="hero-badge" data-reveal="">
            <span className="badge-dot" />
            Now in Early Access
          </div>

          <h1 className="hero-title" data-reveal="" data-delay="100">
            <span className="hero-line">Your portfolio is</span>
            <span className="hero-line">connected to <em className="hero-em">everything.</em></span>
            <span className="hero-line">We show you <span className="hero-highlight">how.</span></span>
          </h1>

          <p className="hero-sub" data-reveal="" data-delay="200">
            Hivemind maps the hidden relationships between your holdings and
            the world&apos;s financial events. One daily brief. Every connection
            that matters. Nothing that doesn&apos;t.
          </p>

          <div className="hero-actions" data-reveal="" data-delay="300">
            <a href="/waitlist" className="btn btn-primary btn-large">
              <span>Join the Waitlist</span>
            </a>
            <a href="#ripple" className="btn btn-ghost btn-large">
              <span>See it in action</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </a>
          </div>

          <div className="hero-proof" data-reveal="" data-delay="400">
            <span className="hero-proof-text">Join investors already on the waitlist</span>
          </div>
        </div>

        {/* Hero Interactive Graph */}
        <div className="hero-graph-container" data-reveal="" data-delay="300">
          <canvas id="hero-graph" className="hero-graph-canvas"></canvas>
          <div className="hero-graph-labels" id="hero-graph-labels"></div>
        </div>

        <div className="scroll-cue">
          <span>Scroll to explore</span>
          <div className="scroll-cue-line"><div className="scroll-cue-dot" /></div>
        </div>
      </section>

      {/* ============== PAIN SECTION ============== */}
      <section className="pain-section">
        <div className="landing-container">
          <div className="pain-grid">
            <div className="pain-left" data-reveal="">
              <span className="section-tag">The Problem</span>
              <h2 className="pain-title">You&apos;re managing a portfolio<br />with a <em>newspaper</em> and a <em>prayer.</em></h2>
            </div>
            <div className="pain-right">
              <div className="pain-card" data-reveal="" data-delay="100">
                <div className="pain-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </div>
                <h3>200+ hours/year</h3>
                <p>The average engaged investor spends scanning news, cross-referencing sources, and trying to connect dots manually.</p>
              </div>
              <div className="pain-card" data-reveal="" data-delay="200">
                <div className="pain-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h3>Blindsided by connections</h3>
                <p>A regulatory change in China affects your semiconductor stock through three layers of supply chain. You&apos;d never catch it in time.</p>
              </div>
              <div className="pain-card" data-reveal="" data-delay="300">
                <div className="pain-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h3>$24,000/yr for Bloomberg</h3>
                <p>Institutional-grade intelligence exists — but it&apos;s priced for hedge funds, not individual investors managing their own money.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== MARQUEE ============== */}
      <section className="marquee-section">
        <div className="marquee-track">
          <div className="marquee-slide">
            <span>SEC FILINGS</span><span className="m-dot">&#x2022;</span>
            <span>EARNINGS REPORTS</span><span className="m-dot">&#x2022;</span>
            <span>SUPPLY CHAIN DATA</span><span className="m-dot">&#x2022;</span>
            <span>MACRO INDICATORS</span><span className="m-dot">&#x2022;</span>
            <span>EXECUTIVE CHANGES</span><span className="m-dot">&#x2022;</span>
            <span>REGULATORY FILINGS</span><span className="m-dot">&#x2022;</span>
            <span>INDUSTRY REPORTS</span><span className="m-dot">&#x2022;</span>
            <span>NEWS WIRE</span><span className="m-dot">&#x2022;</span>
            <span>SEC FILINGS</span><span className="m-dot">&#x2022;</span>
            <span>EARNINGS REPORTS</span><span className="m-dot">&#x2022;</span>
            <span>SUPPLY CHAIN DATA</span><span className="m-dot">&#x2022;</span>
            <span>MACRO INDICATORS</span><span className="m-dot">&#x2022;</span>
            <span>EXECUTIVE CHANGES</span><span className="m-dot">&#x2022;</span>
            <span>REGULATORY FILINGS</span><span className="m-dot">&#x2022;</span>
            <span>INDUSTRY REPORTS</span><span className="m-dot">&#x2022;</span>
            <span>NEWS WIRE</span><span className="m-dot">&#x2022;</span>
          </div>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="how-it-works" id="how-it-works">
        <div className="landing-container">
          <div className="section-header" data-reveal="">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">From noise to signal<br />in three steps.</h2>
          </div>

          <div className="steps-row">
            <div className="step-card" data-reveal="">
              <div className="step-num">01</div>
              <div className="step-visual">
                <div className="connect-demo" id="connect-demo">
                  <div className="connect-slot"><span className="slot-icon">+</span><span>AAPL</span></div>
                  <div className="connect-slot filled"><span className="slot-check">&#10003;</span><span>TSLA</span></div>
                  <div className="connect-slot filled"><span className="slot-check">&#10003;</span><span>NVDA</span></div>
                  <div className="connect-slot"><span className="slot-icon">+</span><span>Add stock</span></div>
                </div>
              </div>
              <h3>Connect your portfolio</h3>
              <p>Add your holdings manually or sync your brokerage. Hivemind maps every stock against our knowledge graph.</p>
            </div>

            <div className="step-card" data-reveal="" data-delay="150">
              <div className="step-num">02</div>
              <div className="step-visual">
                <div className="scan-demo">
                  <div className="scan-line" id="scan-line" />
                  <div className="scan-source">Reuters <span className="scan-check">&#10003;</span></div>
                  <div className="scan-source">SEC EDGAR <span className="scan-check">&#10003;</span></div>
                  <div className="scan-source active">Industry Reports <span className="scan-spinner" /></div>
                  <div className="scan-source dim">Earnings Calls</div>
                  <div className="scan-source dim">Macro Data</div>
                  <div className="scan-count" id="scan-count">2,847 sources scanned</div>
                </div>
              </div>
              <h3>We scan everything</h3>
              <p>Thousands of sources — news, filings, earnings, reports — processed daily through our knowledge graph for relevance.</p>
            </div>

            <div className="step-card" data-reveal="" data-delay="300">
              <div className="step-num">03</div>
              <div className="step-visual">
                <div className="brief-demo">
                  <div className="brief-header">
                    <span className="brief-date">Today&apos;s Brief</span>
                    <span className="brief-count">4 insights</span>
                  </div>
                  <div className="brief-item high">
                    <span className="brief-dot" />
                    <span>NVDA supply chain disruption via TSMC</span>
                  </div>
                  <div className="brief-item medium">
                    <span className="brief-dot" />
                    <span>New EU AI regulation affects 3 holdings</span>
                  </div>
                  <div className="brief-item low">
                    <span className="brief-dot" />
                    <span>TSLA earnings beat — supplier impact</span>
                  </div>
                </div>
              </div>
              <h3>One daily brief</h3>
              <p>Every morning, you get one digestible overview. What matters, why it matters, and how it connects to your money.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== RIPPLE EFFECT ============== */}
      <section className="ripple-section" id="ripple">
        <div className="landing-container">
          <div className="section-header" data-reveal="">
            <span className="section-tag">The Ripple Effect</span>
            <h2 className="section-title">The connection your<br />analyst would catch.<br /><em>Now you can too.</em></h2>
            <p className="section-sub">Tap any event node to see how one headline creates cascading effects across your portfolio.</p>
          </div>

          <div className="ripple-perspective" id="ripple-perspective">
            <span className="ripple-perspective-tag active" id="rp-before">What you see</span>
            <svg className="ripple-perspective-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="ripple-perspective-tag" id="rp-after">What Hivemind shows you</span>
          </div>

          <div className="ripple-stage" data-reveal="">
            <div className="ripple-graph-area">
              <canvas id="ripple-canvas" className="ripple-canvas"></canvas>
              <div id="ripple-labels" className="ripple-labels"></div>
            </div>
            <div id="ripple-info" className="ripple-info">
              <div className="ripple-info-inner" id="ripple-info-inner">
                <span className="ripple-info-tag">Click a node to explore</span>
              </div>
            </div>
          </div>

          <div className="ripple-examples" data-reveal="">
            <button className="ripple-btn active" data-scenario="0">Musk leaves Tesla</button>
            <button className="ripple-btn" data-scenario="1">China bans rare earths</button>
            <button className="ripple-btn" data-scenario="2">Fed raises rates</button>
          </div>
        </div>
      </section>

      {/* ============== DAILY BRIEF PREVIEW ============== */}
      <section className="brief-section" id="daily-brief">
        <div className="landing-container">
          <div className="brief-layout">
            <div className="brief-text" data-reveal="">
              <span className="section-tag">The Daily Brief</span>
              <h2 className="section-title">Your morning<br />just got<br /><em>45 minutes shorter.</em></h2>
              <p className="brief-desc">No more scanning Reuters, CNBC, Seeking Alpha, Twitter, and SEC filings. Hivemind distills thousands of data points into one clear, personalized overview every morning before you open your trading app.</p>
              <div className="brief-stats">
                <div className="brief-stat">
                  <span className="brief-stat-num" data-count="4247">0</span>
                  <span className="brief-stat-label">Sources scanned daily</span>
                </div>
                <div className="brief-stat">
                  <span className="brief-stat-num" data-count="3">0</span>
                  <span className="brief-stat-label">Minutes to read</span>
                </div>
              </div>
            </div>

            <div className="brief-preview" data-reveal="" data-delay="200">
              <div className="brief-mockup">
                <div className="mockup-header">
                  <div className="mockup-top">
                    <span className="mockup-day">Monday, Feb 13</span>
                    <span className="mockup-portfolio">Your Portfolio Brief</span>
                  </div>
                  <div className="mockup-summary">
                    <div className="summary-badge summary-high">2 High Impact</div>
                    <div className="summary-badge summary-med">1 Medium</div>
                    <div className="summary-badge summary-low">3 Low</div>
                  </div>
                </div>

                <div className="mockup-insight" id="mockup-insight-1">
                  <div className="insight-header">
                    <span className="insight-impact high">HIGH IMPACT</span>
                    <span className="insight-stocks">NVDA, AMD, TSM</span>
                  </div>
                  <h4>TSMC reports capacity constraints — GPU shortage likely through Q3</h4>
                  <p>TSMC&apos;s latest filing reveals fab utilization at 98%. This directly constrains NVIDIA&apos;s H100 production timeline and creates pricing pressure across your semiconductor holdings.</p>
                  <div className="insight-path">
                    <span className="path-node">TSMC Filing</span>
                    <span className="path-arrow">&rarr;</span>
                    <span className="path-node">GPU Supply</span>
                    <span className="path-arrow">&rarr;</span>
                    <span className="path-node path-yours">Your: NVDA</span>
                  </div>
                </div>

                <div className="mockup-insight">
                  <div className="insight-header">
                    <span className="insight-impact medium">MEDIUM</span>
                    <span className="insight-stocks">AMZN, SHOP</span>
                  </div>
                  <h4>EU Digital Markets Act enforcement begins — e-commerce impact</h4>
                  <p>New compliance requirements may affect marketplace operations for your retail holdings across European markets.</p>
                  <div className="insight-path">
                    <span className="path-node">EU Regulation</span>
                    <span className="path-arrow">&rarr;</span>
                    <span className="path-node">E-Commerce</span>
                    <span className="path-arrow">&rarr;</span>
                    <span className="path-node path-yours">Your: AMZN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== SOCIAL PROOF ============== */}
      <section className="proof-section">
        <div className="landing-container">
          <div className="section-header" data-reveal="">
            <span className="section-tag">What Investors Say</span>
            <h2 className="section-title">Real investors.<br /><em>Real edge.</em></h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial" data-reveal="">
              <p>&ldquo;I was spending 45 minutes every morning just reading headlines. Now I get one brief that tells me exactly what I need to know about my 12 holdings. The ripple connections alone are worth the subscription.&rdquo;</p>
              <div className="testimonial-author">
                <div className="avatar" style={{ '--hue': '210' } as React.CSSProperties}>JK</div>
                <div><strong>Jake K.</strong><span>Retail investor, 14 stocks</span></div>
              </div>
            </div>
            <div className="testimonial" data-reveal="" data-delay="100">
              <p>&ldquo;Hivemind caught that the CHIPS Act would affect my logistics holdings before anyone on FinTwit was talking about it. That&apos;s 2nd-order thinking that I genuinely cannot do at scale on my own.&rdquo;</p>
              <div className="testimonial-author">
                <div className="avatar" style={{ '--hue': '30' } as React.CSSProperties}>SR</div>
                <div><strong>Sarah R.</strong><span>Software engineer, 8 stocks</span></div>
              </div>
            </div>
            <div className="testimonial" data-reveal="" data-delay="200">
              <p>&ldquo;I&apos;ve tried Seeking Alpha, Finviz, stock screeners — nothing connects the dots the way Hivemind does. It&apos;s not more data, it&apos;s better data. Specifically about MY portfolio.&rdquo;</p>
              <div className="testimonial-author">
                <div className="avatar" style={{ '--hue': '150' } as React.CSSProperties}>DM</div>
                <div><strong>David M.</strong><span>Portfolio: $180K across 11 stocks</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section className="cta-section">
        <div className="landing-container">
          <div className="cta-box" data-reveal="">
            <div className="cta-graph-bg" id="cta-graph-bg" />
            <h2>Institutions have teams of analysts<br />connecting these dots.</h2>
            <p className="cta-sub"><em>You have Hivemind.</em></p>
            <a href="/waitlist" className="btn btn-primary btn-large">Join the Waitlist</a>
            <p className="cta-note">Be first in line when we launch.</p>
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="footer">
        <div className="landing-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <span className="nav-logo">
                <img src="/logo.jpeg" alt="" width={24} height={24} style={{ borderRadius: '50%' }} />
                <span>hivemind</span>
              </span>
              <p>Portfolio intelligence for the individual investor. See the connections Wall Street sees.</p>
            </div>
            <div className="footer-col"><h4>Product</h4><a href="#">Features</a><a href="#">Changelog</a><a href="#">Roadmap</a></div>
            <div className="footer-col"><h4>Resources</h4><a href="#">How It Works</a><a href="#">Blog</a><a href="#">Case Studies</a><a href="#">FAQ</a></div>
            <div className="footer-col"><h4>Legal</h4><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Disclaimers</a><a href="#">Security</a></div>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2026 Hivemind. Not investment advice.</span>
            <div className="footer-socials">
              <a href="#">Twitter/X</a>
              <a href="#">LinkedIn</a>
              <a href="#">Reddit</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Client-side scripts */}
      <LandingScripts />
    </div>
  )
}
