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
const MIN = { mark: 3, kicker: 4.5, head: 3, body: 4.5, arrow: 3, src: 4.5, sign: 3, tag: 4.5 };

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

// 1) 텍스트 상자 좌표 수집
const boxes = await page.evaluate(() => {
  const kindOf = (el) =>
    el.closest('.mark') ? 'mark' : el.classList.contains('kicker') ? 'kicker'
    : el.tagName === 'H2' && el.closest('.txt') ? 'head'
    : el.closest('.read') ? 'body' : el.classList.contains('arrow') ? 'arrow'
    : el.classList.contains('src') ? 'src'
    : el.closest('.center') ? (el.classList.contains('t') ? 'tag' : 'sign') : 'body';
  return [...document.querySelectorAll('.s')].map((card) => {
    const cb = card.getBoundingClientRect();
    const sel = '.mark .wm2, .kicker, .txt h2, .read p, .arrow, .src, .center .wm2, .center .t';
    return [...card.querySelectorAll(sel)].map((el) => {
      const r = el.getBoundingClientRect();
      return { kind: kindOf(el), x: Math.round(r.x - cb.x), y: Math.round(r.y - cb.y),
               w: Math.round(r.width), h: Math.round(r.height) };
    });
  });
});

// 2) 텍스트를 숨긴 배경만 캡처
await page.evaluate(() => document.body.classList.add('measure'));
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
