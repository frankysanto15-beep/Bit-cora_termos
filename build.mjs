// Bitácora del Termo — generador estático (sin dependencias). Netlify ejecuta: node build.mjs → carpeta dist/
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const DIST = path.join(ROOT, 'dist');
const SITE = (process.env.URL || process.env.SITE_URL || 'https://bitacora-del-termo.netlify.app').replace(/\/$/, '');
const WA_NUM = '56945189496', WA_TXT = '+56 9 4518 9496';
const CAT = { mantencion: 'Mantención', fallas: 'Fallas', seguridad: 'Seguridad', ahorro: 'Ahorro' };
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const iso = d => { const m = /(\d+) de (\w+) de (\d{4})/.exec(d || ''); if (!m) return new Date().toISOString().slice(0, 10); return `${m[3]}-${String(MESES.indexOf(m[2]) + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}` };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = s => String(s).replace(/<[^>]+>/g, '');
const wa = t => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(t)}`;

const ARTS = fs.readdirSync(path.join(ROOT, 'articles')).filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(ROOT, 'articles', f), 'utf8')))
  .filter(a => a.status !== 'borrador')
  .map(a => ({ ...a, iso: iso(a.date) }))
  .sort((a, b) => b.iso.localeCompare(a.iso));

const WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>';
const ARROW = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const STEAM = '<svg class="steam" viewBox="0 0 28 30" aria-hidden="true"><path d="M9 26c-4-5 4-8 0-14s4-8 0-10"/><path d="M19 26c-4-5 4-8 0-14s4-8 0-10"/></svg>';

function head({ title, desc, url, type = 'website', jsonld = [] }) {
  return `<!doctype html>
<html lang="es-CL">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${type}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/static/logo.png"><meta property="og:locale" content="es_CL">
<meta name="theme-color" content="#1B2A5C">
<link rel="icon" type="image/png" href="/static/gear.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Onest:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap">
<link rel="stylesheet" href="/static/styles.css">
${jsonld.map(j => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>
<body${type === 'article' ? ' class="reading"' : ''}>`;
}
const TOPBAR = `<header class="top" id="top"><div class="wrap">
<a class="brand" href="/"><span class="chip"><img src="/static/gear.png" alt="" width="36" height="26"></span><span><b>Bitácora del Termo</b><small>por Elemental Asistencia Técnica</small></span></a>
<nav class="nav" aria-label="Categorías">${['todas', ...Object.keys(CAT)].map(c => `<a href="/${c === 'todas' ? '' : '?cat=' + c}">${c === 'todas' ? 'Todo' : CAT[c]}</a>`).join('')}</nav>
<a class="wa-pill" href="${wa('Hola Elemental, vengo de la Bitácora del Termo')}" target="_blank" rel="noopener">${WA_SVG}<span>${WA_TXT}</span></a>
</div><div class="heat" aria-hidden="true"><i id="heatBar"></i><span id="heatTxt">15 °C</span></div></header>`;
const REMIND = `<section class="remind" id="recordatorio"><div class="wrap">
<div class="reveal"><span class="eyebrow" style="color:#FF9A9E">Recordatorio de mantención</span><h2>Que no se te pase la mantención de este año</h2><p>Déjanos tus datos y armamos el mensaje para agendar por WhatsApp. Tú decides cuándo enviarlo.</p></div>
<form class="rf reveal" id="rf"><label for="rfName">Nombre<input id="rfName" required placeholder="Ej: Carolina"></label>
<div class="two"><label for="rfComuna">Comuna<input id="rfComuna" required placeholder="Ej: Ñuñoa"></label><label for="rfTipo">Tipo de termo<select id="rfTipo"><option>A muro</option><option>A piso</option><option>No estoy seguro</option></select></label></div>
<label for="rfLast">Última mantención<select id="rfLast"><option>Hace menos de un año</option><option selected>Hace más de un año</option><option>Nunca se le ha hecho</option><option>No lo sé</option></select></label>
<button type="submit">Armar mensaje para agendar</button><p class="out" id="rfOut" aria-live="polite"></p></form></div></section>`;
const FOOT = `<footer><div class="wrap"><span>© ${new Date().getFullYear()} Elemental Asistencia Técnica · Bitácora del Termo</span><span>Contenido informativo. Ante olor a quemado, chispas o fugas grandes, corta la energía y el agua y llama a un técnico.</span></div></footer>
<div class="mbar" id="mbar"><span class="lg"><img src="/static/gear.png" alt="" width="32" height="23"></span><span class="t"><b>Elemental · tu termo al día</b><span>${WA_TXT}</span></span><a class="wa-pill" href="${wa('Hola Elemental, vengo de la Bitácora del Termo')}" target="_blank" rel="noopener">${WA_SVG}<span>WhatsApp</span></a></div>
<div class="toast" id="toast" role="status"></div>
<script>window.WA_NUM='${WA_NUM}'</script><script src="/static/app.js" defer></script>
</body></html>`;

const card = (a, featured) => `<a class="card${featured ? ' featured' : ''}" href="/${a.slug}/" data-cat="${a.cat}" data-text="${esc((a.title + ' ' + a.dek + ' ' + a.keys).toLowerCase())}">${STEAM}<div class="meta"><span class="tag ${a.cat}">${CAT[a.cat]}</span><span>${a.read} min</span></div><h3>${a.title}</h3><p>${a.dek}</p><span class="go">Leer respuesta ${ARROW}</span></a>`;

function inlineAd(v) { return `<aside class="inline-ad reveal"><span class="lg"><img src="/static/gear.png" alt="" width="62" height="45"></span><div><h4>${v.t}</h4><p>${v.p}</p><div class="row"><a class="wa-pill" href="${wa(v.msg)}" target="_blank" rel="noopener">${WA_SVG}<span>Escribir a Elemental</span></a><button class="num-copy" type="button" data-copy>${WA_TXT}</button></div></div></aside>` }

function home() {
  const ld = [{ '@context': 'https://schema.org', '@type': 'Blog', name: 'Bitácora del Termo', url: SITE + '/', publisher: { '@type': 'LocalBusiness', name: 'Elemental Asistencia Técnica', telephone: WA_TXT, areaServed: 'Santiago, Chile', image: SITE + '/static/logo.png' } }];
  return head({ title: 'Bitácora del Termo · Dudas sobre termos eléctricos | Elemental', desc: 'Respuestas claras sobre termos eléctricos: mantención, fallas, consumo y seguridad. Escritas por los técnicos de Elemental Asistencia Técnica, Santiago.', url: SITE + '/', jsonld: ld }) + TOPBAR + `
<main id="home">
<section class="hero"><div class="wrap">
<div class="hero-anim"><span class="eyebrow" style="color:#FF9A9E">Dudas reales, respuestas de técnico</span>
<h1>Lo que tu termo <em>no te dice</em>, te lo explicamos acá.</h1>
<p class="lead">Guías escritas por los técnicos de Elemental, a partir de lo que vemos cada semana en casas y departamentos de Santiago. Sin tecnicismos y con la respuesta corta primero.</p>
<form class="search" id="searchForm" role="search"><input id="q" type="search" placeholder="Ej: mi termo no calienta" aria-label="Buscar una duda" autocomplete="off"><button type="submit">Buscar</button></form>
<div class="asked">${ARTS.filter(a => a.asked).slice(0, 10).map(a => `<a href="/${a.slug}/">${a.asked}</a>`).join('')}</div></div>
<div class="tank" aria-hidden="true"><canvas id="tankCanvas" width="720" height="960"></canvas><div class="readout">TEMPERATURA<b id="tempOut">58 °C</b>estanque limpio</div></div>
</div></section>
<section class="section"><div class="wrap">
<div class="sec-head"><div><span class="eyebrow">Biblioteca</span><h2>Preguntas que nos hacen todos los días</h2></div>
<div class="filters" id="filters">${['todas', ...Object.keys(CAT)].map((c, i) => `<button data-cat="${c}" aria-pressed="${i === 0}">${c === 'todas' ? 'Todo' : CAT[c]}</button>`).join('')}</div></div>
<div class="grid" id="grid">${ARTS.map((a, i) => card(a, i === 0)).join('')}<div class="empty" id="empty" hidden>No encontramos un artículo sobre eso. Escríbenos por WhatsApp al <b>${WA_TXT}</b> y te respondemos directamente.</div></div>
</div></section>
<section class="strip"><div class="wrap"><img src="/static/logo.png" alt="Elemental Asistencia Técnica" width="96" height="93"><div><h3>¿Prefieres que lo revise un técnico?</h3><p>Mantención preventiva, reparación e instalación de termos eléctricos. Técnicos calificados, visita a domicilio.</p></div>
<div class="prices"><div class="price"><small>Mantención termo a muro</small><b>$54.990</b></div><div class="price"><small>Mantención termo a piso</small><b>$74.990</b></div></div></div></section>
</main>` + REMIND + FOOT;
}

function article(a) {
  const url = `${SITE}/${a.slug}/`;
  const body = a.body.replace('<!--AD1-->', inlineAd(a.ads[0])).replace('<!--AD2-->', inlineAd(a.ads[1]));
  let n = 0; const withIds = body.replace(/<h2>/g, () => `<h2 id="s${n++}">`);
  const hs = [...withIds.matchAll(/<h2 id="(s\d+)">(.*?)<\/h2>/g)].map(m => [m[1], strip(m[2])]); if (a.faq) hs.push(['faq', 'Preguntas frecuentes']);
  const faq = a.faq ? `<h2 id="faq">Preguntas frecuentes</h2><div class="faq">${a.faq.map(([q, r]) => `<details><summary>${q}</summary><p>${r}</p></details>`).join('')}</div>` : '';
  const related = ARTS.filter(x => x.slug !== a.slug).sort((x, y) => (y.cat === a.cat) - (x.cat === a.cat)).slice(0, 3);
  const ld = [{ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: strip(a.dek), datePublished: a.iso, dateModified: a.iso, mainEntityOfPage: url, image: SITE + '/static/logo.png', author: { '@type': 'Organization', name: 'Equipo técnico Elemental' }, publisher: { '@type': 'Organization', name: 'Elemental Asistencia Técnica', logo: { '@type': 'ImageObject', url: SITE + '/static/logo.png' } } }];
  if (a.faq) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: a.faq.map(([q, r]) => ({ '@type': 'Question', name: strip(q), acceptedAnswer: { '@type': 'Answer', text: strip(r) } })) });
  const s = a.ads[0];
  return head({ title: `${a.title} | Bitácora del Termo`, desc: strip(a.quick).slice(0, 158), url, type: 'article', jsonld: ld }) + TOPBAR + `
<article class="article">
<div class="art-head"><div class="wrap"><a class="back" href="/">← Volver a la Bitácora</a><span class="tag ${a.cat}">${CAT[a.cat]}</span><h1>${a.title}</h1>
<div class="byline"><span class="av"><img src="/static/gear.png" alt="" width="28" height="20"></span><span><b>Equipo técnico Elemental</b> · <time datetime="${a.iso}">${a.date}</time> · ${a.read} min de lectura</span></div></div></div>
<div class="wrap layout"><div class="prose"><div class="quick"><span class="eyebrow">Respuesta corta</span><p>${a.quick}</p></div>${withIds}${faq}</div>
<aside class="side" aria-label="Elemental Asistencia Técnica"><div class="ad" id="sideAd"><div class="top-ad"><div class="logo-box"><img src="/static/logo.png" alt="Elemental Asistencia Técnica" width="92" height="89"></div><h4>${s.side}</h4><p>${s.sideP}</p></div>
<div class="body"><div class="gauge"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 44a24 24 0 1 1 48 0" fill="none" stroke="var(--line)" stroke-width="7" stroke-linecap="round"/><path id="gArc" d="M8 44a24 24 0 1 1 48 0" fill="none" stroke="url(#gg)" stroke-width="7" stroke-linecap="round" stroke-dasharray="113" stroke-dashoffset="113"/><defs><linearGradient id="gg"><stop offset="0" stop-color="#3B82F6"/><stop offset="1" stop-color="#E3262E"/></linearGradient></defs><line id="gNeedle" x1="32" y1="44" x2="32" y2="22" stroke="var(--fg)" stroke-width="3" stroke-linecap="round" style="transform-origin:32px 44px;transform:rotate(-90deg);transition:transform .2s"/></svg><div class="lbl">Mantención preventiva<b>desde $54.990</b></div></div>
<a class="wa-big" href="${wa(s.msg)}" target="_blank" rel="noopener">${WA_SVG}Escríbenos por WhatsApp</a><div class="phone"><span>${WA_TXT}</span><button type="button" data-copy>Copiar</button></div><p class="small">Técnicos calificados · Santiago · Respuesta el mismo día</p></div></div>
<nav class="toc" aria-label="En este artículo"><b>En este artículo</b><ol id="toc">${hs.map(([id, t]) => `<li><a href="#${id}" data-jump="${id}">${t}</a></li>`).join('')}</ol></nav></aside></div>
<section class="related"><div class="wrap"><div class="sec-head"><h2>Sigue leyendo</h2></div><div class="grid">${related.map(x => card(x)).join('')}</div></div></section>
</article>` + REMIND + FOOT;
}

fs.rmSync(DIST, { recursive: true, force: true }); fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(path.join(ROOT, 'static'), path.join(DIST, 'static'), { recursive: true });
fs.writeFileSync(path.join(DIST, 'index.html'), home());
for (const a of ARTS) { fs.mkdirSync(path.join(DIST, a.slug), { recursive: true }); fs.writeFileSync(path.join(DIST, a.slug, 'index.html'), article(a)) }
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>${SITE}/</loc><lastmod>${ARTS[0]?.iso || today}</lastmod></url>\n${ARTS.map(a => `<url><loc>${SITE}/${a.slug}/</loc><lastmod>${a.iso}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(DIST, '404.html'), head({ title: 'Página no encontrada | Bitácora del Termo', desc: 'Página no encontrada', url: SITE + '/404' }) + TOPBAR + `<main class="section"><div class="wrap"><h1>Esta página no existe</h1><p><a href="/">Volver a la Bitácora</a></p></div></main>` + FOOT);
console.log(`Bitácora generada: ${ARTS.length} artículos → ${DIST} (${SITE})`);
