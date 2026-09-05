// 인스타그램 피드 이미지(1080x1080 PNG) 생성기
//   실행: node scripts/instagram/generate.mjs
//   출력: public/instagram/*.png
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildHtml, SLIDE_NAMES } from './template.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../../public/instagram');
mkdirSync(outDir, { recursive: true });

const html = buildHtml();
writeFileSync(resolve(outDir, 'preview.html'), html);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1080, height: 1080 },
  deviceScaleFactor: 2, // 2160x2160 고화질 출력
});
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);

const slides = await page.locator('.slide').all();
for (const [i, slide] of slides.entries()) {
  const file = resolve(outDir, `${SLIDE_NAMES[i]}.png`);
  await slide.screenshot({ path: file });
  console.log('✓', file);
}

await browser.close();
