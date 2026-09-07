// 받은 이미지들을 세트에 한 번에 붙인다.
//   node scripts/instagram/adopt.mjs --deck=C6-culture 파일1 파일2 ...
//
// 넘긴 순서대로 1장, 2장… 에 대응된다. 4:5 로 잘라서
// assets/photos/gen/<덱ID>-NN.png 로 저장하므로, 덱에 gen: true 만 있으면
// 경로를 손댈 필요가 없다.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DECKS } from './decks.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const id = (args.find((a) => a.startsWith('--deck=')) || '').split('=')[1];
const files = args.filter((a) => !a.startsWith('--'));
const deck = DECKS.find((d) => d.id === id);
if (!deck) { console.error('세트를 찾을 수 없습니다:', id); process.exit(1); }
if (!files.length) { console.error('이미지 파일을 넘겨주세요'); process.exit(1); }

const need = deck.slides.filter((s) => s.kind !== 'photoEnd').length;
if (files.length !== need)
  console.warn(`⚠ 이 세트는 ${need}장이 필요한데 ${files.length}장을 받았습니다`);

const outDir = resolve(root, 'assets/photos/gen');
mkdirSync(outDir, { recursive: true });

// 4:5 가 아닌 이미지는 가운데를 기준으로 잘라 맞춘다
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
for (let i = 0; i < files.length; i++) {
  const src = resolve(files[i]);
  if (!existsSync(src)) { console.error(`✗ 없는 파일: ${files[i]}`); continue; }
  const b64 = readFileSync(src).toString('base64');
  const ext = src.split('.').pop().toLowerCase();
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : ext === 'webp' ? 'webp' : 'png';
  await page.setContent(
    `<style>html,body{margin:0}div{width:1080px;height:1350px;`
    + `background:url('data:image/${mime};base64,${b64}') center/cover no-repeat}</style><div></div>`);
  const name = `${deck.id}-${String(i + 1).padStart(2, '0')}.png`;
  writeFileSync(resolve(outDir, name), await page.screenshot());
  console.log(`✓ assets/photos/gen/${name}   ←  ${files[i].split('/').pop()}`);
}
await browser.close();
console.log(`\n다음: node scripts/instagram/generate.mjs --deck=${deck.id}`);
