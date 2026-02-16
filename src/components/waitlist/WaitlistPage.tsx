import './waitlist.css'
import { WaitlistForm } from './WaitlistForm'

export function WaitlistPage() {
  return (
    <div className="waitlist-page">
      {/* Grain */}
      <div className="grain" />

      {/* Cursor */}
      <div className="cursor-dot" id="cursor-dot" />
      <div className="cursor-ring" id="cursor-ring" />

      {/* Background Graph */}
      <canvas id="bg-graph" />

      {/* NAV */}
      <nav className="wl-nav" id="nav">
        <div className="wl-nav-inner">
          <a href="/" className="wl-nav-logo">
            <img src="/logo.jpeg" alt="" width={28} height={28} style={{ borderRadius: '50%' }} />
            <span>hivemind</span>
          </a>
          <a href="/" className="wl-nav-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            <span>Back to Home</span>
          </a>
        </div>
      </nav>

      {/* MAIN */}
      <main className="waitlist-main">

        {/* LEFT — Pitch */}
        <div className="wl-pitch" data-reveal="">
          <div className="wl-badge">
            <span className="wl-badge-dot" />
            Pre-Launch — Limited Spots
          </div>

          <h1 className="wl-title">
            <span className="wl-line">The connections</span>
            <span className="wl-line">Wall Street sees.</span>
            <span className="wl-line"><em className="wl-em">Now in your inbox.</em></span>
          </h1>

          <p className="wl-desc">Hivemind maps the hidden relationships between your holdings and the world&apos;s financial events. One daily brief. Every connection that matters.</p>

          <div className="wl-perks">
            <div className="wl-perk">
              <div className="wl-perk-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              </div>
              <div>
                <strong>Early Bird Pricing</strong>
                <span>Lock in 40% off Pro — forever</span>
              </div>
            </div>
            <div className="wl-perk">
              <div className="wl-perk-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              </div>
              <div>
                <strong>First Access</strong>
                <span>Be the first to try every feature</span>
              </div>
            </div>
            <div className="wl-perk">
              <div className="wl-perk-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              </div>
              <div>
                <strong>Founding Member Status</strong>
                <span>Shape the product roadmap</span>
              </div>
            </div>
          </div>

          <div className="wl-proof">
            <span className="wl-proof-text"><span className="wl-count" id="wl-count">0</span> investors on the waitlist</span>
          </div>
        </div>

        {/* RIGHT — Form */}
        <WaitlistForm />
      </main>

      {/* FOOTER */}
      <footer className="wl-footer">
        <span>&copy; 2026 Hivemind. Not investment advice.</span>
        <div className="wl-footer-links">
          <a href="/">Home</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </footer>
    </div>
  )
}
