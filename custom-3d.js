(() => {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'fh3d-bg';
  const style = canvas.style;
  style.position = 'fixed';
  style.left = '0';
  style.top = '0';
  style.width = '100%';
  style.height = '100%';
  style.zIndex = '0';
  style.pointerEvents = 'none';
  style.opacity = '0.9';
  style.filter = 'saturate(1.1)';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // If reduced motion, keep it static
  if (prefersReduced) {
    drawStatic(1);
    return;
  }

  // Ensure content sits above canvas
  document.querySelectorAll('main, nav, footer').forEach(el => {
    el.style.position = el.style.position || 'relative';
    el.style.zIndex = 2;
  });

  let w = 0, h = 0, dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const resize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
  };
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // 3D-ish particle field with perspective
  const rand = (a, b) => a + Math.random() * (b - a);
  const particles = [];
  const COUNT = Math.round(Math.min(170, Math.max(80, (w * h) / 12000)));

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: rand(-1, 1),
      y: rand(-1, 1),
      z: rand(0.2, 1),
      r: rand(0.6, 2.2),
      vx: rand(-0.0008, 0.0008),
      vy: rand(-0.0008, 0.0008),
      vz: rand(-0.0006, 0.0006)
    });
  }

  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  const onMove = (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('mousemove', onMove, { passive: true });

  // Subtle parallax using scroll
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY || 0;
  }, { passive: true });

  function clear() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function project(px, py, pz, t) {
    // Perspective
    const camZ = 1.25;
    const z = pz + camZ + Math.sin(t * 0.0008 + px * 3) * 0.06;
    const persp = 1 / z;
    const cx = canvas.width * 0.5;
    const cy = canvas.height * 0.52;
    return {
      x: cx + px * persp * canvas.width * 0.42,
      y: cy + py * persp * canvas.height * 0.42,
      s: persp
    };
  }

  function drawStatic(mult = 1) {
    clear();
    const t = performance.now();
    ctx.globalCompositeOperation = 'lighter';

    for (const p of particles) {
      const pt = project(p.x, p.y, p.z, t);
      const alpha = Math.max(0, (1.05 - p.z) * 0.7);
      const size = (p.r * pt.s) * 1.6;

      ctx.beginPath();
      ctx.fillStyle = `rgba(200,126,58,${0.10 * alpha * mult})`;
      ctx.arc(pt.x, pt.y, Math.max(1, size), 0, Math.PI * 2);
      ctx.fill();

      // glow
      ctx.beginPath();
      ctx.fillStyle = `rgba(224,122,58,${0.05 * alpha * mult})`;
      ctx.arc(pt.x, pt.y, Math.max(1, size * 1.7), 0, Math.PI * 2);
      ctx.fill();
    }

    // A few connecting lines for depth
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dz = Math.abs(a.z - b.z);
        if (dz > 0.28) continue;

        const pa = project(a.x, a.y, a.z, t);
        const pb = project(b.x, b.y, b.z, t);
        const dx = pa.x - pb.x;
        const dy = pa.y - pb.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 170) continue;

        const strength = (1 - dist / 170) * (0.7 - dz);
        ctx.strokeStyle = `rgba(200,126,58,${0.06 * Math.max(0, strength)})`;
        ctx.lineWidth = 1 * (1 + strength);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  function tick(t) {
    // smooth mouse
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    clear();
    ctx.globalCompositeOperation = 'lighter';

    // background wash
    const grd = ctx.createRadialGradient(
      canvas.width * (0.5 + mouseX * 0.08),
      canvas.height * (0.5 + mouseY * 0.08),
      0,
      canvas.width * 0.5,
      canvas.height * 0.5,
      Math.max(canvas.width, canvas.height) * 0.7
    );
    grd.addColorStop(0, 'rgba(200,126,58,0.10)');
    grd.addColorStop(0.35, 'rgba(224,122,58,0.05)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const time = t;
    const scrollShift = (scrollY % 900) / 900;

    // update and draw particles
    for (const p of particles) {
      p.x += p.vx + mouseX * 0.000015;
      p.y += p.vy + mouseY * 0.000015;
      p.z += p.vz + Math.sin(time * 0.0003 + p.x * 2) * 0.00008;

      // wrap
      if (p.x > 1.2) p.x = -1.2;
      if (p.x < -1.2) p.x = 1.2;
      if (p.y > 1.2) p.y = -1.2;
      if (p.y < -1.2) p.y = 1.2;
      if (p.z < 0.18) p.z = 0.98;
      if (p.z > 1.05) p.z = 0.22;

      const px = p.x + mouseX * (0.15 + p.z * 0.08);
      const py = p.y + mouseY * (0.15 + p.z * 0.08) + (scrollShift - 0.5) * 0.03;
      const pt = project(px, py, p.z, time);

      const alpha = Math.max(0, (1.06 - p.z) * 0.9);
      const size = (p.r * pt.s) * 2.1;

      ctx.beginPath();
      ctx.fillStyle = `rgba(200,126,58,${0.08 * alpha})`;
      ctx.arc(pt.x, pt.y, Math.max(1.2, size), 0, Math.PI * 2);
      ctx.fill();

      // tiny shine ring
      if (p.z < 0.55) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(240,190,120,${0.10 * alpha})`;
        ctx.lineWidth = 1;
        ctx.arc(pt.x, pt.y, Math.max(1.5, size * 1.2), 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // connections
    for (let i = 0; i < particles.length; i++) {
      if (i % 2 === 1) continue;
      for (let j = i + 1; j < particles.length; j += 2) {
        const a = particles[i], b = particles[j];
        const dz = Math.abs(a.z - b.z);
        if (dz > 0.26) continue;

        const pa = project(a.x + mouseX * 0.12, a.y + mouseY * 0.12, a.z, time);
        const pb = project(b.x + mouseX * 0.12, b.y + mouseY * 0.12, b.z, time);
        const dist = Math.hypot(pa.x - pb.x, pa.y - pb.y);
        if (dist > 160) continue;

        const strength = (1 - dist / 160) * (0.75 - dz);
        ctx.strokeStyle = `rgba(200,126,58,${0.05 * Math.max(0, strength)})`;
        ctx.lineWidth = 0.7 + strength;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
    }

    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  // Custom UX: smooth active nav highlight
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(a => {
        const href = a.getAttribute('href');
        a.style.borderBottomColor = href === `#${id}` ? '#c87e3a' : 'transparent';
      });
    });
  }, { root: null, threshold: 0.45 });

  sections.forEach(s => obs.observe(s));

  // Custom UX: instant "scroll to top" on logo click (optional)
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Custom UX: keyboard shortcut to open chatbot if present
  // (works with existing scritpt.js or fashionhut-complete.js chatbot; best-effort)
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() !== 'k') return;
    if (!(e.ctrlKey || e.metaKey)) return;

    const toggle = document.getElementById('chatbot-toggle');
    if (toggle) toggle.click();
  });
})();

