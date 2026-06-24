/* =============================================
   SPIDEYY_PAGE — script.js
   ============================================= */

// ──────────────────────────────────────────────
// 1.  NAV: active link on scroll
// ──────────────────────────────────────────────
const sections = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${id}"]`);
                if (active) active.classList.add('active');
            }
        });
    },
    { threshold: 0.45 }
);
sections.forEach(s => observer.observe(s));


// ──────────────────────────────────────────────
// 2.  HERO floating hearts (CSS-animated spans)
// ──────────────────────────────────────────────
const heartsBg = document.getElementById('heartsBg');
const HEART_CHARS = ['♡', '♥', '❤', '💕', '❣'];

function spawnHeroHeart() {
    const el = document.createElement('span');
    el.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
    const size = Math.random() * 18 + 10;
    const left = Math.random() * 100;
    const dur  = Math.random() * 6 + 5;
    const delay = Math.random() * 4;
    Object.assign(el.style, {
        position:   'absolute',
        bottom:     '-40px',
        left:       `${left}%`,
        fontSize:   `${size}px`,
        color:      Math.random() > 0.5 ? 'rgba(255,179,198,0.35)' : 'rgba(230,57,70,0.25)',
        animation:  `riseHeart ${dur}s ease-in ${delay}s infinite`,
        pointerEvents: 'none',
        userSelect: 'none',
    });
    heartsBg.appendChild(el);
}

// Inject the @keyframes once
const heroStyle = document.createElement('style');
heroStyle.textContent = `
@keyframes riseHeart {
    0%   { transform: translateY(0)   rotate(0deg);   opacity: 0; }
    10%  { opacity: 1; }
    80%  { opacity: 0.6; }
    100% { transform: translateY(-110vh) rotate(${Math.random() > 0.5 ? '' : '-'}30deg); opacity: 0; }
}`;
document.head.appendChild(heroStyle);

// Spawn 20 hero hearts
for (let i = 0; i < 20; i++) spawnHeroHeart();


// ──────────────────────────────────────────────
// 3.  LOVE PAGE — canvas heart bokeh animation
// ──────────────────────────────────────────────
const canvas = document.getElementById('loveCanvas');
const ctx    = canvas.getContext('2d');

function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

// Build a pool of bokeh hearts
const bokeh = Array.from({ length: 55 }, () => createBokeh());

function createBokeh() {
    return {
        x:     Math.random() * window.innerWidth,
        y:     Math.random() * window.innerHeight,
        size:  Math.random() * 22 + 6,
        alpha: Math.random() * 0.35 + 0.05,
        speed: Math.random() * 0.5 + 0.15,
        drift: (Math.random() - 0.5) * 0.6,
        hue:   Math.random() > 0.6 ? '#ffb3c6' : Math.random() > 0.5 ? '#e63946' : '#ffd166',
    };
}

// Draw a heart shape at (cx, cy) of given size
function drawHeart(cx, cy, size, alpha, color) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle   = color;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    // Parametric heart
    const s = size * 0.1;
    for (let t = 0; t <= Math.PI * 2; t += 0.05) {
        const x = s * 16 * Math.pow(Math.sin(t), 3);
        const y = -s * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        if (t === 0) ctx.moveTo(cx + x, cy + y);
        else         ctx.lineTo(cx + x, cy + y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

let animId;
function animateBokeh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bokeh.forEach(p => {
        p.y    -= p.speed;
        p.x    += p.drift;
        p.alpha = Math.max(0, p.alpha - 0.0008);
        drawHeart(p.x, p.y, p.size, p.alpha, p.hue);
        // Reset when faded or off-screen
        if (p.alpha <= 0.005 || p.y < -60) {
            Object.assign(p, {
                x:     Math.random() * canvas.width,
                y:     canvas.height + 40,
                alpha: Math.random() * 0.35 + 0.05,
                speed: Math.random() * 0.5 + 0.15,
                drift: (Math.random() - 0.5) * 0.6,
                hue:   Math.random() > 0.6 ? '#ffb3c6' : Math.random() > 0.5 ? '#e63946' : '#ffd166',
            });
        }
    });
    animId = requestAnimationFrame(animateBokeh);
}

// Only run animation when love section is visible (perf)
const lovePage = document.getElementById('love');
const canvasObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
        if (!animId) animateBokeh();
    } else {
        cancelAnimationFrame(animId);
        animId = null;
    }
}, { threshold: 0.1 });
canvasObserver.observe(lovePage);


// ──────────────────────────────────────────────
// 4.  LOVE PAGE — DOM particle hearts (extras)
// ──────────────────────────────────────────────
const loveParticles = document.getElementById('loveParticles');

// inject keyframe for dom particles
const pStyle = document.createElement('style');
pStyle.textContent = `
@keyframes particleRise {
    0%   { transform: translateY(0) scale(1); opacity: 0.7; }
    100% { transform: translateY(-80vh) scale(0.4); opacity: 0; }
}
@keyframes particleSway {
    0%, 100% { margin-left: 0; }
    50%       { margin-left: 30px; }
}`;
document.head.appendChild(pStyle);

function spawnLoveParticle() {
    const el = document.createElement('span');
    el.textContent = Math.random() > 0.5 ? '♡' : '❤';
    const size  = Math.random() * 20 + 8;
    const left  = Math.random() * 100;
    const dur   = Math.random() * 7 + 5;
    const sway  = Math.random() * 4 + 2;
    Object.assign(el.style, {
        position:   'absolute',
        bottom:     '5%',
        left:       `${left}%`,
        fontSize:   `${size}px`,
        color:      Math.random() > 0.5 ? '#ffb3c6' : '#e63946',
        animation:  `particleRise ${dur}s ease-in ${Math.random()*5}s infinite,
                     particleSway ${sway}s ease-in-out ${Math.random()*3}s infinite`,
        pointerEvents: 'none',
    });
    loveParticles.appendChild(el);
}
for (let i = 0; i < 18; i++) spawnLoveParticle();


// ──────────────────────────────────────────────
// 5.  Subtle tilt on cards (mouse parallax)
// ──────────────────────────────────────────────
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `
            translateY(-8px)
            rotateY(${x * 10}deg)
            rotateX(${-y * 8}deg)
            scale(1.01)
        `;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});


// ──────────────────────────────────────────────
// 6.  Smooth scroll for all anchors
// ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});