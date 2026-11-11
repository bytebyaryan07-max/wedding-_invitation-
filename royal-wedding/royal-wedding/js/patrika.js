/* Builds the invitation DOM ONCE from WEDDING (js/data.js). */
(function () {
  const W = window.WEDDING, P = W.patrika;
  const $ = id => document.getElementById(id);

  const row = ([a, b]) => `<div class="p-row"><span>${a}</span><span>${b}</span></div>`;
  const person = (x) => `
    <div class="p-person">
      <span class="p-label">${x.label}</span>
      <div class="p-name"><small>${x.line1}</small>${x.name}</div>
      <p class="p-line">${x.father}</p><p class="p-line">${x.address}</p><p class="p-line">${x.suffix}</p>
    </div>`;
  const rule = '<div class="p-rule">❖</div>';

  function buildPatrika() {
    $('patrika').className = 'sheet-scroll patrika';
    $('patrika').innerHTML = `
      <p class="p-head">${P.header}</p>
      <img class="p-ganesh" src="assets/images/ganesh.jpg" alt="श्री गणेश">
      <p class="p-intro">${P.intro}</p>
      ${W.showPhotoInPatrika ? '<div class="p-photo"><img src="assets/images/couple.jpg" alt="सुहास आणि कोमल"></div>' : ''}
      ${person(P.groom)}
      ${person(P.bride)}
      <h2 class="p-title">${P.title}</h2>
      <p class="p-miti">${P.miti}</p>
      ${rule}
      <div class="p-box"><h3>${P.haldi.title}</h3><p>${P.haldi.text}</p></div>
      <div class="p-box"><h3>${P.venue.title}</h3><strong>${P.venue.name}</strong>
        ${P.venue.lines.map(l => `<p>${l}</p>`).join('')}</div>
      <h3 class="p-sub">${P.humbleTitle}</h3>
      ${P.humble.map(row).join('')}
      <p class="p-req">${P.requestLine}</p>
      ${P.family.map(row).join('')}
      <div class="p-elders">${P.elders.map(e => `<span>${e}</span>`).join('')}</div>
      <p class="p-all">${P.allFamily}</p>
      ${rule}
      <div class="p-box"><h3>${P.organisers.title}</h3><p>${P.organisers.text}</p></div>
      <div class="p-box"><h3>${P.kids.title}</h3><p>${P.kids.text.replace(/,/g, ',<wbr>')}</p></div>
      <img class="p-proc" src="assets/images/procession.jpg" alt="">`;
  }

  function addCorners() {
    ['c-tl', 'c-tr', 'c-bl', 'c-br'].forEach(c => {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('class', 'corner ' + c);
      s.innerHTML = '<use href="#corner"/>';
      $('sheet').appendChild(s);
    });
  }

  /* Each flap is a triangle drawn as SVG so it has a gold trim on both sides */
  function buildFlaps() {
    const tri = {
      flapT: '0,0 100,0 50,100', flapB: '50,0 100,100 0,100',
      flapL: '0,0 100,50 0,100', flapR: '100,0 100,100 0,50'
    };
    for (const id in tri) {
      const mk = (fill) => `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polygon points="${tri[id]}" style="fill:${fill}" stroke="#D4AF5A" stroke-width="2.4" vector-effect="non-scaling-stroke"/></svg>`;
      const f = $(id);
      f.querySelector('.front').innerHTML = mk(id === 'flapT' || id === 'flapB' ? '#5a1226' : '#4A0B18');
      f.querySelector('.back').innerHTML = mk('#7a1a2c');
    }
  }

  /* Fold panels show a copy of the Patrika so the unfolding paper carries
     the real text. Built once; the copy is hidden from screen readers. */
  function buildFoldCopies() {
    ['foldTop', 'foldBot'].forEach(id => {
      const c = $('sheet').cloneNode(true);
      c.removeAttribute('id');
      c.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
      c.querySelector('.sheet-scroll').removeAttribute('tabindex');
      c.setAttribute('aria-hidden', 'true');
      $(id).querySelector('.copy').appendChild(c);
    });
  }

  $('coverNames').textContent = W.names.groomMr + ' ❖ ' + W.names.brideMr;
  $('coverDate').textContent = W.dateMr;
  buildPatrika(); addCorners(); buildFlaps(); buildFoldCopies();
})();