// 카드/레퍼런스의 세로 밝기 곡선을 재는 도구
//   node scripts/instagram/profile.mjs <파일> [y0] [y1]
// 텍스트를 피해 오른쪽 여백 구간만 측정합니다.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

export async function profile(page, file, y0 = 0, y1 = 0) {
  const b64 = readFileSync(file).toString('base64');
  return page.evaluate(async ([b64, y0, y1]) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const cv = document.getElementById('c');
    cv.width = img.width; cv.height = img.height;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const lin = (v) => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    const H = (y1 || img.height) - y0, out = [];
    for (let k = 0; k <= 100; k += 5) {
      const y = Math.min(Math.round(y0 + H * k / 100), img.height - 1);
      const x0 = Math.round(img.width * 0.70), w = Math.round(img.width * 0.28);
      const d = ctx.getImageData(x0, y, w, 1).data;
      let s = 0, n = 0;
      for (let i = 0; i < d.length; i += 4)
        { s += 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]); n++; }
      out.push(+(s / n).toFixed(3));
    }
    return out;
  }, [b64, y0, y1]);
}

export async function withPage(fn) {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setContent('<canvas id=c></canvas>');
  const r = await fn(p);
  await b.close();
  return r;
}
