/* main.js – connects the buttons to the card controller (card.js) */
(function () {
  const $ = id => document.getElementById(id);
  const W = window.WEDDING;
  const openBtn = $('openBtn'), welcome = $('welcome');
  const closeBtn = $('closeBtn'), replayBtn = $('replayBtn');
  const musicBtn = $('musicBtn'), shareBtn = $('shareBtn'), music = $('music');
  let toastTimer = 0, hasOpened = false, muted = false;

  function toast(msg) {
    const t = $('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 4200);
  }

  if (!window.gsap) {
    toast('Animation library could not load. Please check your internet connection and refresh.');
    openBtn.disabled = true; return;
  }

  /* ---- Show / hide controls according to the card state ---- */
  Invitation.onState = function (s) {
    const inPopup = s !== 'hidden';
    welcome.classList.toggle('away', inPopup);
    closeBtn.hidden = replayBtn.hidden = !inPopup;
    openBtn.disabled = inPopup;
    if (s === 'hidden' && hasOpened) openBtn.firstElementChild.textContent = 'REOPEN INVITATION';
  };

  openBtn.addEventListener('click', () => {
    hasOpened = true;
    Invitation.open();
    startMusic();                       // music only starts after a user click
  });
  closeBtn.addEventListener('click', () => Invitation.close());
  replayBtn.addEventListener('click', () => Invitation.replay());

  /* ---- Music (optional file: assets/audio/wedding-music.mp3) ---- */
  function icon() { musicBtn.classList.toggle('off', muted); musicBtn.setAttribute('aria-pressed', String(!muted)); }
  function startMusic() {
    if (!music.paused || muted) return;
    music.volume = 0.5;
    const p = music.play();
    if (p && p.then) p.then(() => { musicBtn.hidden = false; icon(); }).catch(() => { /* no audio file – stays hidden */ });
  }
  musicBtn.addEventListener('click', () => {
    muted = !muted;
    if (muted) music.pause(); else music.play().catch(() => {});
    icon();
  });

  /* ---- WhatsApp share ---- */
  shareBtn.addEventListener('click', () => {
    const url = W.siteUrl || location.href;
    const local = /^(file:|http:\/\/(localhost|127\.|192\.168\.|10\.))/i.test(url) || location.protocol === 'file:';
    if (local) toast('This is a local address. Deploy the site and set siteUrl in js/data.js so guests can open the link.');
    const text = W.shareText + '\n' + url;
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });
})();