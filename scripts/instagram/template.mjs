import { BRAND, P, PHOTO, THEMES } from './brand.mjs';
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
  /* 배경 밝기 측정 시 텍스트만 숨김 (사진·스크림은 유지) */
  body.measure .mark, body.measure .txt, body.measure .read, body.measure .num,
  body.measure .arrow, body.measure .src, body.measure .center { visibility:hidden; }
  body.noscrim .scrim { display:none; }

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

  /* ── 사진형(잡지 문법) ── */
  .ph { padding:0; background:#9A958E; }
  .ph .img { position:absolute; inset:0; background-size:cover; background-position:center; }
  .ph .holder { position:absolute; inset:0; }
  .ph .holder span { position:absolute; left:50%; top:38%; transform:translate(-50%,-50%);
    width:76%; text-align:center; border:2px dashed rgba(255,255,255,.45);
    color:rgba(255,255,255,.8); font-size:26px; font-weight:600; line-height:1.5;
    padding:22px 26px; }
  .ph .scrim { position:absolute; inset:0; }
  .ph .mark { position:absolute; left:64px; top:56px; font-size:30px; font-weight:600;
    color:#fff; letter-spacing:.01em; text-shadow:0 2px 14px rgba(0,0,0,.55); }
  /* 인스타 하단 UI가 덮는 구간을 피해 텍스트를 위로 올림 */
  .ph .txt { position:absolute; left:64px; right:64px; bottom:17%; }
  .ph .kicker { font-size:27px; font-weight:700; color:rgba(255,255,255,.92);
    letter-spacing:.02em; margin-bottom:20px; text-shadow:0 2px 14px rgba(0,0,0,.5); }
  .ph .kicker i { font-style:normal; opacity:.6; margin:0 12px; }
  .ph h2 { word-break:keep-all; font-size:80px; font-weight:800; line-height:1.28; letter-spacing:-.045em;
    color:#fff; text-shadow:0 2px 24px rgba(0,0,0,.28); }

  /* 내지 — 사진 위 본문 */
  .ph .read { position:absolute; left:60px; right:66px; bottom:24%; }
  .ph .read p { word-break:keep-all; text-wrap:pretty; font-size:42px; font-weight:500; line-height:1.58; letter-spacing:-.028em;
    color:#fff; text-shadow:0 2px 18px rgba(0,0,0,.4); }
  .ph .read p + p { margin-top:32px; }
  .ph .read .n2 { display:block; font-size:34px; font-weight:800; letter-spacing:.02em;
    color:#fff; opacity:.75; margin-bottom:16px; }
  .ph .lead3 { display:flex; gap:16px; font-size:50px; font-weight:800; line-height:1.34; letter-spacing:-.035em;
    color:#fff; text-shadow:0 2px 18px rgba(0,0,0,.45); }
  .ph .lead3 .n { flex:none; font-variant-numeric:tabular-nums; }
  .ph .lead3 .t { word-break:keep-all; text-wrap:pretty; }
  .ph .items { margin-top:30px; display:flex; flex-direction:column; gap:18px; }
  .ph .items li { list-style:none; word-break:keep-all; text-wrap:pretty; display:flex; gap:18px; font-size:37px; font-weight:500;
    line-height:1.45; letter-spacing:-.025em; color:rgba(255,255,255,.94);
    text-shadow:0 2px 16px rgba(0,0,0,.45); }
  .ph .items li i { font-style:normal; font-weight:800; opacity:.85; flex:none; }
  .ph .arrow { position:absolute; right:58px; bottom:8%; font-size:34px; font-weight:600;
    color:rgba(255,255,255,.9); }
  .ph .num { position:absolute; right:64px; top:58px; font-size:25px; font-weight:600;
    letter-spacing:.06em; color:rgba(255,255,255,.72);
    text-shadow:0 2px 12px rgba(0,0,0,.5); }
  .ph .src { position:absolute; left:64px; bottom:8%; font-size:21px; font-weight:500;
    color:rgba(255,255,255,.55); }

  /* 엔딩 — 워드마크만 */
  .ph .center { position:absolute; inset:0; display:flex; flex-direction:column;
    align-items:center; justify-content:center; }
  .ph .center .h { font-size:46px; font-weight:700; color:#fff; letter-spacing:.01em; }
  .ph .center .t { margin-top:26px; font-size:29px; font-weight:600;
    color:rgba(255,255,255,.92); letter-spacing:-.02em; }

  /* ═══ 사진 없이 코드로 그리는 카드들 ═══ */

  /* ① 단톡방 대화 */
  .talk { background:${P.skyBg}; padding:78px 72px; }
  .talk .room { font-size:26px; font-weight:700; color:${P.g6}; padding-bottom:26px;
    border-bottom:1px solid #D3E5EC; display:flex; align-items:baseline; }
  .talk .room span { margin-left:auto; font-weight:600; color:${P.g5}; }
  .talk .msgs { margin:auto 0; display:flex; flex-direction:column; gap:34px; }
  .talk .m { max-width:80%; }
  .talk .m.r { align-self:flex-end; }
  .talk .who { font-size:24px; font-weight:600; color:${P.g6}; margin-bottom:12px; }
  .talk .bb { background:#fff; border:2px solid #DCEAF0; border-radius:8px 28px 28px 28px;
    padding:30px 34px; font-size:36px; font-weight:600; line-height:1.5;
    letter-spacing:-.025em; color:${P.ink}; }
  .talk .m.r .bb { background:${P.skyL}; border-color:${P.skyL};
    border-radius:28px 8px 28px 28px; }
  .talk .mark2 { margin-top:auto; padding-top:28px; font-size:24px; font-weight:600;
    color:${P.g5}; }

  /* ② 달력 */
  .cal { background:${P.cream}; padding:80px 72px; }
  .cal h3 { font-size:88px; font-weight:800; letter-spacing:-.05em; color:${P.ink}; }
  .cal .lead2 { margin-top:14px; font-size:30px; font-weight:600; color:${P.g6}; }
  .cal .grid { margin:auto 0; display:grid; grid-template-columns:repeat(7,1fr); gap:10px 6px; }
  .cal .dow { text-align:center; font-size:25px; font-weight:700; color:${P.g5};
    padding-bottom:14px; }
  .cal .d { height:112px; display:flex; align-items:center; justify-content:center; }
  /* 셀이 정사각이 아니라 원 대신 타원이 되던 문제 → 안쪽에 고정 크기 원을 둠 */
  .cal .d span { width:96px; height:96px; display:flex; align-items:center;
    justify-content:center; border-radius:50%; font-size:34px; font-weight:600;
    color:${P.ink}; }
  .cal .d.on span { background:${P.skyD}; color:#fff; font-weight:800; }
  .cal .d.sun span { color:${P.coral}; }
  .cal .d.on.sun span { color:#fff; }
  .cal .keys { display:flex; flex-direction:column; gap:14px; }
  .cal .key { display:flex; align-items:center; gap:18px; font-size:29px; font-weight:700;
    color:${P.ink}; }
  .cal .key i { width:20px; height:20px; border-radius:50%; background:${P.skyD}; flex:none; }
  .cal .mark2 { margin-top:34px; font-size:24px; font-weight:600; color:${P.g5}; }

  /* ③ 숫자 대비 */
  .vs { background:${P.skyBg}; padding:80px 72px; }
  .vs .cap { font-size:30px; font-weight:700; color:${P.skyD}; }
  .vs .row { margin:auto 0; display:flex; align-items:center; gap:40px; }
  .vs .side { text-align:center; }
  .vs .side .t2 { font-size:27px; font-weight:700; color:${P.g5}; margin-bottom:16px; }
  .vs .side .n { font-size:132px; font-weight:800; letter-spacing:-.06em; line-height:1;
    color:${P.g4}; white-space:nowrap; }
  .vs .side .n i { font-size:.4em; font-style:normal; font-weight:700; margin-left:.06em; }
  .vs .side.now .n { font-size:196px; color:${P.skyD}; }
  .vs .side.now .t2 { color:${P.skyD}; }
  .vs .arw { font-size:70px; font-weight:800; color:${P.skyL}; }
  .vs .note2 { font-size:34px; font-weight:700; line-height:1.5; color:${P.ink}; }
  .vs .mark2 { margin-top:32px; font-size:24px; font-weight:600; color:${P.g5}; }

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

const TONES = [
  ['#A8A29A', '#4A453F'], ['#9CA6A8', '#3C4446'], ['#AFA6A0', '#4B423C'],
  ['#A3AAA0', '#414741'], ['#B0A69C', '#4E453C'], ['#9EA3AC', '#3E4249'],
];

const photoBg = (s) => {
  if (s.photo)
    return `<div class="img" style="background-image:url('${s.photo}');`
         + `background-position:${s.pos || 'center'};`
         + `background-size:${s.zoom ? `${s.zoom}% auto` : 'cover'}"></div>`;
  const [a, b] = TONES[(s.tone ?? 0) % TONES.length];
  return `<div class="holder" style="background:linear-gradient(155deg,${a} 0%,${b} 100%)">
    <span>사진 자리${s.need ? ` · ${s.need}` : ''}</span></div>`;
};

const scrimOf = (k) =>
  k === 'photoEnd' ? PHOTO.scrimEnd : k === 'photoBody' ? PHOTO.scrimBody : PHOTO.scrimCover;

// 선행 번호(1. / 2) 등)를 별도 칼럼으로 빼서 둘째 줄이 글자에 맞춰 들여써지게 함
const leadHtml = (lead) => {
  const m = lead.match(/^(\d+[.)])\s+([\s\S]+)$/);
  return m
    ? `<div class="lead3"><span class="n">${m[1]}</span><span class="t">${m[2]}</span></div>`
    : `<div class="lead3"><span class="t">${lead}</span></div>`;
};

const photoCard = (s, i, n) => `<section class="s ph" data-kind="${s.kind}">
  ${photoBg(s)}<div class="scrim" style="background:${scrimOf(s.kind)}"></div>
  ${s.kind === 'photo' ? `<div class="mark">${WM}</div>
    <div class="txt"><div class="kicker">${s.place}<i>|</i>${s.cat}</div>
      <h2>${s.head.join('<br>')}</h2></div>` : ''}
  ${n > 1 && s.kind !== 'photo' ? `<div class="num">${i + 1} / ${n}</div>` : ''}
  ${s.kind === 'photoBody' ? `<div class="read">
      ${s.lead ? leadHtml(s.lead) : ''}
      ${s.items ? `<ul class="items">${s.items
          .map((t) => `<li><i>✓</i><span>${t}</span></li>`).join('')}</ul>` : ''}
      ${(s.body || []).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')}</div>
    <div class="arrow">&#8594;</div>
    ${s.source ? `<div class="src">${s.source}</div>` : ''}` : ''}
  ${s.kind === 'photoEnd' ? `<div class="center">
      <div class="h">${BRAND.handle}</div><div class="t">${BRAND.tagline}</div></div>` : ''}
</section>`;

const WM = BRAND.handle;

const PHOTO_KINDS = ['photo', 'photoBody', 'photoEnd', 'photoOnly'];

// ── 사진 없이 그리는 카드 ──────────────────────────────
const DOW = ['월', '화', '수', '목', '금', '토', '일'];

const drawnCard = (s) => {
  if (s.kind === 'talk')
    return `<section class="s talk">
      <div class="room">${s.room}<span>${s.count}</span></div>
      <div class="msgs">${s.msgs.map((m) => `<div class="m ${m.side}">
          ${m.who ? `<div class="who">${m.who}</div>` : ''}
          <div class="bb">${m.text.replace(/\n/g, '<br>')}</div></div>`).join('')}</div>
      <div class="mark2">${BRAND.handle}</div>
    </section>`;

  if (s.kind === 'cal') {
    const cells = [
      ...DOW.map((d) => `<div class="dow">${d}</div>`),
      ...Array.from({ length: s.blanks }, () => '<div class="d"></div>'),
      ...Array.from({ length: s.days }, (_, i) => {
        const n = i + 1;
        const sun = (s.blanks + i) % 7 === 6;
        return `<div class="d${s.on.includes(n) ? ' on' : ''}${sun ? ' sun' : ''}">`
             + `<span>${n}</span></div>`;
      }),
    ].join('');
    return `<section class="s cal">
      <h3>${s.month}</h3><div class="lead2">${s.lead}</div>
      <div class="grid">${cells}</div>
      <div class="keys">${s.keys.map((k) => `<div class="key"><i></i>${k}</div>`).join('')}</div>
      <div class="mark2">${BRAND.handle}</div>
    </section>`;
  }

  if (s.kind === 'vs')
    return `<section class="s vs">
      <div class="cap">${s.cap}</div>
      <div class="row">
        <div class="side"><div class="t2">${s.beforeLabel}</div>
          <div class="n">${s.before}<i>${s.unit}</i></div></div>
        <div class="arw">&#8594;</div>
        <div class="side now"><div class="t2">${s.afterLabel}</div>
          <div class="n">${s.after}<i>${s.unit}</i></div></div>
      </div>
      <div class="note2">${s.note.replace(/\n/g, '<br>')}</div>
      <div class="mark2">${BRAND.handle}</div>
    </section>`;
  return '';
};

const DRAWN_KINDS = ['talk', 'cal', 'vs'];

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

export function buildHtml(decks = DECKS) {
  const out = [];
  for (const d of decks) {
    const t = THEMES[d.theme];
    d.slides.forEach((raw, i) => {
      const s = { ...(d.photoDefaults || {}), ...raw };
      out.push(
        DRAWN_KINDS.includes(s.kind) ? drawnCard(s)
        : PHOTO_KINDS.includes(s.kind)
          ? photoCard(s, i, d.slides.length)
          : shell(t, i + 1, d.slides.length, render(s, t), s.kind === 'end' ? 'end' : '')
      );
    });
  }
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
    <style>${CSS}</style></head><body>${out.join('')}</body></html>`;
}

export const namesFor = (decks = DECKS) =>
  decks.flatMap((d) => d.slides.map((_, i) =>
    d.slides.length === 1 ? d.id : `${d.id}-${String(i + 1).padStart(2, '0')}`));
