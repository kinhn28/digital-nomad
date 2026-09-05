import { BRAND, C } from './brand.mjs';
import { DECK } from './slides.mjs';

const W = 1080, H = 1350, PAD = 72;

// {강조} 문법 → span
const hl = (s, cls = 'hl') =>
  s.replace(/\{([^}]+)\}/g, `<span class="${cls}">$1</span>`);

const CSS = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#DCD3CA; font-family:'Noto Sans KR',sans-serif; -webkit-font-smoothing:antialiased; }
  .slide { width:${W}px; height:${H}px; position:relative; overflow:hidden;
           display:flex; flex-direction:column; padding:${PAD}px; }

  .wm { position:absolute; left:0; right:0; text-align:center; font-size:25px; font-weight:800;
        letter-spacing:.26em; }
  .wm.top { top:52px; color:rgba(255,255,255,.55); }
  .wm.bottom { bottom:44px; color:#CDBFB4; }

  /* ───────── 커버 ───────── */
  .cover { background:
      radial-gradient(90% 55% at 74% 26%, rgba(255,164,96,.26) 0%, transparent 62%),
      linear-gradient(160deg, ${C.darkA} 0%, ${C.darkB} 78%); }
  .cover .photo { position:absolute; inset:0; background-size:cover; background-position:center; }
  .cover .scrim { position:absolute; inset:0;
    background:linear-gradient(to bottom, rgba(0,0,0,.25) 0%, rgba(0,0,0,0) 35%,
                                rgba(0,0,0,.72) 68%, rgba(0,0,0,.92) 100%); }
  .cover .deco { position:absolute; right:-30px; top:250px; font-size:400px; line-height:1;
                 opacity:.22; transform:rotate(-12deg);
                 filter:drop-shadow(0 0 90px rgba(255,170,110,.35)); }
  .cover .deco.sm { right:auto; left:60px; top:180px; font-size:150px; opacity:.13;
                    transform:rotate(14deg); filter:none; }
  .cover .block { margin-top:auto; position:relative; }
  .cover .wm { z-index:2; }
  .chip { display:inline-flex; align-items:center; gap:14px; font-size:29px; font-weight:800;
          color:#fff; }
  .chip::before { content:''; width:7px; height:31px; border-radius:4px; background:${C.coral}; }
  .cover h1 { margin-top:26px; font-size:92px; font-weight:900; line-height:1.24;
              letter-spacing:-.04em; color:#fff; }
  .cover .hl { color:${C.lemon}; }
  .cover .foot { margin-top:26px; font-size:27px; font-weight:700; color:rgba(255,255,255,.62); }

  /* ───────── 내부 ───────── */
  .body { color:${C.ink};
          background-color:${C.paper};
          background-image:radial-gradient(${C.line} 2px, transparent 2px);
          background-size:46px 46px; }

  .head { display:flex; align-items:center; gap:16px; }
  .badge { background:${C.coral}; color:#fff; font-size:27px; font-weight:800;
           padding:13px 28px; border-radius:999px; }
  .pill { margin-left:auto; background:${C.lemon}; color:${C.ink}; font-size:25px; font-weight:800;
          padding:13px 26px; border-radius:999px; }

  .body h2 { margin-top:34px; font-size:66px; font-weight:900; line-height:1.28;
             letter-spacing:-.04em; }
  .body .hl { color:${C.coral}; }

  .mods { margin-top:44px; margin-bottom:70px; flex:1; display:flex; flex-direction:column;
          justify-content:center; gap:34px; }

  .mtitle { font-size:26px; font-weight:800; color:${C.sub}; margin-bottom:20px; }

  .checks { display:flex; flex-direction:column; gap:16px; }
  .check { display:flex; align-items:center; gap:22px; background:#fff; border:2px solid ${C.line};
           border-radius:26px; padding:34px 32px; box-shadow:0 8px 18px rgba(90,60,40,.05); }
  .check .box { flex:none; width:44px; height:44px; border-radius:14px; background:${C.coral};
                color:#fff; font-size:26px; font-weight:900;
                display:flex; align-items:center; justify-content:center; }
  .check .tx { font-size:34px; font-weight:800; letter-spacing:-.02em; }

  .list { background:#fff; border:2px solid ${C.line}; border-radius:28px; padding:8px 34px;
          box-shadow:0 8px 18px rgba(90,60,40,.05); }
  .row { padding:34px 0; border-bottom:2px solid ${C.line}; }
  .row:last-child { border-bottom:0; }
  .row .l { font-size:25px; font-weight:700; color:${C.sub}; }
  .row .v { font-size:40px; font-weight:800; letter-spacing:-.03em; margin-top:8px; }

  .steps { display:flex; gap:18px; }
  .step { flex:1; background:#fff; border:2px solid ${C.line}; border-radius:26px; padding:36px 28px;
          box-shadow:0 8px 18px rgba(90,60,40,.05); }
  .step .n { font-size:23px; font-weight:900; color:${C.coral}; letter-spacing:.12em; }
  .step .t { margin-top:16px; font-size:31px; font-weight:800; line-height:1.35; letter-spacing:-.02em; }

  .note { background:${C.soft}; border-radius:26px; padding:34px 36px;
          font-size:30px; font-weight:700; line-height:1.5; color:#6B5F58; }
  .note .hl { color:${C.ink}; font-weight:900; }

  /* ───────── CTA ───────── */
  .cta { background:${C.coral}; color:#fff; justify-content:center; }
  .cta .mark { font-size:150px; line-height:1; }
  .cta h2 { margin-top:36px; font-size:82px; font-weight:900; line-height:1.24; letter-spacing:-.04em; }
  .cta .sub { margin-top:26px; font-size:31px; font-weight:700; color:rgba(255,255,255,.85); }
  .cta .card { margin-top:56px; background:#fff; color:${C.ink}; border-radius:30px;
               padding:34px 38px; display:flex; align-items:center; gap:20px; }
  .cta .card .name { font-size:38px; font-weight:900; letter-spacing:-.03em; }
  .cta .card .tag { font-size:25px; font-weight:700; color:${C.sub}; margin-top:6px; }
  .cta .card .go { margin-left:auto; font-size:27px; font-weight:900; color:${C.coral}; }
  .cta .wm { color:rgba(255,255,255,.6); }
`;

const module = (m) => {
  if (m.type === 'checks')
    return `<div>${m.title ? `<div class="mtitle">${m.title}</div>` : ''}
      <div class="checks">${m.items
        .map((t) => `<div class="check"><div class="box">✓</div><div class="tx">${t}</div></div>`)
        .join('')}</div></div>`;
  if (m.type === 'list')
    return `<div class="list">${m.items
      .map(([l, v]) => `<div class="row"><div class="l">${l}</div><div class="v">${v}</div></div>`)
      .join('')}</div>`;
  if (m.type === 'steps')
    return `<div class="steps">${m.items
      .map(([a, b], i) => `<div class="step"><div class="n">STEP ${i + 1}</div>
        <div class="t">${a}<br>${b}</div></div>`)
      .join('')}</div>`;
  if (m.type === 'note') return `<div class="note">${hl(m.text)}</div>`;
  return '';
};

const cover = (c) => `<section class="slide cover">
  <div class="wm top">${BRAND.handle.toUpperCase()}</div>
  ${c.bgImage ? `<div class="photo" style="background-image:url('${c.bgImage}')"></div>` : ''}
  ${c.bgImage ? '' : `<div class="deco">${c.deco}</div><div class="deco sm">${c.deco}</div>`}
  <div class="scrim"></div>
  <div class="block">
    <div class="chip">${c.category}</div>
    <h1>${c.headline.map((l) => hl(l)).join('<br>')}</h1>
    <div class="foot">${c.foot}</div>
  </div>
</section>`;

const content = (s) => `<section class="slide body">
  <div class="head">
    <div class="badge">${s.badge}</div>
    ${s.pill ? `<div class="pill">${s.pill}</div>` : ''}
  </div>
  <h2>${s.headline.map((l) => hl(l)).join('<br>')}</h2>
  <div class="mods">${s.modules.map(module).join('')}</div>
  <div class="wm bottom">${BRAND.handle.toUpperCase()}</div>
</section>`;

const cta = (t) => `<section class="slide cta">
  <div class="mark">🍼</div>
  <h2>${t.headline.map((l) => hl(l)).join('<br>')}</h2>
  <div class="sub">${t.sub}</div>
  <div class="card">
    <div><div class="name">${BRAND.name}</div><div class="tag">${BRAND.tagline}</div></div>
    <div class="go">${BRAND.handle}</div>
  </div>
  <div class="wm bottom">SAVE · SHARE</div>
</section>`;

export function buildHtml() {
  const all = [cover(DECK.cover), ...DECK.slides.map(content), cta(DECK.cta)];
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
    <style>${CSS}</style></head><body>${all.join('')}</body></html>`;
}

export const NAMES = [
  '01-cover',
  ...DECK.slides.map((_, i) => `0${i + 2}-${DECK.slug}`),
  `0${DECK.slides.length + 2}-cta`,
];
