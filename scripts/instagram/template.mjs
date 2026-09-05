import { BRAND, CAFES, SYMPTOMS } from './slides.mjs';

const CSS = `
  @page { margin: 0 }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #E2E8F0; font-family: 'Noto Sans KR', sans-serif; -webkit-font-smoothing: antialiased; }
  .slide {
    width: 1080px; height: 1080px; position: relative; overflow: hidden;
    background: #F8FAFC; color: #0F172A; display: flex; flex-direction: column;
    padding: 76px;
  }
  /* 모눈종이(연구 노트) 배경 */
  .slide::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(15,23,42,.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(15,23,42,.045) 1px, transparent 1px);
    background-size: 54px 54px;
  }
  .slide > * { position: relative; z-index: 1; }

  .mono { font-family: 'DejaVu Sans Mono', ui-monospace, monospace; letter-spacing: .18em; text-transform: uppercase; }

  .topbar { display: flex; justify-content: space-between; align-items: center;
            font-size: 20px; font-weight: 700; color: #64748B; }
  .topbar .brand { color: #2563EB; }

  .footer { margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end;
            font-size: 20px; font-weight: 700; color: #94A3B8; }

  .rule { height: 4px; background: #0F172A; border-radius: 4px; }

  .kicker { display: inline-flex; align-items: center; gap: 12px; align-self: flex-start;
            background: #DBEAFE; color: #1D4ED8; border-radius: 999px;
            padding: 14px 28px; font-size: 22px; font-weight: 800; }

  h1 { font-size: 104px; line-height: 1.12; font-weight: 900; letter-spacing: -.035em; }
  h2 { font-size: 72px; line-height: 1.2;  font-weight: 900; letter-spacing: -.03em; }
  .lead { font-size: 30px; line-height: 1.6; font-weight: 500; color: #475569; }
  .blue { color: #2563EB; }
  .hl { background: linear-gradient(transparent 62%, #FDE68A 62%); }

  /* ── 커버 ── */
  .cover .cup { font-size: 60px; line-height: 1; }
  .cover .wordmark { margin-top: 96px; display: flex; align-items: center; gap: 18px;
                     font-size: 44px; font-weight: 900; letter-spacing: -.03em; color: #0F172A; }
  .cover-tags { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 52px; }
  .cover-tags span { background: #fff; border: 2px solid #E2E8F0; border-radius: 16px;
                     padding: 16px 24px; font-size: 25px; font-weight: 700; color: #475569;
                     box-shadow: 0 6px 16px rgba(15,23,42,.05); }
  .cover .stamp {
    position: absolute; right: 60px; top: 280px; width: 300px; height: 300px; border-radius: 50%;
    border: 6px solid rgba(37,99,235,.28); color: #2563EB; opacity: .95;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; transform: rotate(-12deg); gap: 6px;
  }
  .cover .stamp b { font-size: 78px; font-weight: 900; letter-spacing: -.02em; }
  .cover .stamp span { font-size: 19px; font-weight: 800; }

  /* ── 증상 리스트 ── */
  .symptoms { display: flex; flex-direction: column; gap: 20px; margin: 40px 0 30px; }
  .symptom { display: flex; align-items: center; gap: 26px; background: #fff;
             border: 2px solid #E2E8F0; border-radius: 26px; padding: 26px 34px;
             box-shadow: 0 8px 20px rgba(15,23,42,.05); }
  .symptom .ic { font-size: 44px; }
  .symptom .tx { font-size: 34px; font-weight: 700; color: #1E293B; }
  .symptom .chk { margin-left: auto; width: 44px; height: 44px; border-radius: 12px;
                  border: 3px solid #CBD5E1; color: #2563EB; font-size: 28px; font-weight: 900;
                  display: flex; align-items: center; justify-content: center; }

  /* ── 카페 카드 ── */
  .card { background: #fff; border: 3px solid #0F172A; border-radius: 40px; padding: 52px 52px 46px;
          box-shadow: 14px 14px 0 rgba(37,99,235,.16); margin: 36px 0 34px; flex: 1;
          display: flex; flex-direction: column; }
  .card-head { display: flex; align-items: flex-start; gap: 24px; }
  .specimen { display: flex; align-items: center; gap: 18px; font-size: 21px; font-weight: 800; color: #2563EB; }
  .specimen .dot { width: 14px; height: 14px; border-radius: 50%; background: #2563EB; }
  .cafe-name { font-size: 60px; font-weight: 900; letter-spacing: -.035em; margin-top: 18px; line-height: 1.15; }
  .cafe-addr { font-size: 26px; font-weight: 600; color: #64748B; margin-top: 14px; }
  .total { margin-left: auto; flex: none; width: 200px; height: 184px; border-radius: 34px;
           background: #2563EB; color: #fff; display: flex; flex-direction: column;
           align-items: center; justify-content: center; gap: 2px;
           box-shadow: 0 12px 26px rgba(37,99,235,.32); }
  .total b { font-size: 66px; font-weight: 900; letter-spacing: -.04em; line-height: 1; }
  .total span { font-size: 17px; font-weight: 800; opacity: .82; letter-spacing: .1em; }

  .metrics { margin-top: 52px; display: flex; flex-direction: column; gap: 34px; }
  .metric { display: flex; align-items: center; gap: 24px; }
  .metric .label { width: 190px; font-size: 28px; font-weight: 800; color: #334155; }
  .bars { display: flex; gap: 10px; }
  .bar { width: 74px; height: 26px; border-radius: 8px; background: #E2E8F0; }
  .bar.on { background: #2563EB; }
  .metric .val { margin-left: auto; font-size: 24px; font-weight: 800; color: #94A3B8; }

  .verdict { margin-top: auto; background: #EFF6FF; border: 2px solid #DBEAFE; border-radius: 26px;
             padding: 32px 34px; font-size: 30px; font-weight: 800; color: #1E293B;
             display: flex; gap: 16px; align-items: center; }
  .chips { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 44px; }
  .chip { border: 2px solid #E2E8F0; background: #fff; border-radius: 14px;
          padding: 14px 20px; font-size: 24px; font-weight: 700; color: #475569; }

  /* ── CTA(지도 목업) ── */
  .map { flex: 1; margin-top: 40px; border-radius: 40px; border: 3px solid #0F172A; overflow: hidden;
         position: relative; background: #EFF6FF; box-shadow: 14px 14px 0 rgba(37,99,235,.16); }
  .map .grid { position: absolute; inset: 0;
    background-image: linear-gradient(rgba(37,99,235,.12) 2px, transparent 2px),
                      linear-gradient(90deg, rgba(37,99,235,.12) 2px, transparent 2px);
    background-size: 90px 90px; }
  .map .road { position: absolute; background: #fff; }
  .pin { position: absolute; transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; }
  .pin .head { width: 84px; height: 84px; border-radius: 50%; background: #2563EB; color: #fff;
               display: flex; align-items: center; justify-content: center; font-size: 40px;
               box-shadow: 0 10px 22px rgba(37,99,235,.4); border: 5px solid #fff; }
  .pin .tail { width: 0; height: 0; border-left: 14px solid transparent; border-right: 14px solid transparent;
               border-top: 22px solid #2563EB; margin-top: -6px; }
  .pin .tip { margin-top: 10px; background: #0F172A; color: #fff; font-size: 21px; font-weight: 800;
              padding: 10px 18px; border-radius: 12px; white-space: nowrap; }
  .cta-btn { margin: 32px 0 30px; background: #2563EB; color: #fff; border-radius: 28px;
             padding: 32px; text-align: center; font-size: 36px; font-weight: 900;
             box-shadow: 0 14px 30px rgba(37,99,235,.35); }
`;

const bars = (n) =>
  `<div class="bars">${[1, 2, 3, 4, 5]
    .map((i) => `<div class="bar${i <= n ? ' on' : ''}"></div>`)
    .join('')}</div>`;

const avg = (c) => {
  const v = Object.values(c.scores);
  return (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1);
};

const top = (right) =>
  `<div class="topbar"><div class="brand mono">☕ MONDAY LAB</div><div class="mono">${right}</div></div>`;

const foot = (left, right) =>
  `<div class="footer"><div class="mono">${left}</div><div class="mono">${right}</div></div>`;

function cover() {
  return `<section class="slide cover">
    ${top('VOL.01 · SEOUL')}
    <div class="stamp"><b>4</b><span>CAFES TESTED</span></div>
    <div class="wordmark"><span class="cup">☕</span><span>월요병연구소</span></div>
    <h1 style="margin-top:40px">월요일에도<br><span class="blue">일할 맛 나는</span><br>카페 4곳</h1>
    <p class="lead" style="margin-top:36px">콘센트 · 와이파이 · 소음까지<br><span class="hl">직접 재보고 정리했습니다.</span></p>
    <div class="cover-tags">
      <span>🔌 콘센트</span><span>📶 와이파이</span><span>🤫 소음도</span><span>💬 실시간 채팅</span>
    </div>
    ${foot(BRAND.handle, '→ SWIPE')}
  </section>`;
}

function background() {
  return `<section class="slide">
    ${top('BACKGROUND')}
    <div style="margin-top:52px"></div>
    <div class="kicker">🧪 실험 배경</div>
    <h2 style="margin-top:30px">노트북 들고 나갔다가<br>이런 적, 있으시죠?</h2>
    <div class="symptoms">
      ${SYMPTOMS.map(
        (s) => `<div class="symptom"><div class="ic">${s.icon}</div>
                  <div class="tx">${s.text}</div><div class="chk">✓</div></div>`
      ).join('')}
    </div>
    ${foot(BRAND.handle, '02 / 07')}
  </section>`;
}

function cafeSlide(c, idx) {
  return `<section class="slide">
    ${top(`SPECIMEN ${c.no}`)}
    <div class="card">
      <div class="card-head">
        <div>
          <div class="specimen"><span class="dot"></span><span class="mono">CAFE No.${c.no}</span></div>
          <div class="cafe-name">${c.name}</div>
          <div class="cafe-addr">📍 ${c.address}</div>
        </div>
        <div class="total"><b>${avg(c)}</b><span class="mono">TOTAL / 5</span></div>
      </div>
      <div class="metrics">
        <div class="metric"><div class="label">🔌 콘센트</div>${bars(c.scores.plug)}<div class="val mono">${c.scores.plug}.0</div></div>
        <div class="metric"><div class="label">📶 와이파이</div>${bars(c.scores.wifi)}<div class="val mono">${c.scores.wifi}.0</div></div>
        <div class="metric"><div class="label">🤫 조용함</div>${bars(c.scores.quiet)}<div class="val mono">${c.scores.quiet}.0</div></div>
      </div>
      <div class="chips">${c.tags.map((t) => `<div class="chip">${t}</div>`).join('')}</div>
      <div class="verdict"><span>💡</span><span>${c.verdict}</span></div>
    </div>
    ${foot(BRAND.handle, `0${idx + 3} / 07`)}
  </section>`;
}

function cta() {
  const pins = [
    { x: 30, y: 34, ic: '☕' },
    { x: 63, y: 26, ic: '🔌' },
    { x: 46, y: 62, ic: '📶', tip: '지금 자리 있어요' },
    { x: 76, y: 66, ic: '🤫' },
  ];
  return `<section class="slide">
    ${top('WHERE TO FIND')}
    <div style="margin-top:44px"></div>
    <h2>지도 하나로<br><span class="blue">오늘의 작업실</span> 찾기</h2>
    <p class="lead" style="margin-top:22px">실시간 카페 채팅으로 자리 상황까지 확인하세요.</p>
    <div class="map">
      <div class="grid"></div>
      <div class="road" style="left:0;right:0;top:44%;height:26px"></div>
      <div class="road" style="top:0;bottom:0;left:56%;width:26px"></div>
      ${pins
        .map(
          (p) => `<div class="pin" style="left:${p.x}%;top:${p.y}%">
            <div class="head">${p.ic}</div><div class="tail"></div>
            ${p.tip ? `<div class="tip">${p.tip}</div>` : ''}
          </div>`
        )
        .join('')}
    </div>
    <div class="cta-btn">☕ 월요병연구소에서 전체 지도 보기</div>
    ${foot(BRAND.handle, '07 / 07')}
  </section>`;
}

export function buildHtml() {
  const slides = [cover(), background(), ...CAFES.map(cafeSlide), cta()];
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
    <style>${CSS}</style></head><body>${slides.join('')}</body></html>`;
}

export const SLIDE_NAMES = [
  '01-cover',
  '02-background',
  ...CAFES.map((c, i) => `0${i + 3}-cafe-${c.no}`),
  '07-cta',
];
