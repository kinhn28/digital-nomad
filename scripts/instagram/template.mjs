import { BRAND, P, THEMES } from './brand.mjs';
import { DECKS } from './decks.mjs';

const W = 1080, H = 1350, PAD = 80;
const hl = (s) => s.replace(/\{([^}]+)\}/g, '<b>$1</b>').replace(/\n/g, '<br>');

const CSS = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#DDDDE1; font-family:Pretendard,sans-serif;
         -webkit-font-smoothing:antialiased; font-feature-settings:"tnum"; }
  .s { width:${W}px; height:${H}px; padding:${PAD}px; position:relative;
       display:flex; flex-direction:column; overflow:hidden; }

  /* 상·하단 메타 — 라운드 배지 대신 헤어라인 규칙 */
  .meta { display:flex; align-items:baseline; font-size:23px; font-weight:600;
          letter-spacing:.02em; padding-bottom:22px; border-bottom:1px solid var(--rule); }
  .meta .r { margin-left:auto; font-weight:600; letter-spacing:.1em; }
  .foot { margin-top:auto; padding-top:24px; border-top:1px solid var(--rule);
          display:flex; align-items:baseline; font-size:23px; font-weight:600; }
  .foot .r { margin-left:auto; letter-spacing:.02em; }

  b { font-weight:800; color:var(--acc); }

  /* ── 표지 ── */
  .eyebrow { font-size:27px; font-weight:700; color:var(--acc); margin-top:64px; }
  h1 { margin-top:22px; font-size:96px; font-weight:800; line-height:1.24;
       letter-spacing:-.045em; color:var(--fg); }
  .figure { font-size:172px; font-weight:800; line-height:0; letter-spacing:-.05em;
            color:var(--acc); display:inline-block; vertical-align:-26px; margin-left:18px; }
  .cfoot { margin-top:auto; margin-bottom:34px; font-size:29px; font-weight:600;
           line-height:1.55; color:var(--body); }

  /* ── 혜택 내지 ── */
  .no { margin-top:58px; font-size:30px; font-weight:800; letter-spacing:.24em; color:var(--acc); }
  .name { margin-top:26px; font-size:88px; font-weight:800; line-height:1.16;
          letter-spacing:-.045em; color:var(--fg); }
  .amt { margin-top:44px; display:flex; align-items:baseline; gap:20px; flex-wrap:wrap; }
  .amt .v { font-size:104px; font-weight:800; letter-spacing:-.05em; line-height:1; color:var(--acc); }
  .amt .c { font-size:30px; font-weight:600; color:var(--body); }
  .para { margin-top:auto; margin-bottom:40px; display:flex; flex-direction:column; gap:22px; }
  .para p { font-size:33px; font-weight:500; line-height:1.62; color:var(--body);
            letter-spacing:-.015em; max-width:880px; }

  /* ── 새벽(명조) ── */
  .moon { margin-top:auto; width:104px; height:104px; border-radius:50%;
          background:var(--acc); position:relative; }
  .moon::after { content:''; position:absolute; left:28px; top:-8px; width:104px; height:104px;
                 border-radius:50%; background:var(--bg); }
  .time { margin-top:38px; font-size:26px; font-weight:700; letter-spacing:.22em; color:var(--acc); }
  .verse { margin-top:34px; font-family:'Noto Serif KR',serif; font-size:72px; font-weight:600;
           line-height:1.62; letter-spacing:-.035em; color:var(--fg); }
  .vsub { margin-top:36px; margin-bottom:52px; font-size:27px; font-weight:500; line-height:1.6;
          color:var(--body); }
  .sign { margin-top:auto; margin-bottom:auto; font-family:'Noto Serif KR',serif;
          font-size:76px; font-weight:600; line-height:1.6; letter-spacing:-.035em; color:var(--fg); }

  /* ── 정보 Q&A ── */
  .q { margin-top:60px; font-size:29px; font-weight:700; color:var(--acc); }
  .big { margin-top:24px; font-size:74px; font-weight:800; line-height:1.3;
         letter-spacing:-.045em; color:var(--fg); }
  .warn { margin-top:34px; padding-top:26px; border-top:1px solid var(--rule);
          font-size:27px; font-weight:600; line-height:1.6; color:var(--meta); }

  /* ── 커뮤니티 말풍선 ── */
  .chat { margin:auto 0; display:flex; flex-direction:column; gap:52px; }
  .msg { max-width:82%; }
  .msg.r { align-self:flex-end; }
  .mhead { font-size:24px; font-weight:600; color:var(--meta); margin-bottom:14px;
           display:flex; align-items:center; gap:12px; }
  .mhead .bd { color:var(--acc); font-weight:800; }
  .bub { background:${P.sub}; border-radius:6px 26px 26px 26px; padding:32px 34px;
         font-size:35px; font-weight:600; line-height:1.5; letter-spacing:-.02em; color:var(--fg); }
  .msg.r .mhead { justify-content:flex-end; }
  .msg.r .bub { background:${P.blueBg}; border-radius:26px 6px 26px 26px; }
  .cfoot2 { margin-top:auto; margin-bottom:40px; font-size:29px; font-weight:600; color:var(--meta); }

  /* ── 엔딩 ── */
  .end h1 { margin-top:auto; }
  .ebody { margin-top:40px; max-width:900px; font-size:35px; font-weight:500; line-height:1.62;
           letter-spacing:-.02em; color:var(--body); }
  .enote { margin-top:auto; margin-bottom:40px; font-size:29px; font-weight:700; color:var(--fg); }
`;

const shell = (t, i, n, inner, cls = '') => `<section class="s ${cls}" style="
    --bg:${t.bg}; --fg:${t.fg}; --acc:${t.accent}; --meta:${t.meta}; --rule:${t.rule};
    --body:${t.body}; background:${t.bg}; color:${t.fg};">
  <div class="meta" style="color:${t.meta}"><span>${t.label}</span><span class="r">${i}/${n}</span></div>
  ${inner}
  <div class="foot" style="color:${t.meta}"><span>${BRAND.handle}</span></div>
</section>`;

const render = (s, t) => {
  switch (s.kind) {
    case 'cover':
      return `${s.eyebrow ? `<div class="eyebrow">${s.eyebrow}</div>` : ''}
        <h1>${s.head.join('<br>')}${s.figure ? `<span class="figure">${s.figure}</span>` : ''}</h1>
        <div class="cfoot">${s.foot}</div>`;
    case 'item':
      return `<div class="no">NO.${s.no}</div>
        <div class="name">${s.name.replace(/\n/g, '<br>')}</div>
        <div class="amt"><span class="v">${s.amount}</span>
          ${s.cond ? `<span class="c">${s.cond}</span>` : ''}</div>
        <div class="para">${s.body.map((p) => `<p>${hl(p)}</p>`).join('')}</div>`;
    case 'dawn':
      return `<div class="moon"></div>
        ${s.time ? `<div class="time">${s.time}</div>` : '<div style="height:38px"></div>'}
        <div class="verse">${s.lines.join('<br>')}</div>
        <div class="vsub">${s.sub}</div>`;
    case 'dawnEnd':
      return `<div class="sign">${s.lines.join('<br>')}<br><span style="color:${t.accent}">🩵</span></div>`;
    case 'qa':
      return `<div class="q">${s.q}</div>
        <div class="big">${s.big.join('<br>')}</div>
        <div class="para">${s.body.map((p) => `<p>${hl(p)}</p>`).join('')}
          ${s.warn ? `<div class="warn">${s.warn}</div>` : ''}</div>`;
    case 'chat':
      return `<div class="chat">${s.msgs
        .map((m) => `<div class="msg ${m.side}">
            <div class="mhead"><span>${m.time} · ${m.who}</span>
              ${m.badge ? `<span class="bd">${m.badge}</span>` : ''}</div>
            <div class="bub">${m.text.replace(/\n/g, '<br>')}</div></div>`)
        .join('')}</div>
        <div class="cfoot2">${s.foot}</div>`;
    case 'end':
      return `<h1>${s.head.join('<br>')}</h1>
        <div class="ebody">${hl(s.body)}</div>
        <div class="enote">${s.note}</div>`;
    default:
      return '';
  }
};

export function buildHtml() {
  const out = [];
  for (const d of DECKS) {
    const t = THEMES[d.theme];
    d.slides.forEach((s, i) =>
      out.push(shell(t, i + 1, d.slides.length, render(s, t), s.kind === 'end' ? 'end' : ''))
    );
  }
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
    <style>${CSS}</style></head><body>${out.join('')}</body></html>`;
}

export const NAMES = DECKS.flatMap((d) =>
  d.slides.map((_, i) => `${d.id}-${String(i + 1).padStart(2, '0')}`)
);
