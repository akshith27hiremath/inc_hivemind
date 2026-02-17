// ============================================
// HIVEMIND — Waitlist Page
// Email collection, localStorage mailing list,
// Web3Forms confirmation email, particle
// background, reveal animations
// ============================================

(function () {
    'use strict';

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const lerp = (a, b, t) => a + (b - a) * t;

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;

    // ============================================
    // 1. CURSOR
    // ============================================
    const cursorDot = document.getElementById('cursor-dot');

    if (!isMobile && cursorDot) {
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });
    }

    // ============================================
    // 2. REVEAL ANIMATIONS
    // ============================================
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || 0);
                setTimeout(() => entry.target.classList.add('revealed'), delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

    // ============================================
    // 3. BACKGROUND PARTICLE GRAPH
    // ============================================
    const bgCanvas = document.getElementById('bg-graph');
    if (bgCanvas) {
        const ctx = bgCanvas.getContext('2d');
        let particles = [];
        const COUNT = isMobile ? 30 : 70;

        function resizeBg() {
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;
        }
        resizeBg();
        window.addEventListener('resize', resizeBg);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * bgCanvas.width;
                this.y = Math.random() * bgCanvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.2;
                this.vy = (Math.random() - 0.5) * 0.2;
                this.alpha = Math.random() * 0.3 + 0.05;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > bgCanvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > bgCanvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < COUNT; i++) particles.push(new Particle());

        function drawBg() {
            ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(212, 175, 55, ${(1 - dist / 130) * 0.06})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(drawBg);
        }
        drawBg();
    }

    // ============================================
    // 4. WEB3FORMS — Confirmation Email
    // ============================================
    // SETUP: Go to https://web3forms.com, enter your email,
    // and paste the access key you receive below.
    // Free tier: 250 emails/month. No backend needed.
    //
    // FUTURE: Swap to EmailJS when you need emails
    // sent from your own @hivemind domain.
    //
    const WEB3FORMS_KEY = 'f356ced9-b403-4cd9-9a95-ad62ae6f5e09';

    function sendConfirmationEmail(email, position) {
        var statusEl = document.getElementById('wl-email-status');
        if (!statusEl) return;

        // If key not configured, show honest status
        if (WEB3FORMS_KEY === 'YOUR_ACCESS_KEY_HERE') {
            setTimeout(function () {
                statusEl.innerHTML = '<span class="wl-email-sent">' +
                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10" stroke-width="1.5"/></svg>' +
                    ' You\'re confirmed! We\'ll email you at launch.' +
                    '</span>';
            }, 1200);
            return;
        }

        // Real Web3Forms email send
        var formData = new FormData();
        formData.append('access_key', WEB3FORMS_KEY);
        formData.append('subject', 'You\'re on the Hivemind waitlist! (Position #' + position + ')');
        formData.append('from_name', 'Hivemind');
        formData.append('to', email);
        formData.append('message',
            'Hey there!\n\n' +
            'You\'re officially on the Hivemind waitlist.\n\n' +
            'Your position: #' + position + '\n' +
            'Your perk: 40% off Pro — locked in forever.\n\n' +
            'Hivemind maps the hidden relationships between your holdings and the world\'s financial events. ' +
            'One daily brief. Every connection that matters.\n\n' +
            'We\'ll email you with updates as we get closer to launch.\n\n' +
            '— The Hivemind Team\n' +
            'hivemind.app'
        );

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.success) {
                statusEl.innerHTML = '<span class="wl-email-sent">' +
                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10" stroke-width="1.5"/></svg>' +
                    ' Confirmation email sent to <strong>' + email + '</strong>' +
                    '</span>';
            } else {
                statusEl.innerHTML = '<span class="wl-email-failed">' +
                    'Could not send confirmation — we\'ll still email you at launch.' +
                    '</span>';
            }
        })
        .catch(function () {
            statusEl.innerHTML = '<span class="wl-email-failed">' +
                'Could not send confirmation — we\'ll still email you at launch.' +
                '</span>';
        });
    }

    // ============================================
    // 5. WAITLIST COUNT — Real numbers only
    // ============================================
    const wlCountEl = document.getElementById('wl-count');
    const existingEmails = JSON.parse(localStorage.getItem('hivemind_waitlist') || '[]');
    let currentTotal = existingEmails.length;

    // Animate count on load (starts from 0, counts up to actual)
    function animateCount(target, el) {
        if (target === 0) {
            el.textContent = '0';
            return;
        }
        const duration = 1200;
        const start = performance.now();
        function countTick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * eased);
            el.textContent = current.toLocaleString();
            if (progress < 1) requestAnimationFrame(countTick);
        }
        requestAnimationFrame(countTick);
    }

    if (wlCountEl) {
        animateCount(currentTotal, wlCountEl);
    }

    // ============================================
    // 6. WAITLIST FORM — Email Collection
    // ============================================
    const form = document.getElementById('waitlist-form');
    const emailInput = document.getElementById('wl-email');
    const submitBtn = document.getElementById('wl-submit');
    const errorEl = document.getElementById('wl-error');
    const formCard = document.getElementById('wl-form-card');
    const successEl = document.getElementById('wl-success');
    const posNumEl = document.getElementById('wl-pos-num');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = emailInput.value.trim();
            errorEl.textContent = '';

            // Validate email
            if (!email) {
                errorEl.textContent = 'Email is required.';
                emailInput.focus();
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errorEl.textContent = 'Please enter a valid email address.';
                emailInput.focus();
                return;
            }

            // Check for duplicates
            const waitlist = JSON.parse(localStorage.getItem('hivemind_waitlist') || '[]');
            if (waitlist.find(function (entry) { return entry.email === email; })) {
                errorEl.textContent = 'This email is already on the waitlist!';
                return;
            }

            // Show loading state
            submitBtn.classList.add('loading');

            // Simulate server delay, then save
            setTimeout(function () {
                // Position = next number (1-indexed)
                var newPosition = waitlist.length + 1;

                // Save to localStorage mailing list
                waitlist.push({
                    email: email,
                    joinedAt: new Date().toISOString(),
                    source: 'waitlist',
                    earlyBird: true,
                    position: newPosition
                });
                localStorage.setItem('hivemind_waitlist', JSON.stringify(waitlist));

                submitBtn.classList.remove('loading');

                // Update position display
                if (posNumEl) {
                    posNumEl.textContent = '#' + newPosition;
                }

                // Update the count on the left side
                currentTotal = waitlist.length;
                if (wlCountEl) {
                    wlCountEl.textContent = currentTotal.toLocaleString();
                }

                // Transition to success state
                formCard.style.opacity = '0';
                formCard.style.transform = 'scale(0.96)';
                formCard.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

                setTimeout(function () {
                    formCard.style.display = 'none';
                    successEl.classList.add('visible');

                    // Send confirmation email after success is visible
                    sendConfirmationEmail(email, newPosition);
                }, 350);

            }, 1400);
        });
    }

    // ============================================
    // 7. SHARE BUTTONS
    // ============================================
    document.querySelectorAll('.wl-share-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var shareType = btn.dataset.share;

            if (shareType === 'twitter') {
                var text = encodeURIComponent('Just joined the @hivemind_app waitlist \u2014 portfolio intelligence that shows you the hidden connections Wall Street sees. Early bird discount locked in. \ud83d\udc1d\n\nGet on the list:');
                var url = encodeURIComponent(window.location.href);
                window.open('https://twitter.com/intent/tweet?text=' + text + '&url=' + url, '_blank', 'width=550,height=420');
            }

            if (shareType === 'copy') {
                navigator.clipboard.writeText(window.location.href).then(function () {
                    btn.textContent = 'Copied!';
                    btn.style.color = 'var(--green)';
                    btn.style.borderColor = 'var(--green)';
                    setTimeout(function () {
                        btn.textContent = 'Copy Link';
                        btn.style.color = '';
                        btn.style.borderColor = '';
                    }, 2000);
                });
            }
        });
    });

    // ============================================
    // 8. PAGE LOAD FADE-IN
    // ============================================
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    window.addEventListener('load', function () {
        document.body.style.opacity = '1';
        document.querySelectorAll('[data-reveal]').forEach(function (el) {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                var delay = parseInt(el.dataset.delay || 0);
                setTimeout(function () { el.classList.add('revealed'); }, delay);
            }
        });
    });

})();
