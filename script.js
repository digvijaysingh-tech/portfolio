(() => {
  'use strict';

  // ---------- Custom cursor ----------
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('[data-cursor="hover"]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  // ---------- Scroll progress + nav scroll state ----------
  const progress = document.getElementById('scroll-progress');
  const nav = document.getElementById('nav');

  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    progress.style.width = pct + '%';
    nav.classList.toggle('scrolled', h.scrollTop > 40);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Reveal-on-scroll ----------
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.classList.contains('reveal')) io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );
  document.querySelectorAll('.reveal, .reveal-line').forEach((el) => io.observe(el));

  // ---------- Counter animation ----------
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = el.dataset.count;
        if (target === '∞') {
          el.textContent = '∞';
        } else {
          const final = parseInt(target, 10);
          let current = 0;
          const step = Math.max(1, Math.ceil(final / 40));
          const tick = () => {
            current = Math.min(final, current + step);
            el.textContent = current;
            if (current < final) requestAnimationFrame(tick);
          };
          tick();
        }
        counterIO.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('.num').forEach((el) => counterIO.observe(el));

  // ---------- Tilt card ----------
  document.querySelectorAll('.tilt').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y / r.height) - 0.5) * -10;
      const ry = ((x / r.width) - 0.5) * 10;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
    });
  });

  // ---------- Skill card spotlight ----------
  document.querySelectorAll('.skill-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  });

  // ---------- Mobile menu ----------
  const toggle = document.getElementById('menu-toggle');
  const links = document.querySelector('.nav-links');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    })
  );

  // ---------- Footer year ----------
  document.getElementById('year').textContent = new Date().getFullYear();

  // ---------- Particle network background ----------
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let pointer = { x: -9999, y: -9999 };
  const PARTICLE_COUNT = window.innerWidth < 768 ? 35 : 80;
  const LINK_DIST = 130;

  function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.6,
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const p of particles) {
      // Pointer attraction
      const dx = pointer.x - p.x;
      const dy = pointer.y - p.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 22500) {
        const f = 0.0008;
        p.vx += dx * f;
        p.vy += dy * f;
      }
      // Damping
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0) p.x = window.innerWidth;
      if (p.x > window.innerWidth) p.x = 0;
      if (p.y < 0) p.y = window.innerHeight;
      if (p.y > window.innerHeight) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(124, 92, 255, 0.6)';
      ctx.fill();
    }

    // Connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.25;
          ctx.strokeStyle = `rgba(33, 212, 253, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener('mousemove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    pointer.x = -9999;
    pointer.y = -9999;
  });
  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  resize();
  initParticles();
  tick();

  // ---------- Parallax hero ----------
  const heroContent = document.querySelector('.hero-content');
  document.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroContent.style.transform = `translateY(${y * 0.25}px)`;
      heroContent.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.7)));
    }
  }, { passive: true });
})();
