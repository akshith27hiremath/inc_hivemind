// ============================================
// HIVEMIND — Auth System (localStorage-based)
// ============================================

(function () {
    'use strict';

    // ============================================
    // BG PARTICLES (same as landing page)
    // ============================================
    const bgCanvas = document.getElementById('bg-graph');
    if (bgCanvas) {
        const ctx = bgCanvas.getContext('2d');
        let particles = [];
        const COUNT = 40;

        function resize() { bgCanvas.width = window.innerWidth; bgCanvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', resize);

        class P {
            constructor() {
                this.x = Math.random() * bgCanvas.width;
                this.y = Math.random() * bgCanvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.15;
                this.vy = (Math.random() - 0.5) * 0.15;
                this.alpha = Math.random() * 0.2 + 0.03;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > bgCanvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > bgCanvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212,175,55,${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < COUNT; i++) particles.push(new P());

        function animate() {
            ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(212,175,55,${(1 - dist / 140) * 0.04})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ============================================
    // PASSWORD TOGGLE
    // ============================================
    const passToggle = document.getElementById('password-toggle');
    const passInput = document.getElementById('password');
    if (passToggle && passInput) {
        passToggle.addEventListener('click', () => {
            const isPassword = passInput.type === 'password';
            passInput.type = isPassword ? 'text' : 'password';
            passToggle.querySelector('svg').style.opacity = isPassword ? '1' : '0.4';
        });
    }

    // ============================================
    // PASSWORD STRENGTH (signup only)
    // ============================================
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.getElementById('strength-text');

    if (passInput && strengthBars.length > 0) {
        passInput.addEventListener('input', () => {
            const val = passInput.value;
            let score = 0;
            if (val.length >= 8) score++;
            if (/[A-Z]/.test(val)) score++;
            if (/[0-9]/.test(val)) score++;
            if (/[^A-Za-z0-9]/.test(val)) score++;

            const levels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
            const classes = ['', 'weak', 'weak', 'medium', 'strong'];

            strengthBars.forEach((bar, i) => {
                bar.className = 'strength-bar';
                if (i < score && val.length > 0) {
                    bar.classList.add('active', classes[score]);
                }
            });

            if (strengthText) {
                strengthText.textContent = val.length > 0 ? levels[score] : '';
                strengthText.style.color = score <= 1 ? 'var(--red)' : score <= 2 ? 'var(--amber)' : 'var(--green)';
            }
        });
    }

    // ============================================
    // LOGIN FORM
    // ============================================
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const errorEl = document.getElementById('form-error');
            const submitBtn = document.getElementById('submit-btn');

            errorEl.classList.remove('visible');

            // Validate
            if (!email || !password) {
                showError(errorEl, 'Please fill in all fields.');
                return;
            }

            // Check stored users
            const users = JSON.parse(localStorage.getItem('hivemind_users') || '[]');
            const user = users.find(u => u.email === email);

            if (!user) {
                showError(errorEl, 'No account found with that email. Try signing up.');
                return;
            }

            if (user.password !== password) {
                showError(errorEl, 'Incorrect password. Please try again.');
                return;
            }

            // Success — set session
            submitBtn.classList.add('loading');

            setTimeout(() => {
                localStorage.setItem('hivemind_session', JSON.stringify({
                    email: user.email,
                    name: user.firstName + ' ' + user.lastName,
                    firstName: user.firstName,
                    loggedInAt: Date.now()
                }));
                window.location.href = 'dashboard.html';
            }, 1200);
        });
    }

    // ============================================
    // SIGNUP FORM
    // ============================================
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const firstName = document.getElementById('first-name').value.trim();
            const lastName = document.getElementById('last-name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const errorEl = document.getElementById('form-error');
            const submitBtn = document.getElementById('submit-btn');

            errorEl.classList.remove('visible');

            if (!firstName || !lastName || !email || !password) {
                showError(errorEl, 'Please fill in all fields.');
                return;
            }

            if (password.length < 8) {
                showError(errorEl, 'Password must be at least 8 characters.');
                return;
            }

            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('hivemind_users') || '[]');
            if (users.find(u => u.email === email)) {
                showError(errorEl, 'An account with that email already exists. Try signing in.');
                return;
            }

            // Save user
            submitBtn.classList.add('loading');

            setTimeout(() => {
                users.push({ firstName, lastName, email, password, createdAt: Date.now() });
                localStorage.setItem('hivemind_users', JSON.stringify(users));

                // Auto-login
                localStorage.setItem('hivemind_session', JSON.stringify({
                    email,
                    name: firstName + ' ' + lastName,
                    firstName,
                    loggedInAt: Date.now()
                }));

                // Show success
                const wrapper = document.querySelector('.auth-form-wrapper');
                wrapper.innerHTML = `
                    <div class="auth-success">
                        <div class="auth-success-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </div>
                        <h3>Welcome to Hivemind, ${firstName}!</h3>
                        <p>Your account has been created. Redirecting to your dashboard...</p>
                    </div>
                `;

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            }, 1400);
        });
    }

    // ============================================
    // SOCIAL AUTH (Demo — instant login)
    // ============================================
    document.querySelectorAll('#google-btn, #github-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.id === 'google-btn' ? 'Google' : 'GitHub';

            // Create a demo user
            const demoUser = {
                email: `demo@${provider.toLowerCase()}.com`,
                name: 'Demo User',
                firstName: 'Demo',
                loggedInAt: Date.now()
            };

            localStorage.setItem('hivemind_session', JSON.stringify(demoUser));

            // Also save to users list
            const users = JSON.parse(localStorage.getItem('hivemind_users') || '[]');
            if (!users.find(u => u.email === demoUser.email)) {
                users.push({ firstName: 'Demo', lastName: 'User', email: demoUser.email, password: 'demo1234', createdAt: Date.now() });
                localStorage.setItem('hivemind_users', JSON.stringify(users));
            }

            btn.innerHTML = '<span class="btn-loader" style="position:static;opacity:1;width:18px;height:18px;border:2px solid rgba(255,255,255,0.2);border-top-color:#fff;"></span>';

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    });

    // ============================================
    // HELPERS
    // ============================================
    function showError(el, msg) {
        el.textContent = msg;
        el.classList.add('visible');
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Page fade-in
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    window.addEventListener('load', () => { document.body.style.opacity = '1'; });

})();
