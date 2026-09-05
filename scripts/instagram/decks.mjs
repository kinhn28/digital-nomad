// 2026~2027절기 독감 국가예방접종 — 사진형 캐러셀
//
// ⚠️ 내용은 웹 검색 결과 요약이며 기사 원문을 대조하지 못했습니다.
//    발행 전 질병관리청 공지로 확인하고 source 를 채우세요.
const P = 'assets/photos/flu-01.jpg';

export const DECKS = [
  {
    id: 'F-flu',
    slides: [
      { kind: 'photo', photo: P, pos: 'center 22%',
        place: '육아', cat: 'NEWS',
        head: ['독감 무료접종', '14세까지 넓어집니다'] },

      { kind: 'photoBody', photo: P, pos: 'center 88%',
        body: ['9월 21일에 시작합니다.\n2026~2027절기 국가예방접종이 내년 4월 30일까지 이어집니다.',
               '한 번에 다 열리지 않고, 대상에 따라 날짜가 나뉩니다.'] },

      { kind: 'photoBody', photo: P, pos: '38% 30%', zoom: 190,
        body: ['지원 대상이 생후 6개월부터 만 14세까지로 넓어졌습니다.\n지난 절기까지는 13세까지였습니다.',
               '2012년 1월 1일 ~ 2026년 8월 31일 출생 아동이 해당됩니다.'] },

      { kind: 'photoBody', photo: P, pos: 'center 96%',
        body: ['9월 21일 — 2회 접종 대상 어린이와 임신부\n9월 28일 — 1회 접종 대상 어린이',
               '10월 12일부터는 75세 이상 어르신 접종이 시작됩니다.'] },

      { kind: 'photoBody', photo: P, pos: '62% 62%', zoom: 165,
        body: ['2회인지 1회인지는 지난 접종 이력에 따라 갈립니다.\n헷갈리면 접종 기관이나 보건소에 미리 확인하는 편이 빠릅니다.',
               '무료 대상인데 모르고 비용을 내는 경우가 적지 않습니다.'],
        source: '자료 출처를 여기에' },

      { kind: 'photoEnd', photo: P, pos: 'center 15%' },
    ],
  },
];
