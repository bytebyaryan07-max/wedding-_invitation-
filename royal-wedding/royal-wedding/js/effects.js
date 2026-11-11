/* Soft floating golden dust (canvas). Disabled for reduced-motion users. */
(function () {
  const cv = document.getElementById('dust');
  if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = cv.getContext('2d');
  let w = 0, h = 0, dpr = 1, raf = 0, parts = [];

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = w < 600 ? 26 : 46;                 // fewer particles on phones
    parts = Array.from({ length: n }, spawn);
  }
  function spawn() {
    return { x: Math.random() * w, y: Math.random() * h, r: 0.8 + Math.random() * 2.2,
             vy: 0.12 + Math.random() * 0.4, vx: (Math.random() - 0.5) * 0.25,
             t: Math.random() * 6.28, s: 0.01 + Math.random() * 0.03 };
  }
  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.y -= p.vy; p.x += p.vx + Math.sin(p.t) * 0.15; p.t += p.s;
      if (p.y < -8) { p.y = h + 8; p.x = Math.random() * w; }
      const a = 0.35 + 0.45 * Math.abs(Math.sin(p.t));
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, 'rgba(255,230,160,' + a + ')');
      g.addColorStop(1, 'rgba(212,175,90,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.2832); ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }
  addEventListener('resize', size);
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(frame);
  });
  size(); raf = requestAnimationFrame(frame);
})();