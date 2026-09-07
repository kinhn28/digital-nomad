// Vertex AI (Imagen) 인증 + 이미지 생성
//
// Vertex 는 API 키를 받지 않는다. 서비스 계정 JSON 으로 JWT 를 만들어
// OAuth2 액세스 토큰으로 바꿔야 한다. gcloud SDK 없이 노드만으로 처리한다.
//
// 자격 증명 위치 (둘 중 하나):
//   .env.local  의  GOOGLE_SA_JSON=<base64 로 인코딩한 서비스계정 JSON>
//   또는 파일     .gcp-sa.json   (둘 다 .gitignore 로 제외됨)
import { createSign } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export function loadServiceAccount() {
  const envFile = resolve(root, '.env.local');
  if (existsSync(envFile))
    for (const l of readFileSync(envFile, 'utf8').split('\n')) {
      const m = l.match(/^([A-Z_]+)=(.*)$/);
      if (m) process.env[m[1]] ??= m[2];
    }
  if (process.env.GOOGLE_SA_JSON)
    return JSON.parse(Buffer.from(process.env.GOOGLE_SA_JSON, 'base64').toString());
  const f = resolve(root, '.gcp-sa.json');
  if (existsSync(f)) return JSON.parse(readFileSync(f, 'utf8'));
  throw new Error('서비스 계정 자격 증명이 없습니다 (.gcp-sa.json 또는 GOOGLE_SA_JSON)');
}

const b64url = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o))
  .toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

// 서비스 계정 → 액세스 토큰 (RS256 JWT 를 직접 서명해 교환)
export async function accessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  };
  const body = `${b64url({ alg: 'RS256', typ: 'JWT' })}.${b64url(claim)}`;
  const sig = createSign('RSA-SHA256').update(body).sign(sa.private_key, 'base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${body}.${sig}`,
    }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('토큰 발급 실패: ' + JSON.stringify(j).slice(0, 300));
  return j.access_token;
}

// Imagen 으로 4:5 이미지 한 장
export async function imagen({ sa, token, prompt,
  model = 'imagen-4.0-fast-generate-001', location = 'us-central1' }) {
  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${sa.project_id}`
            + `/locations/${location}/publishers/google/models/${model}:predict`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { sampleCount: 1, aspectRatio: '4:5', personGeneration: 'allow_adult' },
    }),
  });
  const j = await r.json();
  if (j.error) throw new Error(`${j.error.code} ${j.error.status}: ${j.error.message}`);
  const b64 = j.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error('이미지가 오지 않음: ' + JSON.stringify(j).slice(0, 300));
  return Buffer.from(b64, 'base64');
}
