// 인스타그램 캐러셀 이미지(1080x1350, 4:5) 생성기
//   실행: node scripts/instagram/generate.mjs
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildHtml, NAMES } from './template.mjs';

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../public/instagram');
mkdirSync(outDir, { recursive: true });

const html = buildHtml();
writeFileSync(resolve(outDir, 'preview.html'), html);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1080, height: 1350 },
  deviceScaleFactor: 2, // 2160x2700 고화질
});
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);

// 슬라이드가 캔버스를 넘치는지 검사 (겹침 방지)
const overflow = await page.evaluate(() =>
  [...document.querySelectorAll('.slide')]
    .map((s, i) => (s.scrollHeight > s.clientHeight ? `${i + 1}번(${s.scrollHeight}px)` : null))
    .filter(Boolean)
);
if (overflow.length) console.warn('⚠️  내용 넘침:', overflow.join(', '));

for (const [i, slide] of (await page.locator('.slide').all()).entries()) {
  const file = resolve(outDir, `${NAMES[i]}.png`);
  await slide.screenshot({ path: file });
  console.log('✓', file);
}
await browser.close();
