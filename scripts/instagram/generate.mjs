// 인스타그램 캐러셀 이미지 생성기 (1080x1350, 4:5)
//   실행: node scripts/instagram/generate.mjs
//
// 렌더 전에 "사진 위 텍스트 가독성"을 실제 픽셀로 검사합니다.
//   1) 텍스트만 숨긴 배경을 찍어
//   2) 각 텍스트가 놓일 영역의 밝기를 재고
//   3) 흰 글자 기준 WCAG 명도대비를 계산해 통과 여부를 알려줍니다.
import { chromium } from 'playwright';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildHtml, namesFor } from './template.mjs';
import { DECKS } from './decks.mjs';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = resolve(root, 'public/instagram');
mkdirSync(outDir, { recursive: true });

// 텍스트 종류별 최소 명도대비 (WCAG: 큰 글자 3:1, 본문 4.5:1)
const MIN = { mark: 4.5, kicker: 4.5, head: 3, body: 4.5, arrow: 3, src: 4.5,
              num: 4.5, sign: 3, tag: 4.5 };

// 한장 / 여러장 선택:  node generate.mjs --single | --multi | --deck=ID
const arg = process.argv.slice(2).join(' ');
const only = (arg.match(/--deck=(\S+)/) || [])[1];
const want = arg.includes('--single') ? 'single' : arg.includes('--multi') ? 'multi' : null;
const decks = DECKS.filter((d) =>
  only ? d.id === only : want ? d.type === want : d.type !== 'draft');
if (!decks.length) { console.error('해당하는 세트가 없습니다.'); process.exit(1); }
const NAMES = namesFor(decks);
console.log('세트:', decks.map((d) => `${d.id}(${d.type}, ${d.slides.length}장)`).join(' · '));

// 이번에 만들 세트의 이전 결과물만 지움 — 다른 세트는 그대로 둠
for (const d of decks) {
  for (const n of namesFor([d])) rmSync(resolve(outDir, `${n}.png`), { force: true });
  rmSync(resolve(outDir, `${d.id}.zip`), { force: true });
}

// 레퍼런스 캡처에서 잰 목표 밝기 곡선 (0~100%, 5% 간격)
const TARGET = {
  photo:     [.30,.28,.27,.29,.33,.40,.41,.37,.30,.22,.19,.16,.17,.15,.12,.10,.11,.08,.05,.06,.06],
  photoBody: [.42,.37,.34,.40,.42,.30,.28,.31,.29,.21,.19,.15,.12,.09,.09,.05,.03,.02,.01,.01,.01],
  photoEnd:  [.14,.13,.12,.12,.12,.11,.11,.10,.10,.09,.09,.08,.08,.07,.07,.06,.06,.05,.05,.05,.05],
};
const invlin = (L) => (L <= 0.0031308 ? L * 12.92 : 1.055 * L ** (1 / 2.4) - 0.055);

const html = buildHtml(decks);
writeFileSync(resolve(outDir, 'preview.html'), html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
await page.goto(`file://${root}/`);              // assets/photos 상대경로가 풀리도록
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() =>
  [...document.images].every((i) => i.complete) &&
  [...document.querySelectorAll('.img')].length >= 0);
await page.waitForTimeout(300);                   // 배경 이미지 디코딩 여유

// 0) 사진마다 필요한 음영을 역산 — 밝은 사진은 더, 어두운 사진은 덜 누름
await page.evaluate(() => document.body.classList.add('measure', 'noscrim'));
const rawShots = [];
for (const c of await page.locator('.s.ph').all())
  rawShots.push((await c.screenshot()).toString('base64'));

const probe0 = await browser.newPage();
await probe0.setContent('<canvas id=c></canvas>');
const srcCurves = [];
for (const b64 of rawShots) {
  srcCurves.push(await probe0.evaluate(async (b64) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const cv = document.getElementById('c'); cv.width = img.width; cv.height = img.height;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const lin = (v) => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    const out = [];
    for (let k = 0; k <= 100; k += 5) {
      const y = Math.min(Math.round(img.height * k / 100), img.height - 1);
      const d = ctx.getImageData(0, y, img.width, 1).data;
      const ls = [];
      for (let i = 0; i < d.length; i += 4)
        ls.push(.2126 * lin(d[i]) + .7152 * lin(d[i + 1]) + .0722 * lin(d[i + 2]));
      const mean = ls.reduce((a, b) => a + b, 0) / ls.length;
      ls.sort((a, b) => a - b);
      out.push({ mean, p90: ls[Math.floor(ls.length * .9)] });   // 밝은 쪽 최악값
    }
    return out;
  }, b64));
}
await probe0.close();

await page.evaluate(([curves, kinds]) => {
  document.body.classList.remove('noscrim');
  const inv = (L) => (L <= 0.0031308 ? L * 12.92 : 1.055 * Math.pow(L, 1 / 2.4) - 0.055);
  // 필요한 어둡기만 구하고, 그라데이션 자체는 단조·부드럽게 만든다.
  // 구간마다 알파가 오르내리면 그 경계가 띠(선)로 보인다.
  const solve = (srcL, targetL) =>
    Math.max(0, Math.min(.92, 1 - inv(targetL) / Math.max(inv(srcL), 1e-4)));

  // 램프 모양(아래는 smoothstep, 위 띠는 제곱 감쇠)을 먼저 정하고,
  // 글자가 놓인 위치에서 필요한 어둡기가 나오도록 진폭을 역산한다.
  const fTop = (k) => {
    if (k <= 9) return 1;            // 글상자가 놓인 구간은 그대로 유지
    if (k >= 24) return 0;
    return (1 - (k - 9) / 15) ** 2;  // 그 뒤로 부드럽게 소멸
  };
  const fBot = (k) => {
    if (k <= 38) return 0;
    if (k >= 76) return 1;
    const t = (k - 38) / 38;
    return t * t * (3 - 2 * t);
  };

  document.querySelectorAll('.s.ph').forEach((card, i) => {
    const kind = card.dataset.kind;
    const c = curves[i];
    const need = (j, target) => solve(c[j].p90, target);

    let css;
    if (kind !== 'photo') {
      // 표지 외에는 사진 전체를 고르게 눌러 글이 앞으로 나오게 한다
      const a = Math.max(...c.map((x) => solve(x.p90, kind === 'photoEnd' ? .09 : .10)));
      css = `linear-gradient(rgba(0,0,0,${a.toFixed(3)}), rgba(0,0,0,${a.toFixed(3)}))`;
    } else {
      // 아이디·순번은 위 4~7% 구간에 놓임
      let aTop = 0;
      for (const j of [0, 1]) aTop = Math.max(aTop, need(j, .085) / fTop(j * 5));
      // 문구는 커버 55~85%, 내지 60~85%
      let aBot = 0;
      const from = kind === 'photo' ? 11 : 12;
      for (let j = from; j <= 17; j++)
        aBot = Math.max(aBot, need(j, .085) / Math.max(fBot(j * 5), .12));
      aTop = Math.min(aTop, .92); aBot = Math.min(aBot, .92);

      const stops = [];
      for (let k = 0; k <= 100; k += 2) {
        const a = Math.min(.95, aTop * fTop(k) + aBot * fBot(k));
        stops.push(`rgba(0,0,0,${a.toFixed(3)}) ${k}%`);
      }
      css = `linear-gradient(to bottom, ${stops.join(',')})`;
    }
    card.querySelector('.scrim').style.background = css;
  });
}, [srcCurves, null]);

// 1) 텍스트 상자 좌표 수집
const boxes = await page.evaluate(() => {
  const kindOf = (el) =>
    el.classList.contains('mark') ? 'mark' : el.classList.contains('kicker') ? 'kicker'
    : el.classList.contains('num') ? 'num'
    : el.tagName === 'H2' && el.closest('.txt') ? 'head'
    : el.closest('.read') ? 'body' : el.classList.contains('arrow') ? 'arrow'
    : el.classList.contains('src') ? 'src'
    : el.closest('.center') ? (el.classList.contains('t') ? 'tag' : 'sign') : 'body';
  return [...document.querySelectorAll('.s')].map((card) => {
    const cb = card.getBoundingClientRect();
    const sel = '.mark, .kicker, .txt h2, .read p, .arrow, .src, .num, .center .h, .center .t';
    return [...card.querySelectorAll(sel)].map((el) => {
      const r = el.getBoundingClientRect();
      return { kind: kindOf(el), x: Math.round(r.x - cb.x), y: Math.round(r.y - cb.y),
               w: Math.round(r.width), h: Math.round(r.height) };
    });
  });
});

// 2) 텍스트를 숨긴 배경만 캡처
const cards = await page.locator('.s').all();
const bgShots = [];
for (const c of cards) bgShots.push((await c.screenshot()).toString('base64'));
await page.evaluate(() => document.body.classList.remove('measure'));

// 3) 캔버스로 밝기 측정 → 명도대비 계산
const probe = await browser.newPage();
await probe.setContent('<canvas id=c></canvas>');
const report = [];
for (let i = 0; i < bgShots.length; i++) {
  report.push(await probe.evaluate(async ([b64, regions]) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const cv = document.getElementById('c');
    cv.width = img.width; cv.height = img.height;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const lin = (v) => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    return regions.map((r) => {
      if (r.w < 2 || r.h < 2) return { ...r, cr: 99 };
      const d = ctx.getImageData(r.x, r.y, r.w, r.h).data;
      const ls = [];
      for (let p = 0; p < d.length; p += 4)
        ls.push(0.2126 * lin(d[p]) + 0.7152 * lin(d[p + 1]) + 0.0722 * lin(d[p + 2]));
      ls.sort((a, b) => a - b);
      const bright = ls[Math.floor(ls.length * 0.9)];   // 밝은 쪽 10% 지점 = 최악 조건
      return { ...r, cr: +(1.05 / (bright + 0.05)).toFixed(2) };
    });
  }, [bgShots[i], boxes[i]]));
}

// 3-b) 줄별 채움 비율 — 짧은 줄이 있으면 문장을 고쳐야 함
const lines = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('.s.ph').forEach((card, i) => {
    card.querySelectorAll('.read p, .items li span, .lead3 .t, .txt h2').forEach((el) => {
      const r = document.createRange();
      r.selectNodeContents(el);
      const rects = [...r.getClientRects()].filter((x) => x.width > 1);
      if (rects.length < 2) return;                       // 한 줄이면 볼 것 없음
      const box = el.getBoundingClientRect().width;
      const fills = rects.map((x) => +(x.width / box).toFixed(2));
      const worst = Math.min(...fills);
      if (worst < 0.55)
        out.push({ i: i + 1, fills, worst, text: el.textContent.trim().slice(0, 34) });
    });
  });
  return out;
});
if (lines.length) {
  console.log('\n줄 채움 점검 — 짧은 줄이 있는 문장 (문장을 고쳐 채우세요)');
  lines.forEach((o) =>
    console.log(`  ${NAMES[o.i - 1]}  [${o.fills.map((f) => Math.round(f * 100)).join(' · ')}%]  ${o.text}…`));
  console.log('');
}

// 3-c) 세이프존 — 리포스트/스레드 UI가 덮는 하단 20%를 텍스트가 침범하는지
const unsafe = await page.evaluate(() => {
  const LIMIT = 1350 * 0.78;                             // 표지 외 카드의 텍스트 하한선
  const out = [];
  document.querySelectorAll('.s.ph').forEach((card, i) => {
    if (card.dataset.kind === 'photo') return;           // 표지는 레퍼런스 위치 유지
    const top = card.getBoundingClientRect().top;
    card.querySelectorAll('.read, .center .h, .center .t').forEach((el) => {
      const b = el.getBoundingClientRect().bottom - top;
      if (b > LIMIT) out.push({ i: i + 1, bottom: Math.round(b) });
    });
  });
  return out;
});
if (unsafe.length) {
  console.log('\n세이프존 침범 — 리포스트 시 가려집니다 (하한 1053px)');
  unsafe.forEach((o) => console.log(`  ${NAMES[o.i - 1]}  텍스트 아래끝 ${o.bottom}px`));
  console.log('');
}

// 4) 리포트
let fail = 0;
console.log('\n가독성 검사 — 흰 글자 기준 명도대비 (WCAG: 본문 4.5, 큰 글자 3.0)');
report.forEach((regions, i) => {
  if (!regions.length) { console.log(` ${NAMES[i]}  사진 없는 카드 — 검사 제외`); return; }
  const worst = regions.reduce((a, r) => (r.cr < a.cr ? r : a), { cr: 99 });
  const bad = regions.filter((r) => r.cr < MIN[r.kind]);
  fail += bad.length;
  console.log(` ${NAMES[i]}  최저 ${worst.cr}:1 (${worst.kind || '-'})` +
    (bad.length ? `  ✗ 미달 ${bad.map((b) => `${b.kind} ${b.cr}`).join(', ')}` : '  ✓'));
});
console.log(fail ? `\n⚠️ ${fail}곳이 기준 미달입니다. 스크림을 더 눌러야 합니다.\n`
                 : '\n전부 통과.\n');

// 5) 최종 출력
for (const [i, c] of cards.entries()) {
  const file = resolve(outDir, `${NAMES[i]}.png`);
  await c.screenshot({ path: file });
  console.log('✓', file);
}
await browser.close();

// 여러장 세트는 한 번에 받도록 zip 으로 묶음
for (const d of decks) {
  if (d.slides.length < 2) continue;
  const files = namesFor([d]).map((n) => `${n}.png`);
  const zipPath = resolve(outDir, `${d.id}.zip`);
  execFileSync('zip', ['-jq', zipPath, ...files.map((f) => resolve(outDir, f))]);
  console.log('📦', zipPath);
}

// 여러 세트를 한 번에 만들었으면 전체를 한 폴더로도 묶음
const multi = decks.filter((d) => d.slides.length > 1);
if (multi.length > 1) {
  const all = multi.flatMap((d) => namesFor([d]).map((n) => resolve(outDir, `${n}.png`)));
  const allZip = resolve(outDir, 'ALL-cards.zip');
  rmSync(allZip, { force: true });
  execFileSync('zip', ['-jq', allZip, ...all]);
  console.log('📦 전체', allZip, `(${all.length}장)`);
}
