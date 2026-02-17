// =============================================
// HIVEMIND — Dashboard v4
// Every pixel intentional. Every interaction earned.
// A living system breathing in real-time.
// =============================================

(function () {
    'use strict';

    // ── AUTH GUARD ──────────────────────────────
    const raw = localStorage.getItem('hivemind_session');
    let session;
    try { session = JSON.parse(raw); } catch (_) { session = null; }
    if (!session) { window.location.href = 'login.html'; return; }

    // ── HELPERS ─────────────────────────────────
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => document.querySelectorAll(s);
    const fmtUSD = (v) => '$' + Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const fmtPct = (v) => (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
    const fmtK = (v) => v >= 1000 ? '$' + (v / 1000).toFixed(1) + 'k' : fmtUSD(v);
    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const rand = (lo, hi) => lo + Math.random() * (hi - lo);
    const DPR = window.devicePixelRatio || 1;

    // ── AMBIENT PARTICLE SYSTEM ────────────────
    const ambientCanvas = $('#ambient-canvas');
    let ambientCtx, aw, ah;
    const PARTICLE_COUNT = 70;
    const CONNECT_DIST = 150;
    let particles = [];

    function initAmbient() {
        if (!ambientCanvas) return;
        ambientCtx = ambientCanvas.getContext('2d');
        resizeAmbient();
        seedParticles();
        requestAnimationFrame(tickAmbient);
        window.addEventListener('resize', resizeAmbient);
    }

    function resizeAmbient() {
        if (!ambientCanvas) return;
        aw = window.innerWidth;
        ah = window.innerHeight;
        ambientCanvas.width = aw * DPR;
        ambientCanvas.height = ah * DPR;
        ambientCanvas.style.position = 'fixed';
        ambientCanvas.style.top = '0';
        ambientCanvas.style.left = '0';
        ambientCanvas.style.width = aw + 'px';
        ambientCanvas.style.height = ah + 'px';
        ambientCanvas.style.zIndex = '0';
        ambientCanvas.style.pointerEvents = 'none';
        ambientCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function seedParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * aw,
                y: Math.random() * ah,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                r: rand(0.5, 1.5),
                alpha: rand(0.03, 0.12),
            });
        }
    }

    function tickAmbient() {
        if (!ambientCtx) return;
        ambientCtx.clearRect(0, 0, aw, ah);

        // Update positions
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < -10) p.x = aw + 10;
            if (p.x > aw + 10) p.x = -10;
            if (p.y < -10) p.y = ah + 10;
            if (p.y > ah + 10) p.y = -10;

            // Subtle drift variation
            p.vx += (Math.random() - 0.5) * 0.003;
            p.vy += (Math.random() - 0.5) * 0.003;
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            const maxSpeed = 0.15;
            const minSpeed = 0.05;
            if (speed > maxSpeed) {
                p.vx = (p.vx / speed) * maxSpeed;
                p.vy = (p.vy / speed) * maxSpeed;
            } else if (speed < minSpeed) {
                p.vx = (p.vx / (speed || 0.01)) * minSpeed;
                p.vy = (p.vy / (speed || 0.01)) * minSpeed;
            }
        }

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    const opacity = (1 - dist / CONNECT_DIST) * 0.035;
                    ambientCtx.beginPath();
                    ambientCtx.moveTo(a.x, a.y);
                    ambientCtx.lineTo(b.x, b.y);
                    ambientCtx.strokeStyle = 'rgba(201,168,76,' + opacity + ')';
                    ambientCtx.lineWidth = 0.5;
                    ambientCtx.stroke();
                }
            }
        }

        // Draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            ambientCtx.beginPath();
            ambientCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ambientCtx.fillStyle = 'rgba(201,168,76,' + p.alpha + ')';
            ambientCtx.fill();
        }

        requestAnimationFrame(tickAmbient);
    }

    // Start ambient immediately
    initAmbient();

    // ── LOADING SEQUENCE ───────────────────────
    const loader = $('#loader');
    const app = $('#app');

    if (loader && app) {
        setTimeout(() => {
            loader.classList.add('loader-out');
            app.classList.add('app-visible');
        }, 1200);
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1600);
    }

    // ── USER PERSONALIZATION ────────────────────
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const firstName = session.firstName || session.name?.split(' ')[0] || 'there';

    const greetEl = $('#topbar-greeting');
    const dateEl = $('#topbar-date');
    const avatarEl = $('#user-avatar');
    const nameEl = $('#user-name');
    const settingsName = $('#settings-name');
    const settingsEmail = $('#settings-email');

    if (greetEl) greetEl.textContent = greeting + ', ' + firstName;
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    if (avatarEl) avatarEl.textContent = firstName.charAt(0).toUpperCase();
    if (nameEl) nameEl.textContent = session.name || firstName;
    if (settingsName) settingsName.value = session.name || '';
    if (settingsEmail) settingsEmail.value = session.email || '';

    // ── LOGOUT ──────────────────────────────────
    const logoutBtn = $('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('hivemind_session');
            window.location.href = 'login.html';
        });
    }

    // ── PAGE ROUTING ────────────────────────────
    const navItems = $$('.nav-item[data-page]');
    const pages = $$('.page[data-page]');
    let currentPage = 'overview';

    function navigateTo(pageName) {
        pages.forEach(p => p.classList.remove('active'));
        navItems.forEach(n => n.classList.remove('active'));
        const targetPage = document.querySelector('.page[data-page="' + pageName + '"]');
        const targetNav = document.querySelector('.nav-item[data-page="' + pageName + '"]');
        if (targetPage) {
            targetPage.classList.add('active');
            staggerEntranceForPage(targetPage);
        }
        if (targetNav) targetNav.classList.add('active');
        currentPage = pageName;

        // Lazy-init graph when first visited
        if (pageName === 'graph' && !graphInitialized) initGraph();
    }

    navItems.forEach(btn => {
        btn.addEventListener('click', () => navigateTo(btn.dataset.page));
    });

    // ── STAGGER ENTRANCE ANIMATIONS ─────────────
    function staggerEntranceForPage(pageEl) {
        // Stagger animate direct children that are cards, rows, insights, sections
        const targets = pageEl.querySelectorAll('.card, .insight, .alert-item, .ss, .overview-hero, .chart-section, .brief-hero, .graph-head, .graph-viewport, .alerts-head, .settings-head, .settings-sections, [data-stagger]');
        targets.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(12px)';
            el.style.transition = 'none';
            setTimeout(() => {
                el.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 60 * i + 30);
        });
    }

    // Also run IntersectionObserver for data-stagger items in brief page
    function initStaggerObserver() {
        const staggerItems = $$('[data-stagger]');
        if (!staggerItems.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.stagger || '0', 10) * 80;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        staggerItems.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(16px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
            observer.observe(el);
        });
    }

    // ── HOLDINGS DATA ───────────────────────────
    const holdings = [
        { symbol: 'NVDA', name: 'NVIDIA Corp', price: 847.23, change: 2.34, shares: 15, connections: 12 },
        { symbol: 'TSLA', name: 'Tesla Inc', price: 248.91, change: -1.87, shares: 20, connections: 9 },
        { symbol: 'AAPL', name: 'Apple Inc', price: 189.45, change: 0.72, shares: 30, connections: 7 },
        { symbol: 'AMZN', name: 'Amazon.com', price: 178.32, change: 1.15, shares: 12, connections: 8 },
        { symbol: 'MSFT', name: 'Microsoft', price: 415.67, change: 0.43, shares: 10, connections: 6 },
        { symbol: 'GOOGL', name: 'Alphabet', price: 152.89, change: -0.32, shares: 18, connections: 5 },
    ];

    function recalcTotals() {
        let tv = 0, dp = 0;
        holdings.forEach(h => {
            tv += h.price * h.shares;
            dp += (h.price * h.change / 100) * h.shares;
        });
        return { totalValue: tv, dayPL: dp };
    }

    let { totalValue, dayPL } = recalcTotals();

    // ── ANIMATED COUNTER ────────────────────────
    function animateValue(el, from, to, duration, fmt) {
        if (!el) return;
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            // Quartic ease-out: 1 - (1-t)^4
            const eased = 1 - Math.pow(1 - t, 4);
            el.textContent = fmt(lerp(from, to, eased));
            if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    // ── PORTFOLIO HEADER ────────────────────────
    const portValueEl = $('#port-value');
    const portBadge = $('#port-badge');
    const portSub = $('#port-sub');
    const miniOpen = $('#mini-open');
    const miniHigh = $('#mini-high');
    const miniLow = $('#mini-low');

    const dayPct = (dayPL / (totalValue - dayPL)) * 100;
    const openVal = totalValue - dayPL;
    const highVal = totalValue * 1.004;
    const lowVal = openVal * 0.997;

    // Animate portfolio value after loader fades
    setTimeout(() => {
        animateValue(portValueEl, 0, totalValue, 1600, fmtUSD);
    }, 1400);

    setTimeout(() => {
        if (portBadge) {
            portBadge.textContent = fmtPct(dayPct);
            portBadge.className = 'port-badge ' + (dayPct >= 0 ? 'positive' : 'negative');
        }
        if (portSub) {
            portSub.textContent = (dayPL >= 0 ? '+' : '-') + fmtUSD(Math.abs(dayPL)) + ' today';
        }
    }, 1600);

    if (miniOpen) miniOpen.textContent = fmtK(openVal);
    if (miniHigh) miniHigh.textContent = fmtK(highVal);
    if (miniLow) miniLow.textContent = fmtK(lowVal);

    // ── PORTFOLIO CHART ─────────────────────────
    const chartCanvas = $('#chart-canvas');
    const chartWrap = $('#chart-wrap');
    const chLineV = chartWrap ? chartWrap.querySelector('.ch-line-v') : null;
    const chDot = chartWrap ? chartWrap.querySelector('.ch-dot') : null;
    const chTooltip = chartWrap ? chartWrap.querySelector('.ch-tooltip') : null;
    const chPrice = $('#ch-price');
    const chTime = $('#ch-time');

    let chartCtx, cw, ch;
    const CHART_PAD = { top: 20, bottom: 28, left: 0, right: 0 };
    const CHART_PTS = 128;
    let chartData = [];
    let chartLabels = [];
    let chartTargetData = null;
    let chartTransitionStart = 0;
    const CHART_TRANSITION_DUR = 400;

    function resizeChart() {
        if (!chartCanvas || !chartWrap) return;
        const r = chartWrap.getBoundingClientRect();
        chartCanvas.width = r.width * DPR;
        chartCanvas.height = r.height * DPR;
        chartCanvas.style.width = r.width + 'px';
        chartCanvas.style.height = r.height + 'px';
        chartCtx = chartCanvas.getContext('2d');
        chartCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
        cw = r.width;
        ch = r.height;
    }

    function genChartData(volatility, trend) {
        if (volatility === undefined) volatility = 0.003;
        if (trend === undefined) trend = 0.48;
        const data = [];
        let v = totalValue * 0.97;
        for (let i = 0; i < CHART_PTS; i++) {
            v += (Math.random() - trend) * (totalValue * volatility);
            v = Math.max(v, totalValue * 0.92);
            data.push(v);
        }
        data[data.length - 1] = totalValue;

        // Generate time labels
        const labels = [];
        const now = new Date();
        for (let i = 0; i < CHART_PTS; i++) {
            const minutesBack = (CHART_PTS - 1 - i) * 3;
            const d = new Date(now.getTime() - minutesBack * 60000);
            labels.push(d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
        }
        return { data: data, labels: labels };
    }

    function setChartData(volatility, smooth) {
        const gen = genChartData(volatility);
        if (smooth && chartData.length === CHART_PTS) {
            chartTargetData = gen.data;
            chartTransitionStart = performance.now();
            chartLabels = gen.labels;
        } else {
            chartData = gen.data;
            chartLabels = gen.labels;
            chartTargetData = null;
        }
    }

    function getChartRenderData() {
        if (!chartTargetData) return chartData;
        const elapsed = performance.now() - chartTransitionStart;
        const t = Math.min(elapsed / CHART_TRANSITION_DUR, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        if (t >= 1) {
            chartData = chartTargetData;
            chartTargetData = null;
            return chartData;
        }
        const blended = [];
        for (let i = 0; i < chartData.length; i++) {
            blended.push(lerp(chartData[i], chartTargetData[i], eased));
        }
        return blended;
    }

    function drawChart() {
        if (!chartCtx) return;
        const data = getChartRenderData();
        if (!data.length) return;
        chartCtx.clearRect(0, 0, cw, ch);

        const minV = Math.min.apply(null, data) * 0.9985;
        const maxV = Math.max.apply(null, data) * 1.0015;
        const w = cw - CHART_PAD.left - CHART_PAD.right;
        const h = ch - CHART_PAD.top - CHART_PAD.bottom;
        const getX = function (i) { return CHART_PAD.left + (i / (data.length - 1)) * w; };
        const getY = function (v) { return CHART_PAD.top + h - ((v - minV) / (maxV - minV)) * h; };

        // Subtle horizontal grid lines
        chartCtx.strokeStyle = 'rgba(255,255,255,0.02)';
        chartCtx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = CHART_PAD.top + (h / 5) * i;
            chartCtx.beginPath();
            chartCtx.moveTo(0, y);
            chartCtx.lineTo(cw, y);
            chartCtx.stroke();
        }

        // Gradient fill under curve
        const grad = chartCtx.createLinearGradient(0, CHART_PAD.top, 0, ch);
        grad.addColorStop(0, 'rgba(201,168,76,0.08)');
        grad.addColorStop(0.5, 'rgba(201,168,76,0.03)');
        grad.addColorStop(1, 'rgba(201,168,76,0)');

        chartCtx.beginPath();
        chartCtx.moveTo(getX(0), ch);
        for (let i = 0; i < data.length; i++) {
            const x = getX(i);
            const y = getY(data[i]);
            if (i === 0) {
                chartCtx.lineTo(x, y);
            } else {
                const px = getX(i - 1);
                const py = getY(data[i - 1]);
                chartCtx.bezierCurveTo((px + x) / 2, py, (px + x) / 2, y, x, y);
            }
        }
        chartCtx.lineTo(getX(data.length - 1), ch);
        chartCtx.fillStyle = grad;
        chartCtx.fill();

        // Bezier-curved line (amber)
        chartCtx.beginPath();
        for (let i = 0; i < data.length; i++) {
            const x = getX(i);
            const y = getY(data[i]);
            if (i === 0) {
                chartCtx.moveTo(x, y);
            } else {
                const px = getX(i - 1);
                const py = getY(data[i - 1]);
                chartCtx.bezierCurveTo((px + x) / 2, py, (px + x) / 2, y, x, y);
            }
        }
        chartCtx.strokeStyle = 'rgba(201,168,76,0.5)';
        chartCtx.lineWidth = 1.5;
        chartCtx.stroke();

        // End dot with radial glow
        const lastX = getX(data.length - 1);
        const lastY = getY(data[data.length - 1]);
        const glowGrad = chartCtx.createRadialGradient(lastX, lastY, 0, lastX, lastY, 20);
        glowGrad.addColorStop(0, 'rgba(201,168,76,0.25)');
        glowGrad.addColorStop(1, 'rgba(201,168,76,0)');
        chartCtx.beginPath();
        chartCtx.arc(lastX, lastY, 20, 0, Math.PI * 2);
        chartCtx.fillStyle = glowGrad;
        chartCtx.fill();

        chartCtx.beginPath();
        chartCtx.arc(lastX, lastY, 3, 0, Math.PI * 2);
        chartCtx.fillStyle = '#c9a84c';
        chartCtx.fill();

        // Time labels at bottom
        chartCtx.font = '500 9px "JetBrains Mono", monospace';
        chartCtx.fillStyle = 'rgba(255,255,255,0.1)';
        chartCtx.textAlign = 'center';
        var labelCount = 7;
        for (let i = 0; i < labelCount; i++) {
            const idx = Math.round((i / (labelCount - 1)) * (data.length - 1));
            chartCtx.fillText(chartLabels[idx] || '', getX(idx), ch - 6);
        }

        // Store getters for crosshair
        chartCanvas._getX = getX;
        chartCanvas._getY = getY;
        chartCanvas._data = data;

        // If transitioning, keep drawing
        if (chartTargetData) requestAnimationFrame(drawChart);
    }

    // Crosshair interaction on chart
    if (chartWrap) {
        chartWrap.addEventListener('mousemove', function (e) {
            const data = chartCanvas._data;
            if (!data || !data.length || !chartCanvas._getX) return;
            const rect = chartWrap.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const w = cw - CHART_PAD.left - CHART_PAD.right;
            const idx = Math.round(((mx - CHART_PAD.left) / w) * (data.length - 1));
            const ci = clamp(idx, 0, data.length - 1);
            const val = data[ci];
            const x = chartCanvas._getX(ci);
            const y = chartCanvas._getY(val);

            if (chLineV) chLineV.style.left = x + 'px';
            if (chDot) {
                chDot.style.left = x + 'px';
                chDot.style.top = y + 'px';
            }
            if (chTooltip) {
                chTooltip.style.left = Math.min(x + 12, cw - 140) + 'px';
                chTooltip.style.top = Math.max(y - 44, 4) + 'px';
            }
            if (chPrice) chPrice.textContent = fmtUSD(val);
            if (chTime) chTime.textContent = chartLabels[ci] || '';
        });
    }

    // Chart tab switching
    const volMap = { '1D': 0.003, '1W': 0.005, '1M': 0.008, '3M': 0.012, '1Y': 0.02 };

    $$('.ctab[data-r]').forEach(function (tab) {
        tab.addEventListener('click', function () {
            $$('.ctab').forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
            var r = tab.dataset.r;
            setChartData(volMap[r] || 0.003, true);
            drawChart();
        });
    });

    // Init chart
    if (chartCanvas && chartWrap) {
        resizeChart();
        setChartData(0.003, false);
        drawChart();
        window.addEventListener('resize', function () { resizeChart(); drawChart(); });

        // Live drift every 3s
        setInterval(function () {
            if (!chartData.length) return;
            var drift = (Math.random() - 0.48) * (totalValue * 0.0005);
            chartData.push(chartData[chartData.length - 1] + drift);
            chartData.shift();
            chartLabels.push(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
            chartLabels.shift();
            drawChart();
        }, 3000);
    }

    // ── HOLDINGS TABLE ──────────────────────────
    const holdingsBody = $('#holdings-body');

    function buildHoldingsTable() {
        if (!holdingsBody) return;
        holdingsBody.innerHTML = '';
        holdings.forEach(function (h, i) {
            var val = h.price * h.shares;
            var row = document.createElement('div');
            row.className = 'h-row';
            row.style.opacity = '0';
            row.style.transform = 'translateY(8px)';
            row.innerHTML =
                '<div class="h-asset">' +
                    '<div class="h-icon">' + h.symbol.substring(0, 2) + '</div>' +
                    '<div>' +
                        '<span class="h-sym">' + h.symbol + '</span>' +
                        '<span class="h-name">' + h.name + '</span>' +
                    '</div>' +
                '</div>' +
                '<span class="h-price">' + fmtUSD(h.price) + '</span>' +
                '<span class="h-chg ' + (h.change >= 0 ? 'positive' : 'negative') + '">' + fmtPct(h.change) + '</span>' +
                '<span class="h-val">' + fmtK(val) + '</span>' +
                '<span class="h-links">' + h.connections + '</span>';
            holdingsBody.appendChild(row);

            // Stagger animation
            setTimeout(function () {
                row.style.transition = 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)';
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            }, 1800 + i * 40);
        });
    }

    buildHoldingsTable();

    // Holdings price drift every 4s
    setInterval(function () {
        var rows = holdingsBody ? holdingsBody.querySelectorAll('.h-row') : [];
        rows.forEach(function (row, i) {
            if (!holdings[i]) return;
            var drift = (Math.random() - 0.48) * 1.0;
            holdings[i].price *= (1 + drift / 200);
            holdings[i].change += drift * 0.04;

            var priceEl = row.querySelector('.h-price');
            var chgEl = row.querySelector('.h-chg');
            var valEl = row.querySelector('.h-val');

            if (priceEl) priceEl.textContent = fmtUSD(holdings[i].price);
            if (chgEl) {
                chgEl.textContent = fmtPct(holdings[i].change);
                chgEl.className = 'h-chg ' + (holdings[i].change >= 0 ? 'positive' : 'negative');
            }
            if (valEl) valEl.textContent = fmtK(holdings[i].price * holdings[i].shares);

            row.classList.remove('flash-up', 'flash-down');
            void row.offsetWidth; // trigger reflow
            row.classList.add(drift >= 0 ? 'flash-up' : 'flash-down');
        });

        // Refresh portfolio header value
        var totals = recalcTotals();
        totalValue = totals.totalValue;
        dayPL = totals.dayPL;
        if (portValueEl) portValueEl.textContent = fmtUSD(totals.totalValue);
    }, 4000);

    // ── LIVE FEED ───────────────────────────────
    const feedBody = $('#feed-body');
    const feedSymbols = ['NVDA', 'TSLA', 'AAPL', 'AMZN', 'MSFT', 'GOOGL', 'META', 'AMD', 'TSM', 'NFLX', 'JPM', 'V'];
    const feedPrices = {};
    feedSymbols.forEach(function (s) {
        var match = holdings.find(function (h) { return h.symbol === s; });
        feedPrices[s] = match ? match.price : 100 + Math.random() * 600;
    });

    const feedMessages = ['Price update', 'Volume spike', 'Block trade', 'Level crossed', 'Session high', 'Bid shift', 'Momentum shift', 'Ask moved'];

    function addFeedItem() {
        if (!feedBody) return;
        var sym = feedSymbols[Math.floor(Math.random() * feedSymbols.length)];
        var chg = (Math.random() - 0.48) * 1.8;
        feedPrices[sym] *= (1 + chg / 100);
        var msg = feedMessages[Math.floor(Math.random() * feedMessages.length)];
        var now = new Date();
        var time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

        var row = document.createElement('div');
        row.className = 'feed-row';
        row.innerHTML =
            '<span class="fr-sym">' + sym + '</span>' +
            '<span class="fr-price">' + fmtUSD(feedPrices[sym]) + '</span>' +
            '<span class="fr-chg ' + (chg >= 0 ? 'positive' : 'negative') + '">' + fmtPct(chg) + '</span>' +
            '<span class="fr-msg">' + msg + '</span>' +
            '<span class="fr-time">' + time + '</span>';

        feedBody.insertBefore(row, feedBody.firstChild);
        while (feedBody.children.length > 50) feedBody.removeChild(feedBody.lastChild);
    }

    // Pre-fill 18 items
    for (var i = 0; i < 18; i++) addFeedItem();

    // Stream new items at random intervals
    function scheduleFeed() {
        addFeedItem();
        setTimeout(scheduleFeed, 1200 + Math.random() * 2300);
    }
    // Start after orchestration delay
    setTimeout(scheduleFeed, 2000);

    // ── KNOWLEDGE GRAPH ─────────────────────────
    const graphCanvas = $('#graph-canvas');
    const graphViewport = $('#graph-viewport');
    const graphInfo = $('#graph-info');
    const giTitle = $('#gi-title');
    const giType = $('#gi-type');
    const giDesc = $('#gi-desc');
    const giConns = $('#gi-conns');
    const giClose = $('#gi-close');

    let graphInitialized = false;
    let gCtx, gw, gh;
    let graphNodes = [];
    let graphEdges = [];
    let graphAnimId = null;
    let hoveredNode = null;
    let selectedNode = null;
    let graphFrameCount = 0;

    // Node data (17 total)
    const graphData = {
        nodes: [
            // Holdings (amber)
            { id: 'NVDA', label: 'NVDA', type: 'holding', desc: 'NVIDIA Corp \u2014 $847.23 (+2.34%)', r: 24 },
            { id: 'TSLA', label: 'TSLA', type: 'holding', desc: 'Tesla Inc \u2014 $248.91 (-1.87%)', r: 20 },
            { id: 'AAPL', label: 'AAPL', type: 'holding', desc: 'Apple Inc \u2014 $189.45 (+0.72%)', r: 22 },
            { id: 'AMZN', label: 'AMZN', type: 'holding', desc: 'Amazon.com \u2014 $178.32 (+1.15%)', r: 19 },
            { id: 'MSFT', label: 'MSFT', type: 'holding', desc: 'Microsoft \u2014 $415.67 (+0.43%)', r: 20 },
            { id: 'GOOGL', label: 'GOOGL', type: 'holding', desc: 'Alphabet \u2014 $152.89 (-0.32%)', r: 19 },
            // Events (red)
            { id: 'tsmc', label: 'TSMC Report', type: 'event', desc: 'TSMC 98% fab utilization \u2014 GPU shortage likely through Q3', r: 15 },
            { id: 'eu-dma', label: 'EU DMA', type: 'event', desc: 'Digital Markets Act enforcement begins March 7', r: 15 },
            { id: 'fed', label: 'Fed Pause', type: 'event', desc: 'Fed signals rate pause at March FOMC', r: 14 },
            { id: 'giga', label: 'Giga Berlin', type: 'event', desc: 'Tesla Gigafactory Berlin ramp ahead of schedule', r: 13 },
            { id: 'foxconn', label: 'Foxconn', type: 'event', desc: 'Foxconn labor dispute \u2014 potential production impact', r: 14 },
            // Entities (grey)
            { id: 'gpu', label: 'GPU Supply', type: 'entity', desc: 'Global GPU supply chain network', r: 12 },
            { id: 'ai-compute', label: 'AI Compute', type: 'entity', desc: 'AI compute infrastructure demand', r: 13 },
            { id: 'ecom', label: 'E-Commerce', type: 'entity', desc: 'Global e-commerce regulation landscape', r: 12 },
            { id: 'rates', label: 'Interest Rates', type: 'entity', desc: 'Federal Reserve monetary policy', r: 12 },
            { id: 'ev', label: 'EV Market', type: 'entity', desc: 'Global electric vehicle production and demand', r: 11 },
            { id: 'semis', label: 'Semiconductors', type: 'entity', desc: 'Semiconductor manufacturing ecosystem', r: 13 },
        ],
        edges: [
            ['NVDA', 'tsmc'], ['NVDA', 'gpu'], ['NVDA', 'ai-compute'], ['NVDA', 'semis'],
            ['tsmc', 'gpu'], ['gpu', 'ai-compute'], ['tsmc', 'semis'],
            ['AAPL', 'foxconn'], ['AAPL', 'eu-dma'], ['AAPL', 'semis'],
            ['AMZN', 'eu-dma'], ['AMZN', 'ecom'],
            ['GOOGL', 'eu-dma'], ['GOOGL', 'ai-compute'],
            ['MSFT', 'ai-compute'], ['MSFT', 'fed'],
            ['TSLA', 'giga'], ['TSLA', 'ev'],
            ['fed', 'rates'], ['rates', 'NVDA'], ['rates', 'MSFT'], ['rates', 'AMZN'],
            ['foxconn', 'semis'],
            ['giga', 'ev'],
            ['ecom', 'eu-dma'],
        ]
    };

    function initGraph() {
        if (!graphCanvas || !graphViewport) return;
        graphInitialized = true;

        var rect = graphViewport.getBoundingClientRect();
        graphCanvas.width = rect.width * DPR;
        graphCanvas.height = rect.height * DPR;
        graphCanvas.style.width = rect.width + 'px';
        graphCanvas.style.height = rect.height + 'px';
        gCtx = graphCanvas.getContext('2d');
        gCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
        gw = rect.width;
        gh = rect.height;

        var cx = gw / 2;
        var cy = gh / 2;

        // Categorize nodes
        var holdingNodes = graphData.nodes.filter(function (n) { return n.type === 'holding'; });
        var eventNodes = graphData.nodes.filter(function (n) { return n.type === 'event'; });
        var entityNodes = graphData.nodes.filter(function (n) { return n.type === 'entity'; });

        // Position nodes in rings
        graphNodes = graphData.nodes.map(function (n) {
            var angle, dist;
            if (n.type === 'holding') {
                var idx = holdingNodes.indexOf(n);
                angle = (idx / holdingNodes.length) * Math.PI * 2 - Math.PI / 2;
                dist = Math.min(gw, gh) * 0.18;
            } else if (n.type === 'event') {
                var idx2 = eventNodes.indexOf(n);
                angle = (idx2 / eventNodes.length) * Math.PI * 2 + 0.3;
                dist = Math.min(gw, gh) * 0.32;
            } else {
                var idx3 = entityNodes.indexOf(n);
                angle = (idx3 / entityNodes.length) * Math.PI * 2 + 0.15;
                dist = Math.min(gw, gh) * 0.38;
            }
            return {
                id: n.id,
                label: n.label,
                type: n.type,
                desc: n.desc,
                r: n.r,
                x: cx + Math.cos(angle) * dist + rand(-25, 25),
                y: cy + Math.sin(angle) * dist + rand(-25, 25),
                vx: 0,
                vy: 0,
            };
        });

        // Build edges
        graphEdges = [];
        graphData.edges.forEach(function (pair) {
            var from = graphNodes.find(function (n) { return n.id === pair[0]; });
            var to = graphNodes.find(function (n) { return n.id === pair[1]; });
            if (from && to) graphEdges.push({ from: from, to: to });
        });

        // Force-directed simulation step
        function simulate(strength) {
            if (strength === undefined) strength = 1.0;
            var DAMPING = 0.85;
            var REPULSION = 3000 * strength;
            var ATTRACTION = 0.006 * strength;
            var CENTER_PULL = 0.003 * strength;

            // Repulsion between all nodes
            for (var i = 0; i < graphNodes.length; i++) {
                for (var j = i + 1; j < graphNodes.length; j++) {
                    var a = graphNodes[i];
                    var b = graphNodes[j];
                    var dx = b.x - a.x;
                    var dy = b.y - a.y;
                    var dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    var force = REPULSION / (dist * dist);
                    var fx = (dx / dist) * force;
                    var fy = (dy / dist) * force;
                    a.vx -= fx;
                    a.vy -= fy;
                    b.vx += fx;
                    b.vy += fy;
                }
            }

            // Attraction along edges
            graphEdges.forEach(function (e) {
                var dx = e.to.x - e.from.x;
                var dy = e.to.y - e.from.y;
                var dist = Math.sqrt(dx * dx + dy * dy) || 1;
                var targetDist = 110;
                var force = (dist - targetDist) * ATTRACTION;
                var fx = (dx / dist) * force;
                var fy = (dy / dist) * force;
                e.from.vx += fx;
                e.from.vy += fy;
                e.to.vx -= fx;
                e.to.vy -= fy;
            });

            // Center pull
            graphNodes.forEach(function (n) {
                n.vx += (cx - n.x) * CENTER_PULL;
                n.vy += (cy - n.y) * CENTER_PULL;
            });

            // Apply velocities with damping
            graphNodes.forEach(function (n) {
                n.vx *= DAMPING;
                n.vy *= DAMPING;
                n.x += n.vx;
                n.y += n.vy;
                // Keep in bounds
                n.x = clamp(n.x, n.r + 20, gw - n.r - 20);
                n.y = clamp(n.y, n.r + 20, gh - n.r - 20);
            });
        }

        // Run 150 iterations to settle
        for (var i = 0; i < 150; i++) simulate(1.0);

        // Render loop
        var lastFrame = 0;
        var frameInterval = 1000 / 30; // 30fps

        function drawGraph(timestamp) {
            if (timestamp - lastFrame < frameInterval) {
                graphAnimId = requestAnimationFrame(drawGraph);
                return;
            }
            lastFrame = timestamp;
            graphFrameCount++;

            gCtx.clearRect(0, 0, gw, gh);

            // Very light continued simulation (breathing effect)
            simulate(0.02);

            // Draw edges
            graphEdges.forEach(function (e) {
                var isHighlighted = selectedNode && (e.from.id === selectedNode.id || e.to.id === selectedNode.id);
                var isHoverHL = !selectedNode && hoveredNode && (e.from.id === hoveredNode.id || e.to.id === hoveredNode.id);

                gCtx.beginPath();
                gCtx.moveTo(e.from.x, e.from.y);
                gCtx.lineTo(e.to.x, e.to.y);

                if (isHighlighted) {
                    gCtx.strokeStyle = 'rgba(201,168,76,0.35)';
                    gCtx.lineWidth = 1.5;
                } else if (isHoverHL) {
                    gCtx.strokeStyle = 'rgba(255,255,255,0.08)';
                    gCtx.lineWidth = 1;
                } else {
                    gCtx.strokeStyle = selectedNode ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.035)';
                    gCtx.lineWidth = 0.5;
                }
                gCtx.stroke();
            });

            // Draw nodes
            graphNodes.forEach(function (n) {
                var isSelected = selectedNode && n.id === selectedNode.id;
                var isHovered = hoveredNode && n.id === hoveredNode.id;
                var isConnected = selectedNode && graphEdges.some(function (e) {
                    return (e.from.id === selectedNode.id && e.to.id === n.id) ||
                           (e.to.id === selectedNode.id && e.from.id === n.id);
                });
                var isDimmed = selectedNode && !isSelected && !isConnected;

                var alpha = isDimmed ? 0.15 : 1;
                var fillColor, strokeColor, textColor, glowBase;

                if (n.type === 'holding') {
                    fillColor = 'rgba(201,168,76,' + (0.12 * alpha) + ')';
                    strokeColor = 'rgba(201,168,76,' + (0.35 * alpha) + ')';
                    textColor = 'rgba(201,168,76,' + alpha + ')';
                    glowBase = 'rgba(201,168,76,';
                } else if (n.type === 'event') {
                    fillColor = 'rgba(248,113,113,' + (0.1 * alpha) + ')';
                    strokeColor = 'rgba(248,113,113,' + (0.3 * alpha) + ')';
                    textColor = 'rgba(248,113,113,' + alpha + ')';
                    glowBase = 'rgba(248,113,113,';
                } else {
                    fillColor = 'rgba(153,153,153,' + (0.06 * alpha) + ')';
                    strokeColor = 'rgba(153,153,153,' + (0.15 * alpha) + ')';
                    textColor = 'rgba(153,153,153,' + alpha + ')';
                    glowBase = 'rgba(153,153,153,';
                }

                // Subtle radial glow for all nodes
                var baseGlowAlpha = 0.04 * alpha;
                if (isSelected || isHovered) baseGlowAlpha = 0.18;
                var nodeGlow = gCtx.createRadialGradient(n.x, n.y, n.r * 0.5, n.x, n.y, n.r * 2.5);
                nodeGlow.addColorStop(0, glowBase + baseGlowAlpha + ')');
                nodeGlow.addColorStop(1, glowBase + '0)');
                gCtx.beginPath();
                gCtx.arc(n.x, n.y, n.r * 2.5, 0, Math.PI * 2);
                gCtx.fillStyle = nodeGlow;
                gCtx.fill();

                // Node circle
                gCtx.beginPath();
                gCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                gCtx.fillStyle = fillColor;
                gCtx.fill();
                gCtx.strokeStyle = strokeColor;
                gCtx.lineWidth = isSelected ? 2 : 1;
                gCtx.stroke();

                // Label text
                var fontSize = n.r > 18 ? 10 : n.r > 14 ? 9 : 8;
                gCtx.font = '600 ' + fontSize + 'px "JetBrains Mono", monospace';
                gCtx.textAlign = 'center';
                gCtx.textBaseline = 'middle';
                gCtx.fillStyle = textColor;
                gCtx.fillText(n.label, n.x, n.y);
            });

            graphAnimId = requestAnimationFrame(drawGraph);
        }

        drawGraph(0);

        // Mouse interaction: hover detection
        graphCanvas.addEventListener('mousemove', function (e) {
            var rect = graphViewport.getBoundingClientRect();
            var mx = e.clientX - rect.left;
            var my = e.clientY - rect.top;

            hoveredNode = null;
            for (var i = graphNodes.length - 1; i >= 0; i--) {
                var n = graphNodes[i];
                var dx = mx - n.x;
                var dy = my - n.y;
                if (dx * dx + dy * dy < (n.r + 6) * (n.r + 6)) {
                    hoveredNode = n;
                    break;
                }
            }
            graphCanvas.style.cursor = hoveredNode ? 'pointer' : 'default';
        });

        // Mouse interaction: click to select
        graphCanvas.addEventListener('click', function (e) {
            var rect = graphViewport.getBoundingClientRect();
            var mx = e.clientX - rect.left;
            var my = e.clientY - rect.top;

            var clicked = null;
            for (var i = graphNodes.length - 1; i >= 0; i--) {
                var n = graphNodes[i];
                var dx = mx - n.x;
                var dy = my - n.y;
                if (dx * dx + dy * dy < (n.r + 6) * (n.r + 6)) {
                    clicked = n;
                    break;
                }
            }

            if (clicked) {
                selectedNode = clicked;
                showGraphInfo(clicked);
            } else {
                selectedNode = null;
                if (graphInfo) graphInfo.classList.remove('visible');
            }
        });

        // Close info panel
        if (giClose) {
            giClose.addEventListener('click', function () {
                selectedNode = null;
                if (graphInfo) graphInfo.classList.remove('visible');
            });
        }

        // Resize handler for graph
        window.addEventListener('resize', function () {
            if (!graphViewport || !graphCanvas) return;
            var r = graphViewport.getBoundingClientRect();
            graphCanvas.width = r.width * DPR;
            graphCanvas.height = r.height * DPR;
            graphCanvas.style.width = r.width + 'px';
            graphCanvas.style.height = r.height + 'px';
            gCtx = graphCanvas.getContext('2d');
            gCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
            gw = r.width;
            gh = r.height;
        });
    }

    function showGraphInfo(node) {
        if (!graphInfo || !giTitle || !giType || !giDesc || !giConns) return;

        giTitle.textContent = node.label;
        giType.textContent = node.type.charAt(0).toUpperCase() + node.type.slice(1);
        giDesc.textContent = node.desc;

        // Find connections
        var connected = [];
        graphEdges.forEach(function (e) {
            if (e.from.id === node.id) connected.push(e.to);
            if (e.to.id === node.id) connected.push(e.from);
        });

        giConns.innerHTML = '<span class="gi-conns-label">Connected to:</span>';
        connected.forEach(function (c) {
            var item = document.createElement('div');
            item.className = 'gi-conn-item';
            item.textContent = c.label;
            item.style.cursor = 'pointer';
            item.addEventListener('click', function () {
                selectedNode = c;
                showGraphInfo(c);
            });
            giConns.appendChild(item);
        });

        graphInfo.classList.add('visible');
    }

    // ── SEARCH MODAL ────────────────────────────
    const searchModal = $('#search-modal');
    const searchBackdrop = $('#search-backdrop');
    const searchInput = $('#search-input');
    const searchTrigger = $('#search-trigger');
    const searchResults = $('#search-results');

    function openSearch() {
        if (!searchModal) return;
        searchModal.classList.add('open');
        setTimeout(function () {
            if (searchInput) searchInput.focus();
        }, 80);
    }

    function closeSearch() {
        if (!searchModal) return;
        searchModal.classList.remove('open');
        if (searchInput) searchInput.value = '';
        // Reset visibility of all items
        if (searchResults) {
            searchResults.querySelectorAll('.sr-item, .sr-group').forEach(function (el) {
                el.style.display = '';
            });
        }
    }

    if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
    if (searchBackdrop) searchBackdrop.addEventListener('click', closeSearch);

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (searchModal && searchModal.classList.contains('open')) {
                closeSearch();
            } else {
                openSearch();
            }
        }
        if (e.key === 'Escape') closeSearch();
    });

    // Search filter
    if (searchInput && searchResults) {
        searchInput.addEventListener('input', function () {
            var q = searchInput.value.toLowerCase().trim();
            var items = searchResults.querySelectorAll('.sr-item');
            var groups = searchResults.querySelectorAll('.sr-group');

            items.forEach(function (item) {
                var match = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
                item.style.display = match ? '' : 'none';
            });

            // Show/hide group headers if all children hidden
            groups.forEach(function (g) {
                var sibling = g.nextElementSibling;
                var anyVisible = false;
                while (sibling && !sibling.classList.contains('sr-group')) {
                    if (sibling.style.display !== 'none') anyVisible = true;
                    sibling = sibling.nextElementSibling;
                }
                g.style.display = anyVisible ? '' : 'none';
            });
        });

        // Navigate to pages from search results
        searchResults.querySelectorAll('.sr-item[data-goto]').forEach(function (item) {
            item.addEventListener('click', function () {
                var page = item.dataset.goto;
                navigateTo(page);
                closeSearch();
            });
        });
    }

    // ── DAILY BRIEF ─────────────────────────────
    const briefLabel = $('#brief-label');
    if (briefLabel) {
        var now = new Date();
        briefLabel.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + ' \u2014 Today\'s Brief';
    }

    // ── PAGE LOAD ORCHESTRATION ─────────────────
    // 0ms: Auth check done (above), ambient particles started (above), loader shown
    // 1200ms: Fade out loader, fade in app (handled above in loading sequence)
    // 1400ms: Animate portfolio value counter (handled above)
    // 1600ms: Show badge, sub text (handled above)
    // 1800ms: Stagger in holdings rows (handled in buildHoldingsTable)
    // 2000ms: Start feed streaming (handled above with setTimeout)

    // Initialize stagger observer for brief page insights
    setTimeout(initStaggerObserver, 500);

    // Trigger initial stagger for overview page
    setTimeout(function () {
        var overviewPage = document.querySelector('.page[data-page="overview"]');
        if (overviewPage && overviewPage.classList.contains('active')) {
            // The overview page is already active, stagger its major sections
            var sections = overviewPage.querySelectorAll('.overview-hero, .chart-section, .overview-grid');
            sections.forEach(function (el, i) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(10px)';
                el.style.transition = 'none';
                setTimeout(function () {
                    el.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 1300 + i * 120);
            });
        }
    }, 10);

})();
