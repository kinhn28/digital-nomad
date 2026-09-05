// 부모로 브랜드 토큰 — 인스타그램 콘텐츠 시안(HTML) 기준
export const BRAND = {
  name: '부모로',
  handle: '@bumoro.kr',
  bio: '받을 수 있는 건 다 챙겨요. 부모 마음까지도 🩵',
  // 실제 로고: 굵은 한글 워드마크 + 하늘색 밑줄 바
  wordmark: '부모로',
  wordmarkBar: '#8FCDE2',
  tagline: '꼭 필요한 것만 골라드려요',
};

// 사진 위에 얹는 표지 문법 — 잡지형
export const PHOTO = {
  // 표지: 사진을 최대한 살리고, 헤드라인이 앉는 맨 아래만 눌러줌
  scrimCover: 'linear-gradient(to bottom, rgba(0,0,0,.14) 0%, rgba(0,0,0,0) 20%,'
            + ' rgba(0,0,0,0) 52%, rgba(0,0,0,.55) 78%, rgba(0,0,0,.88) 100%)',
  // 내지: 사진을 배경 질감으로 깔고 글이 앞으로 나오게 전면을 눌러줌
  scrimBody: 'linear-gradient(to bottom, rgba(0,0,0,.58) 0%, rgba(0,0,0,.60) 45%,'
           + ' rgba(0,0,0,.80) 75%, rgba(0,0,0,.92) 100%)',
  // 엔딩: 전면을 고르게 눌러 워드마크만 남김
  scrimEnd: 'linear-gradient(rgba(0,0,0,.64), rgba(0,0,0,.64))',
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

// 표지 좌하단 분류 표기 — `소재 | 분류` 형태로 씁니다.
// 표지 문구는 수다체로 가더라도, 이 자리에는 무슨 정보인지가 그대로 드러나야 합니다.
export const CATEGORIES = {
  '건강정보': '예방접종 · 유행병 · 시기별 건강',
  '지원금':   '정부·지자체 현금 지원',
  '제도':     '육아휴직 · 근로시간 등 제도 변화',
  '보육':     '어린이집 · 유치원 · 학교',
  '부모경제': '가계 · 재테크 · 부동산',
  '꿀템':     '공구 · 제품 · 앱',
  '맘카페썰': '커뮤니티에서 나온 이야기',
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
