# 인스타그램 피드 이미지 생성기

`월요병연구소` 컨셉의 인스타그램 캐러셀(1080×1080) 이미지를 PNG로 뽑는 스크립트입니다.
HTML/CSS로 슬라이드를 그린 뒤 헤드리스 Chromium으로 캡처합니다.

## 실행

```bash
npm i -D playwright        # 최초 1회 (package-lock 갱신을 원치 않으면 --no-save)
node scripts/instagram/generate.mjs
```

출력: `public/instagram/*.png` (2160×2160, deviceScaleFactor 2 → 인스타 업로드용 고화질)
`public/instagram/preview.html` 로 전체 슬라이드를 브라우저에서 한 번에 확인할 수 있습니다.

한글이 □ 로 깨진다면 시스템에 한글 폰트가 없는 경우입니다. `Noto Sans KR` 을 설치하세요.

## 구성

| 파일 | 역할 |
| --- | --- |
| `slides.mjs` | 브랜드/카페/문구 등 **콘텐츠 데이터** — 보통 여기만 고치면 됩니다 |
| `template.mjs` | 슬라이드 HTML + CSS (디자인) |
| `generate.mjs` | Chromium 렌더링 & PNG 캡처 |

## 슬라이드 구성 (7장)

1. `01-cover` — 표지
2. `02-background` — 실험 배경(공감 후킹)
3. `03~06-cafe-00X` — 카페별 리포트 카드 (콘센트/와이파이/조용함 + 총점)
4. `07-cta` — 지도 CTA

> 카페 목록과 점수는 `src/app/page.tsx` 의 `DUMMY_CAFES` 를 기반으로 한 예시 값입니다.
> 실제 데이터 연동 후에는 `slides.mjs` 의 값을 Supabase `work_environments` 기준으로 교체하세요.
