<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 부모로 (bumoro)

단어 하나로 모인 방에서 부모들이 하루 종일 이야기하는 커뮤니티. 마스터가 단어를
열고, 매월 가장 활발한 부모가 다음 달 메인 배너의 주인이 된다.

## 눈에 보이는 걸 만들기 전에

화면·목업·시안·카드뉴스·랜딩·기획서 등 **부모로의 결과물을 만들 때는 먼저
`.claude/skills/bumoro-ui/SKILL.md`를 읽는다.** 톤앤매너는 흰색·하늘색이고,
지켜야 할 규칙과 피해야 할 패턴이 거기 다 있다.

요약만 옮기면:

- **3톤** — 흰색(정보) · 하늘(혜택·브랜드) · 네이비(힐링·새벽). 이 셋만 쓴다.
- **하늘색 글자는 `--sky-d`**, 면은 `--sky`. 바꿔 쓰면 대비가 무너진다.
- **Pretendard 800**, 제목 자간 -.03~-.05em, 본문 행간 1.7~1.85, `word-break: keep-all`.
- **폰트 크기는 0.5px 단위** (14.5 / 13.5 / 12.5 …). 정수 스케일은 템플릿처럼 보인다.
- **카피는 반말**, UI 크롬만 해요체. 이모지는 🩵 하나. 섹션 제목에 이모지 금지.
- 내보내기 전 `references/anti-patterns.md` 체크리스트를 훑는다.

## 색·폰트를 코드에서 쓰는 법

토큰은 `src/app/globals.css`에 이미 들어가 있고 shadcn 토큰이 이걸 가리킨다.
Tailwind 유틸리티(`bg-background`, `text-muted-foreground`, `border-border`)를 쓰면
자동으로 부모로 팔레트가 적용된다. 브랜드 전용 색이 필요하면 CSS 변수를 직접 쓴다:
`text-[var(--sky-d)]`, `bg-[var(--sky-bg)]`, `bg-[var(--navy)]`.

새벽 모드는 `<html data-mode="dawn">` 또는 `.dark`로 켜진다. 두 셀렉터가 같은
토큰을 덮는다.

Pretendard는 Google Fonts에 없어서 `next/font` 대신 CDN `<link>`로 불러온다
(`src/app/layout.tsx`). Artifact처럼 CSP가 막는 곳에서는 Inter + Noto Sans KR로
대체하고 제목 weight를 900으로 올린다.
