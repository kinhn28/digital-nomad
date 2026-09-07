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
// --grid=2x2 : 한 장에 여러 칸이 들어 있는 이미지를 칸별로 쪼갠다
const g = (args.find((a) => a.startsWith('--grid=')) || '').split('=')[1];
const [COLS, ROWS] = g ? g.split('x').map(Number) : [1, 1];
// --from=2 : 2장부터 채운다 (표지만 따로 받은 경우)
const FROM = +((args.find((a) => a.startsWith('--from=')) || '').split('=')[1] || 1);
const files = args.filter((a) => !a.startsWith('--'));
const deck = DECKS.find((d) => d.id === id);
if (!deck) { console.error('세트를 찾을 수 없습니다:', id); process.exit(1); }
if (!files.length) { console.error('이미지 파일을 넘겨주세요'); process.exit(1); }

const need = deck.slides.filter((s) => s.kind !== 'photoEnd').length;
const got = files.length * COLS * ROWS + (FROM - 1);
if (got !== need)
  console.warn(`⚠ 이 세트는 ${need}장이 필요한데 ${got}장이 나옵니다`);

const outDir = resolve(root, 'assets/photos/gen');
mkdirSync(outDir, { recursive: true });

// 4:5 가 아닌 이미지는 가운데를 기준으로 잘라 맞춘다
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
let n = FROM - 1;
for (const f of files) {
  const src = resolve(f);
  if (!existsSync(src)) { console.error(`✗ 없는 파일: ${f}`); continue; }
  const b64 = readFileSync(src).toString('base64');
  const ext = src.split('.').pop().toLowerCase();
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : ext === 'webp' ? 'webp' : 'png';
  const url = `data:image/${mime};base64,${b64}`;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    // 칸 하나만 보이도록 확대해서 위치를 옮긴다.
    // 칸 경계에 선이 남는 경우가 있어 안쪽으로 1.5% 씩 물려 자른다
    const inset = 1.015;
    const bw = COLS * 100 * inset, bh = ROWS * 100 * inset;
    const px = COLS > 1 ? (c / (COLS - 1)) * 100 : 50;
    const py = ROWS > 1 ? (r / (ROWS - 1)) * 100 : 50;
    await page.setContent(
      `<style>html,body{margin:0;overflow:hidden}div{width:1080px;height:1350px;`
      + `background:url('${url}') ${px}% ${py}%/${bw}% ${bh}% no-repeat}</style><div></div>`);
    const name = `${deck.id}-${String(++n).padStart(2, '0')}.png`;
    writeFileSync(resolve(outDir, name), await page.screenshot());
    console.log(`✓ assets/photos/gen/${name}   ←  ${f.split('/').pop()}`
              + (g ? `  [${r + 1}행 ${c + 1}열]` : ''));
  }
}
await browser.close();
console.log(`\n다음: node scripts/instagram/generate.mjs --deck=${deck.id}`);
