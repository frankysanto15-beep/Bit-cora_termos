(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const WA = window.WA_NUM || '56945189496';
  const waLink = t => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  // toast + copy
  function toast(m) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2200) }
  document.addEventListener('click', e => {
    if (e.target.closest('[data-copy]')) { const n = '+56 9 4518 9496'; try { navigator.clipboard.writeText(n).then(() => toast('Número copiado'), () => toast(n)) } catch (_) { toast(n) } }
    const j = e.target.closest('[data-jump]'); if (j) { e.preventDefault(); const el = document.getElementById(j.dataset.jump); el && el.scrollIntoView({ behavior: 'smooth' }) }
  });
  // home: filters + search over static cards
  const grid = $('#grid');
  if (grid) {
    let cat = new URLSearchParams(location.search).get('cat') || 'todas', q = '';
    const apply = () => { const words = norm(q.trim()).split(/\s+/).filter(Boolean); let shown = 0;
      $$('#grid .card').forEach(c => { const ok = (cat === 'todas' || c.dataset.cat === cat) && words.every(w => norm(c.dataset.text).includes(w)); c.hidden = !ok; if (ok) shown++ });
      $('#empty').hidden = shown > 0; $$('#filters button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
      $$('.nav a').forEach(a => a.setAttribute('aria-current', String((a.getAttribute('href').split('=')[1] || 'todas') === cat))) };
    $$('#filters button').forEach(b => b.addEventListener('click', () => { cat = b.dataset.cat; apply() }));
    $('#q').addEventListener('input', e => { q = e.target.value; apply() });
    $('#searchForm').addEventListener('submit', e => { e.preventDefault(); q = $('#q').value; cat = 'todas'; apply(); grid.scrollIntoView({ behavior: 'smooth' }) });
    apply(); if (cat !== 'todas') grid.scrollIntoView();
  }
  // scroll: temperature bar, gauge, toc, mobile bar, ad pulse
  let pulsed = false;
  function onScroll() { const el = document.documentElement, max = el.scrollHeight - innerHeight, p = max > 0 ? Math.min(1, scrollY / max) : 0;
    const bar = $('#heatBar'); if (bar) { bar.style.width = (p * 100) + '%'; $('#heatTxt').textContent = Math.round(15 + p * 45) + ' °C' }
    const arc = $('#gArc'); if (arc) { arc.style.strokeDashoffset = 113 * (1 - p); $('#gNeedle').style.transform = `rotate(${-90 + p * 180}deg)` }
    const mb = $('#mbar'); mb && mb.classList.toggle('show', scrollY > 420);
    if ($('#toc')) { let on = null; $$('.prose h2').forEach(h => { if (h.getBoundingClientRect().top < 160) on = h.id }); $$('#toc a').forEach(a => a.classList.toggle('on', a.dataset.jump === on));
      if (p > .45 && !pulsed) { pulsed = true; const ad = $('#sideAd'); if (ad) { ad.classList.add('pulse') } } } }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  // reveal (content visible by default; animates only when scrolled into view)
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(el => { if (el.getBoundingClientRect().top > innerHeight) io.observe(el) }) }
  // reminder form → WhatsApp message
  const rf = $('#rf'); rf && rf.addEventListener('submit', e => { e.preventDefault(); const msg = `Hola Elemental, soy ${$('#rfName').value.trim()}, de ${$('#rfComuna').value.trim()}. Quiero agendar la mantención de mi termo (${$('#rfTipo').value.toLowerCase()}). Última mantención: ${$('#rfLast').value.toLowerCase()}.`;
    $('#rfOut').innerHTML = `Mensaje listo. <a href="${waLink(msg)}" target="_blank" rel="noopener">Abrir WhatsApp y enviarlo</a> o escríbenos al +56 9 4518 9496.` });
  // hero tank animation
  const c = $('#tankCanvas'); if (c) { const x = c.getContext('2d'), W = c.width, H = c.height, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bubbles = Array.from({ length: 46 }, () => ({ x: Math.random(), y: Math.random(), r: 3 + Math.random() * 9, s: .3 + Math.random() * .9 }));
    const rr = (X, Y, w, h, r) => { x.beginPath(); x.roundRect(X, Y, w, h, r) };
    function draw(t) { const k = .5 - .5 * Math.cos(t / 9000 * Math.PI * 2); x.clearRect(0, 0, W, H);
      x.fillStyle = 'rgba(0,0,0,.25)'; x.beginPath(); x.ellipse(W / 2 + 18, H - 40, 230, 26, 0, 0, 7); x.fill();
      rr(110, 50, 500, 820, 230); const sg = x.createLinearGradient(110, 0, 610, 0); sg.addColorStop(0, '#DCE3EE'); sg.addColorStop(.3, '#FFFFFF'); sg.addColorStop(.8, '#E7ECF4'); sg.addColorStop(1, '#B9C3D3'); x.fillStyle = sg; x.fill();
      x.save(); rr(170, 120, 380, 680, 180); x.clip();
      const mix = (p, q) => `rgb(${p.map((v, i) => Math.round(v + (q[i] - v) * k)).join(',')})`; const wg = x.createLinearGradient(0, 120, 0, 800); wg.addColorStop(0, mix([92, 160, 255], [255, 128, 96])); wg.addColorStop(1, mix([30, 84, 200], [196, 40, 60])); x.fillStyle = wg; x.fillRect(170, 120, 380, 680);
      for (const b of bubbles) { if (!reduce) { b.y -= b.s * (.0015 + k * .004); if (b.y < 0) { b.y = 1; b.x = Math.random() } } x.globalAlpha = .25 + k * .5; x.strokeStyle = '#fff'; x.lineWidth = 2; x.beginPath(); x.arc(190 + b.x * 340, 140 + b.y * 640, b.r * (.6 + k * .6), 0, 7); x.stroke() } x.globalAlpha = 1;
      rr(420, 140, 26, 520, 12); x.fillStyle = '#C9D3E0'; x.fill();
      const glow = .25 + .75 * k * (.85 + .15 * Math.sin(t / 180)); x.lineCap = 'round'; x.strokeStyle = `rgba(255,${120 + 60 * glow},60,${.25 * glow})`; x.lineWidth = 70; x.beginPath(); x.moveTo(280, 800); x.lineTo(280, 520); x.arc(340, 520, 60, Math.PI, 0); x.lineTo(400, 800); x.stroke(); x.strokeStyle = `rgb(${150 + 105 * glow},${70 + 80 * glow},50)`; x.lineWidth = 26; x.stroke();
      x.restore(); rr(170, 120, 380, 680, 180); x.lineWidth = 10; x.strokeStyle = '#1B2A5C'; x.stroke();
      const out = $('#tempOut'), temp = Math.round(15 + 45 * k) + ' °C'; if (out && out.textContent !== temp) out.textContent = temp;
      x.fillStyle = '#C9773E'; x.fillRect(250, 868, 30, 70); x.fillRect(440, 868, 30, 70); x.fillStyle = '#E3262E'; rr(462, 890, 40, 26, 8); x.fill();
      if (!reduce) requestAnimationFrame(draw) }
    requestAnimationFrame(draw) }
})();
