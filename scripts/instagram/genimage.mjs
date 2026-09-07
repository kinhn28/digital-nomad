// 카드 배경 이미지 생성 (Gemini / Nano Banana)
//   node scripts/instagram/genimage.mjs --deck=C6-culture           실제 생성
//   node scripts/instagram/genimage.mjs --deck=C6-culture --dry     프롬프트만 출력
//   node scripts/instagram/genimage.mjs --deck=C6-culture --slide=1 특정 장만
//
// 키는 .env.local 의 GEMINI_API_KEY (깃 제외됨). 채팅이나 커밋에 넣지 말 것.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DECKS } from './decks.mjs';
import { loadServiceAccount, accessToken, imagen } from './vertex.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
if (existsSync(resolve(root, '.env.local')))
  for (const l of readFileSync(resolve(root, '.env.local'), 'utf8').split('\n')) {
    const m = l.match(/^([A-Z_]+)=(.*)$/);
    if (m) process.env[m[1]] ??= m[2];
  }

const arg = process.argv.slice(2).join(' ');
const id = (arg.match(/--deck=(\S+)/) || [])[1];
const only = +(arg.match(/--slide=(\d+)/) || [])[1] || 0;
const dry = arg.includes('--dry');
const sheet = arg.includes('--sheet');   // 붙여넣기용 프롬프트 문서 생성
const vertex = arg.includes('--vertex');   // Vertex AI(Imagen) 경로. 무료 크레딧 사용
const model = (arg.match(/--model=(\S+)/) || [])[1]
  || (vertex ? 'imagen-4.0-fast-generate-001' : 'gemini-3-pro-image');
const deck = DECKS.find((d) => d.id === id);
if (!deck) { console.error('세트를 찾을 수 없습니다:', id); process.exit(1); }

// ── 부모로 이미지 스타일 ────────────────────────────────────────
// 참고: 일본 광고 포스터 — 단일 주인공, 채도 높은 단색 배경, 과장된 표정,
// 큰 여백. 카드 하단 24%에 글자가 얹히므로 그 자리는 비워 둔다.
const STYLE = [
  'Japanese advertising poster aesthetic, bold and eye-catching.',
  'One clear subject, exaggerated expressive emotion, dynamic sense of motion.',
  'Saturated flat single-colour background, crisp studio lighting, high contrast.',
  'Photographic and real, not illustration, not 3D render.',
  'Korean people, Korean home or Korean clinic setting.',
  'Vertical 4:5 composition. Subject placed in the upper two thirds.',
  'The lower third must stay visually calm and uncluttered for text overlay.',
  'Absolutely no text, no letters, no numbers, no logos, no watermark, no signature.',
].join(' ');

// 배경색은 세트마다 다르게 — 피드가 한 색으로 안 몰리도록
const TONES = ['warm yellow', 'coral pink', 'sky blue', 'mint green',
               'deep navy', 'cream beige', 'vivid orange', 'soft lilac'];

const scenePrompt = (slide, i) => {
  // scene 이 있으면 그걸 쓴다. 한국어 카피를 그대로 넘기면 이미지 모델이
  // 글자를 그려 넣거나 엉뚱하게 해석한다 — 영어 장면 묘사가 훨씬 안전하다.
  const line = slide.scene || (slide.kind === 'photo'
    ? slide.head.join(' ')
    : (slide.lead || (slide.items || []).join(' ')));
  const tone = TONES[(deck.id.length + i) % TONES.length];
  return `${STYLE}\nBackground colour: ${tone}.\n`
       + `Scene: ${line}`;
};

const slides = deck.slides.filter((s) => s.kind !== 'photoEnd');
const outDir = resolve(root, 'assets/photos/gen');
mkdirSync(outDir, { recursive: true });

// --sheet : 다른 도구(제미나이 앱 등)에 붙여넣을 프롬프트 문서를 만든다.
// API 결제가 없어도 이 문서로 이미지를 받아 assets/photos/ 에 넣으면 그대로 이어진다.
if (sheet) {
  const md = [`# ${deck.label} — 이미지 프롬프트`, '',
    `세트 \`${deck.id}\` · ${slides.length}장. 아래 프롬프트를 이미지 생성 도구에 그대로 붙여넣고,`,
    `받은 이미지를 \`assets/photos/\` 에 저장한 뒤 덱의 photo 경로를 바꿔 주세요.`,
    '', '비율은 **4:5 세로**로 받으세요. 글자가 들어간 이미지는 다시 받으세요.', ''];
  slides.forEach((sl, i) => {
    md.push(`## ${i + 1}장 — ${sl.kind === 'photo' ? '표지' : (sl.lead || '내지')}`, '',
            '```', scenePrompt(sl, i), '```', '');
  });
  const out = resolve(root, `public/instagram/${deck.id}-prompts.md`);
  writeFileSync(out, md.join('\n'));
  console.log('📝', out.replace(root + '/', ''));
  process.exit(0);
}

let sa, token;
if (vertex && !dry) {
  sa = loadServiceAccount();
  token = await accessToken(sa);
  console.log(`Vertex · 프로젝트 ${sa.project_id} · 모델 ${model}`);
}

for (let i = 0; i < slides.length; i++) {
  if (only && only !== i + 1) continue;
  const prompt = scenePrompt(slides[i], i);
  const name = `${deck.id}-${String(i + 1).padStart(2, '0')}.png`;
  if (dry) { console.log(`\n── ${name} ──\n${prompt}`); continue; }

  if (vertex) {
    try {
      writeFileSync(resolve(outDir, name), await imagen({ sa, token, prompt, model }));
      console.log(`✓ assets/photos/gen/${name}`);
    } catch (e) { console.error(`✗ ${name}  ${e.message}`); }
    continue;
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
    + `?key=${process.env.GEMINI_API_KEY}`,
    { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
  const j = await res.json();
  if (j.error) { console.error(`✗ ${name}  ${j.error.code} ${j.error.status}`); continue; }
  const img = (j.candidates?.[0]?.content?.parts || []).find((p) => p.inlineData);
  if (!img) { console.error(`✗ ${name}  이미지가 오지 않음`); continue; }
  writeFileSync(resolve(outDir, name), Buffer.from(img.inlineData.data, 'base64'));
  console.log(`✓ assets/photos/gen/${name}`);
}
