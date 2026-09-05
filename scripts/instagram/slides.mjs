// 인스타그램 피드(캐러셀) 슬라이드 데이터
// 카페/점수 값은 src/app/page.tsx 의 DUMMY_CAFES 기반 예시 데이터입니다.

export const BRAND = {
  name: '월요병연구소',
  handle: '@monday.lab',
  tagline: '디지털 노마드를 위한 완벽한 작업 공간',
};

export const CAFES = [
  {
    no: '001',
    name: '스타벅스 무교동점',
    address: '서울 중구 무교로 21',
    scores: { plug: 5, wifi: 5, quiet: 3 },
    verdict: '콘센트 걱정 없이 노트북 풀가동',
    tags: ['🔌 콘센트 넉넉함', '📶 기가 와이파이'],
  },
  {
    no: '002',
    name: '이디야커피 시청역점',
    address: '서울 중구 서소문로 124',
    scores: { plug: 3, wifi: 4, quiet: 5 },
    verdict: '가성비로 오래 버티기 좋은 곳',
    tags: ['🤫 조용한 편', '☕ 커피 가성비'],
  },
  {
    no: '003',
    name: '블루보틀 광화문 카페',
    address: '서울 종로구 청계천로 11',
    scores: { plug: 5, wifi: 4, quiet: 4 },
    verdict: '자리마다 콘센트, 의자도 편안',
    tags: ['🪑 좌석 편함', '🔌 자리마다 콘센트', '✨ 깔끔한 인테리어'],
  },
  {
    no: '004',
    name: '투썸플레이스 을지로입구역점',
    address: '서울 중구 남대문로 117',
    scores: { plug: 4, wifi: 5, quiet: 4 },
    verdict: '화상회의도 무난한 와이파이 속도',
    tags: ['📶 빠른 와이파이', '🤫 작업하기 좋음'],
  },
];

export const SYMPTOMS = [
  { icon: '🔌', text: '콘센트 자리는 이미 만석' },
  { icon: '📶', text: '와이파이가 5분마다 끊김' },
  { icon: '🗣️', text: '옆 테이블은 오늘도 회의 중' },
  { icon: '⏱️', text: '“2시간 이용 부탁드립니다”' },
];
