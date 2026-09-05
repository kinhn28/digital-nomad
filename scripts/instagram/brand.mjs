// 부모로 브랜드 토큰 — 인스타그램 콘텐츠 시안(HTML) 기준
export const BRAND = {
  name: '부모로',
  handle: '@bumoro.kr',
  bio: '받을 수 있는 건 다 챙겨요. 부모 마음까지도 🩵',
  wordmark: 'bumoro',            // 좌상단 고정 워드마크
  tagline: '부모 소식은 부모로',   // 엔딩 카드 한 줄
};

// 사진 위에 얹는 표지 문법 — 잡지형
export const PHOTO = {
  // 표지: 아래 1/3만 눌러 사진을 살림
  scrimCover: 'linear-gradient(to bottom, rgba(0,0,0,.30) 0%, rgba(0,0,0,0) 28%,'
            + ' rgba(0,0,0,.52) 64%, rgba(0,0,0,.86) 100%)',
  // 내지: 본문이 얹히므로 절반 이상을 눌러 가독성 확보
  scrimBody: 'linear-gradient(to bottom, rgba(0,0,0,.22) 0%, rgba(0,0,0,.08) 24%,'
           + ' rgba(0,0,0,.62) 56%, rgba(0,0,0,.90) 100%)',
  // 엔딩: 전면을 고르게 눌러 워드마크만 남김
  scrimEnd: 'linear-gradient(rgba(0,0,0,.46), rgba(0,0,0,.46))',
};

// 시안 CSS의 :root 값 그대로
export const P = {
  ink: '#14181F', g8: '#2E3642', g7: '#4B5563', g6: '#697180', g5: '#8A92A1', g4: '#B2B9C4',
  line: '#F0F1F4', line2: '#E4E7EB', sub: '#F4F5F7',
  blue: '#2B6FFF', blueBg: '#EBF1FF',
  sky: '#4FA9C7', skyD: '#2E7E9A', skyL: '#8FCDE2', skyBg: '#EAF5F9',
  navy: '#141A2E', navy2: '#1D2742', moon: '#F4D06F', navySub: '#8E9AB8',
  cream: '#FCFAF6', amber: '#E28800', coral: '#FF5C6C',
};

// 피드 3톤: 흰색(정보) · 하늘(혜택) · 네이비(힐링)
export const THEMES = {
  benefit: { bg: P.skyBg, fg: P.ink, accent: P.skyD, meta: P.g6, rule: '#D3E5EC',
             body: P.g7, label: '부모로 · 혜택' },
  dawn:    { bg: P.navy, fg: '#F2F4F8', accent: P.moon, meta: P.navySub,
             rule: 'rgba(255,255,255,.16)', body: P.navySub, label: '부모로 · 새벽', serif: true },
  info:    { bg: P.cream, fg: P.ink, accent: P.amber, meta: P.g6, rule: P.line2,
             body: P.g7, label: '부모로 · 정보' },
  story:   { bg: '#FFFFFF', fg: P.ink, accent: P.blue, meta: P.g5, rule: P.line2,
             body: P.g7, label: '부모로 · 이야기' },
};
