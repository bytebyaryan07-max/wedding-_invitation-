/* ==========================================================
   card.js – the whole 3D card experience (GSAP timelines).
   States:  hidden → entering → closed → opening → open
            any state → closing → hidden
   One timeline (tl) is alive at a time; it is killed before a
   new one starts, so animations never fight each other.
   ========================================================== */
(function () {
  const $ = id => document.getElementById(id);
  const el = {
    popup: $('popup'), dim: $('popupDim'), card: $('card'), cover: $('cover'),
    shade: document.querySelector('.cover .shade'), seal: $('seal'),
    invite: $('invite'), sheet: $('sheet'), patrika: $('patrika'),
    foldT: $('foldTop'), foldB: $('foldBot'),
    fl: $('flapL'), fr: $('flapR'), ft: $('flapT'), fb: $('flapB')
  };
  const FOLDED = 'inset(33.3334% 0% 33.3334% 0%)';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let state = 'hidden', tl = null;

  const api = window.Invitation = {
    get state() { return state; },
    onState: null, open: openPopup, close: closePopup, replay: replay
  };
  function setState(s) { state = s; if (api.onState) api.onState(s); }
  function run(t) { tl = t; if (reduce) t.timeScale(6); return t; }   // reduced motion = very quick

  /* Put every animated piece back to its "closed card" starting pose */
  function resetCard() {
    if (tl) { tl.kill(); tl = null; }
    gsap.killTweensOf(Object.values(el));
    gsap.set(el.card, { x: 0, y: 0, z: 0, scale: 1, rotationX: 0, rotationY: 0, opacity: 0 });
    gsap.set(el.cover, { rotationY: 0, z: 12, autoAlpha: 1 });
    gsap.set(el.shade, { opacity: 0 });
    gsap.set(el.seal, { z: 9, scale: 1, rotation: 0, autoAlpha: 1 });
    gsap.set([el.ft, el.fb], { z: 6, rotationX: 0, autoAlpha: 1 });
    gsap.set([el.fl, el.fr], { z: 4, rotationY: 0, autoAlpha: 1 });
    gsap.set(el.invite, { z: 1, yPercent: 16, scale: 0.92 });
    gsap.set(el.foldT, { z: 3, rotationX: -180, autoAlpha: 1 });
    gsap.set(el.foldB, { z: 4, rotationX: 180, autoAlpha: 1 });
    el.sheet.style.clipPath = FOLDED;
    el.patrika.classList.remove('live');
    el.patrika.scrollTop = 0;
    el.card.classList.remove('live');
    el.card.setAttribute('role', 'button');
    el.card.setAttribute('tabindex', '0');
    el.card.setAttribute('aria-label', 'Tap to open the invitation');
  }

  /* SCREEN 2 – popup entrance: small → moves up and toward the viewer → settles */
  function enter(autoOpen) {
    resetCard();
    el.popup.hidden = false;
    gsap.set(el.dim, { opacity: 0 });
    gsap.set(el.card, { opacity: 0, scale: 0.45, y: 120, z: -280, rotationX: 26, rotationY: -22 });
    setState('entering');
    const t = gsap.timeline({
      onComplete() {
        setState('closed');
        if (autoOpen) openCard(); else el.card.focus({ preventScroll: true });
      }
    });
    t.to(el.dim, { opacity: 1, duration: 0.5, ease: 'power1.out' }, 0);
    t.to(el.card, { opacity: 1, duration: 0.35, ease: 'power1.out' }, 0);
    t.to(el.card, { scale: 1, y: 0, z: 0, rotationX: 6, rotationY: -5, duration: 1.15, ease: 'power3.out' }, 0);
    run(t);
  }

  /* SCREEN 3 – the physical opening, ONE coordinated timeline */
  function buildOpen() {
    const t = gsap.timeline({ onComplete: finishOpen });
    // 1. card lifts, moves to the camera, gentle tilt
    t.to(el.card, { y: -10, z: 70, rotationX: 7, rotationY: 14, duration: 0.9, ease: 'power2.out' }, 0);
    // 2. front cover swings on its left hinge; its face darkens as it turns
    t.to(el.cover, { rotationY: -180, duration: 1.6, ease: 'power2.inOut' }, 0.5);
    t.to(el.shade, { opacity: 0.6, duration: 0.8, ease: 'power1.in' }, 0.5);
    t.to(el.cover, { autoAlpha: 0, duration: 0.5, ease: 'power1.out' }, 2.15);
    // 3. the gold seal lifts away
    t.to(el.seal, { scale: 1.25, rotation: 12, duration: 0.35, ease: 'power2.out' }, 1.95);
    t.to(el.seal, { scale: 0, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 2.3);
    // 4. four flaps, each around its own hinge
    t.to(el.fl, { rotationY: -180, duration: 1.1, ease: 'power2.inOut' }, 2.6);
    t.to(el.fr, { rotationY: 180, duration: 1.1, ease: 'power2.inOut' }, 2.75);
    t.to(el.ft, { rotationX: 180, duration: 1.1, ease: 'power2.inOut' }, 2.9);
    t.to(el.fb, { rotationX: -180, duration: 1.1, ease: 'power2.inOut' }, 3.05);
    // 5. folded invitation slides out of the envelope toward the viewer
    t.to(el.invite, { yPercent: -2, scale: 1.04, z: 60, duration: 1.2, ease: 'power2.out' }, 3.7);
    // 6. it unfolds: top panel, then bottom panel
    t.to(el.foldT, { rotationX: 0, duration: 1.2, ease: 'power2.inOut' }, 5.0);
    t.to(el.foldB, { rotationX: 0, duration: 1.2, ease: 'power2.inOut' }, 5.5);
    t.to(el.invite, { scale: 1, yPercent: 0, z: 20, duration: 1.2, ease: 'power2.inOut' }, 5.4);
    // card straightens so the Patrika is flat and readable; flaps fade away
    t.to(el.card, { y: 0, z: 0, rotationX: 0, rotationY: 0, duration: 1.2, ease: 'power2.inOut' }, 5.4);
    t.to([el.fl, el.fr, el.ft, el.fb], { autoAlpha: 0, duration: 0.5 }, 6.5);
    return t;
  }

  function finishOpen() {
    // The unfolded panels already show the exact text; swap in the real scrollable sheet
    el.sheet.style.clipPath = 'none';
    gsap.set([el.foldT, el.foldB], { autoAlpha: 0 });
    el.patrika.classList.add('live');
    el.card.classList.add('live');
    el.card.removeAttribute('tabindex');
    el.card.setAttribute('role', 'group');
    el.card.setAttribute('aria-label', 'Wedding invitation');
    setState('open');
    el.patrika.focus({ preventScroll: true });
  }

  function openCard() {
    if (state !== 'closed') return;           // ignore repeat clicks
    setState('opening');
    run(buildOpen());
  }

  function openPopup() { if (state === 'hidden') enter(false); }

  function closePopup() {
    if (state === 'hidden' || state === 'closing') return;
    if (tl) tl.kill();
    setState('closing');
    const t = gsap.timeline({
      onComplete() {
        el.popup.hidden = true;
        resetCard();
        gsap.set(el.dim, { opacity: 0 });
        setState('hidden');
      }
    });
    t.to(el.card, { opacity: 0, scale: 0.6, y: 70, z: -220, rotationX: 16, duration: 0.5, ease: 'power2.in' }, 0);
    t.to(el.dim, { opacity: 0, duration: 0.45 }, 0.05);
    run(t);
  }

  /* Replay: back to the closed card, then the full opening again (no reload) */
  function replay() {
    if (state === 'hidden' || state === 'closing' || state === 'entering') return;
    enter(true);
  }

  // Wire the card ONCE (never inside open/replay, so no duplicate listeners)
  el.card.addEventListener('click', openCard);
  el.card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });

  resetCard();
})();