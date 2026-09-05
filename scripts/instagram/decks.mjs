// 카드 세트 정의
//   type: 'multi' = 캐러셀(표지 + 내지 + 엔딩) / 'single' = 한 장짜리
//
// ⚠️ 정책 내용은 웹 검색 요약이며 기사 원문을 대조하지 못했습니다.
//    발행 전 질병관리청 공지로 확인하세요.
const A = 'assets/photos/flu-01.jpg';  // 코 푸는 아이
const B = 'assets/photos/flu-02.jpg';  // 곰인형·주사기·마스크

export const DECKS = [
  // ── 정보체 ──────────────────────────────────────────
  {
    id: 'F-flu', type: 'multi', label: '독감 접종 · 정보체',
    slides: [
      { kind: 'photo', photo: B, pos: 'center 42%', place: '육아', cat: 'NEWS',
        head: ['독감 무료접종', '14세까지 넓어집니다'] },
      { kind: 'photoBody', photo: A, pos: 'center 88%',
        body: ['9월 21일에 시작합니다.\n2026~2027절기 국가예방접종이 내년 4월 30일까지 이어집니다.',
               '한 번에 다 열리지 않고, 대상에 따라 날짜가 나뉩니다.'] },
      { kind: 'photoBody', photo: B, pos: '62% 58%', zoom: 155,
        body: ['지원 대상이 생후 6개월부터 만 14세까지로 넓어졌습니다.\n지난 절기까지는 13세까지였습니다.',
               '2012년 1월 1일 ~ 2026년 8월 31일 출생 아동이 해당됩니다.'] },
      { kind: 'photoBody', photo: A, pos: '38% 30%', zoom: 190,
        body: ['9월 21일 — 2회 접종 대상 어린이와 임신부\n9월 28일 — 1회 접종 대상 어린이',
               '10월 12일부터는 75세 이상 어르신 접종이 시작됩니다.'] },
      { kind: 'photoBody', photo: B, pos: '28% 30%', zoom: 150,
        body: ['2회인지 1회인지는 지난 접종 이력에 따라 갈립니다.\n헷갈리면 접종 기관이나 보건소에 미리 확인하는 편이 빠릅니다.',
               '무료 대상인데 모르고 비용을 내는 경우가 적지 않습니다.'] },
      { kind: 'photoEnd', photo: A, pos: 'center 96%' },
    ],
  },

  // ── 수다체 (동네 학부모 대화 톤) ──────────────────────
  // 등장하는 "○○ 엄마"는 실존 인물이 아니라 톤을 만들기 위한 장치입니다.
  {
    id: 'T-flu-talk', type: 'multi', label: '독감 접종 · 수다체',
    slides: [
      { kind: 'photo', photo: B, pos: 'center 42%', place: '육아', cat: 'TALK',
        head: ['어머, 준수 엄마', '아직도 신청 안 했어?'] },
      { kind: 'photoBody', photo: A, pos: 'center 88%',
        body: ['카톡방 지금 난리 났잖아.\n9월 21일부터 독감 무료접종 시작이라고.',
               '몰랐어? 나만 알고 있기 미안해서 왔지.'] },
      { kind: 'photoBody', photo: B, pos: '62% 58%', zoom: 155,
        body: ['근데 올해 좀 달라졌대.\n작년까진 13세까지였는데 올해는 14세까지야.',
               '우리 서연이도 되는 거네? 어머 웬일이야.'] },
      { kind: 'photoBody', photo: A, pos: '38% 30%', zoom: 190,
        body: ['날짜도 갈린다니까 잘 봐.\n21일은 두 번 맞는 애들이랑 임산부,\n28일은 한 번 맞는 애들.',
               '이거 헷갈려서 헛걸음한 집 있대잖아.'] },
      { kind: 'photoBody', photo: B, pos: '28% 30%', zoom: 150,
        body: ['진짜 어이없는 게 뭔 줄 알아?\n공짜인 줄 모르고 돈 내고 맞은 집이 한둘이 아니래.',
               '지호 엄마도 작년에 그랬다잖아. 얼른 확인해봐.'] },
      { kind: 'photoEnd', photo: A, pos: 'center 96%' },
    ],
  },

  // ── 사진 없이 코드로 그리는 세트 ──────────────────────
  {
    id: 'V-noimg', type: 'multi', label: '독감 접종 · 사진 없이',
    slides: [
      { kind: 'talk', room: '우리 동네 학부모 방', count: '14명',
        msgs: [
          { side: 'l', who: '준수 엄마', text: '어머 이거 다들 봤어요?\n독감 무료접종 21일부터래요' },
          { side: 'l', who: '서연 엄마', text: '헐 벌써요? 작년엔 13세까지였는데' },
          { side: 'r', text: '올해는 14세까지 늘었대요 🩵' },
          { side: 'l', who: '지호 엄마', text: '우리 애도 되는 거네…\n작년엔 모르고 돈 내고 맞혔는데' },
        ] },

      { kind: 'cal', month: '9월', lead: '접종 시작일이 두 번으로 나뉩니다',
        blanks: 1, days: 30, on: [21, 28],
        keys: ['21일 — 2회 접종 대상 어린이 · 임신부', '28일 — 1회 접종 대상 어린이'] },

      { kind: 'vs', cap: '올해 달라진 것',
        unit: '세',
        beforeLabel: '지난 절기', before: '13',
        afterLabel: '올해', after: '14',
        note: '생후 6개월부터 만 14세까지 무료입니다.\n2012년 1월 1일 ~ 2026년 8월 31일 출생 아동.' },
    ],
  },

  // ── 한 장짜리 ────────────────────────────────────────
  {
    id: 'S-flu-talk', type: 'single', label: '독감 접종 · 수다체 한 장',
    slides: [
      { kind: 'photo', photo: B, pos: 'center 42%', place: '육아', cat: 'TALK',
        head: ['어머, 이거 몰랐어?', '독감 접종 14세까지래'] },
    ],
  },
];
