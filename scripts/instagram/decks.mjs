// 카드 세트 정의
//   type: 'multi' = 캐러셀(표지 + 내지 + 엔딩) / 'single' = 한 장짜리
//
// ⚠️ 정책 내용은 웹 검색 요약이며 기사 원문을 대조하지 못했습니다.
//    발행 전 질병관리청 공지로 확인하세요.
const A = 'assets/photos/flu-01.jpg';  // 코 푸는 아이
const B = 'assets/photos/flu-02.jpg';  // 곰인형·주사기·마스크
const C = 'assets/photos/chuseok-pharmacy.jpg';  // 약국 간판

export const DECKS = [
  // ── 정보체 ──────────────────────────────────────────
  {
    id: 'F-flu', type: 'done', label: '독감 접종 · 정보체',
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
    id: 'T-flu-talk', type: 'done', label: '독감 접종 · 수다체',
    slides: [
      { kind: 'photo', photo: B, pos: 'center 42%', place: '독감 예방접종', cat: '건강정보',
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

  // ── 추석 연휴 문 여는 병원·약국 ────────────────────────
  {
    id: 'C-chuseok', type: 'done', label: '추석 연휴 병원 · 수다체',
    slides: [
      { kind: 'photo', photo: C, pos: 'center',
        place: '추석 연휴 병원', cat: '건강정보',
        head: ['어머, 연휴에 애 아프면', '어디로 가야 돼?'] },

      { kind: 'photoBody', photo: C, pos: '18% center',
        body: ['올해 추석은 9월 24일 목요일부터 26일 토요일까지야.\n일요일까지 치면 나흘을 내리 쉬는 거지.',
               '문제는 그동안 동네 병원이 다 닫는다는 거잖아.'] },

      { kind: 'photoBody', photo: C, pos: '80% center',
        body: ['근데 찾는 방법이 다 있더라고.\n응급의료포털에 들어가면 연휴에 문 여는 병원이랑 약국이 다 떠.',
               '포털에서 "문 여는 병원"이라고만 쳐도 연결돼.'] },

      { kind: 'photoBody', photo: C, pos: '42% center',
        body: ['찾기 귀찮으면 그냥 전화해.\n129번은 보건복지부, 120번은 우리 시청이야.',
               '앱이 편하면 "응급똑똑" 깔아둬.\n증상 넣으면 응급실 갈 일인지 아닌지 알려준대.'] },

      { kind: 'photoBody', photo: C, pos: '92% center',
        body: ['12세 이하는 "아이안심톡"으로 24시간 상담도 돼.\n애매할 때 먼저 물어보고 움직이면 헛걸음을 안 하지.',
               '물론 애가 많이 안 좋아 보이면 고민하지 말고 119야.'] },

      { kind: 'photoEnd', photo: C, pos: 'center' },
    ],
  },

  // ── 사진 없이 코드로 그리는 세트 ──────────────────────
  {
    id: 'V-noimg', type: 'draft', label: '독감 접종 · 사진 없이',
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
    id: 'S-flu-talk', type: 'done', label: '독감 접종 · 수다체 한 장',
    slides: [
      { kind: 'photo', photo: B, pos: 'center 42%', place: '독감 예방접종', cat: '건강정보',
        head: ['어머, 이거 몰랐어?', '독감 접종 14세까지래'] },
    ],
  },
];

// ── 2026-09-05 · 5개 세트 ─────────────────────────────────
// 한 세트 안에서 사진 크기·위치는 photoDefaults 로 고정하고, 음영만 카드 종류별로 달라집니다.
// 표지 오프닝은 hooks.md 의 패턴을 하나씩 다르게 씁니다.
DECKS.push(
  {
    // 오프닝 패턴: 억울함
    id: 'D1-daycare', type: 'multi', label: '어린이집 비용',
    photoDefaults: { photo: 'assets/photos/daycare.png', pos: 'center' },
    slides: [
      { kind: 'photo', place: '어린이집 비용', cat: '보육',
        head: ['우리만 낸 거였어?', '특별활동비 없어진대'] },
      { kind: 'photoBody',
        body: ['어린이집 특별활동비랑 현장학습비를 정부가 대신 내주는 쪽으로 바뀐다는 얘기가 이번에 나왔더라고.',
               '4~5세 무상교육도 더 넓힌다고 하더라.'] },
      { kind: 'photoBody',
        body: ['0세반은 선생님 한 명이 보던 아이 수도 줄인다고 해.',
               '보는 눈이 늘어난다는 건 부모 입장에선 제일 반가운 얘기지.'] },
      { kind: 'photoBody',
        body: ['근데 언제부터 적용되는지는 아직 확실하지 않아.',
               '등원할 때 한 번 물어보는 게 제일 빨라.'] },
      { kind: 'photoEnd' },
    ],
  },
  {
    // 오프닝 패턴: 경고
    id: 'D2-sickday', type: 'multi', label: '아플 때 등원 기준',
    photoDefaults: { photo: 'assets/photos/sick-child.jpg', pos: 'center' },
    slides: [
      { kind: 'photo', place: '등원 기준', cat: '건강정보',
        head: ['이거 모르면 헛걸음해', '언제 보내고 언제 쉬어?'] },
      { kind: 'photoBody',
        body: ['개학하고 나면 한 명 걸리는 순간 반 전체가 다 도는 거, 여기 다들 한 번쯤은 겪어봤던 일이잖아.',
               '제일 헷갈리는 게 언제 다시 보내느냐야.'] },
      { kind: 'photoBody',
        body: ['등원 기준은 병마다 다르고, 결국 다니는 기관 방침이 기준이 되는 경우가 대부분이라고 보면 돼.',
               '카더라만 믿고 보내면 서로 곤란해지니까 등원 전에 전화 한 통 넣어보는 게 제일 빠르고 정확하더라.'] },
      { kind: 'photoBody',
        body: ['열이 내려도 하루는 더 지켜보라는 곳이 많아.',
               '애매하면 소아과에서 확인받고 움직이는 게 맞고, 많이 안 좋아 보이면 고민하지 말고 바로 병원이야.'] },
      { kind: 'photoEnd' },
    ],
  },
  {
    // 오프닝 패턴: 팁 흘리기
    id: 'D3-drive', type: 'multi', label: '장거리 이동',
    photoDefaults: { photo: 'assets/photos/traffic.jpg', pos: 'center' },
    slides: [
      { kind: 'photo', place: '추석 장거리 이동', cat: '실전정보',
        head: ['이건 알아두면 편해', '차에서 세 시간 버티기'] },
      { kind: 'photoBody',
        body: ['올해 추석은 9월 24일 목요일부터 26일 토요일까지야.',
               '명절 연휴가 일요일까지 나흘이라, 길 위에서 보내는 시간도 그만큼 길어진다고 보면 되는 거지 뭐.'] },
      { kind: 'photoBody',
        body: ['출발 전에 화장실 한 번, 출발하고는 두 시간마다 한 번씩 쉬어.',
               '아이는 어른보다 훨씬 빨리 지치더라고.'] },
      { kind: 'photoBody',
        body: ['간식이랑 물티슈는 뒷좌석 손 닿는 자리에 두는 게 편해.',
               '멀미약은 나이마다 먹을 수 있는 게 달라서 약국에서 미리 물어보고 챙겨두는 편이 안전하더라고.'] },
      { kind: 'photoEnd' },
    ],
  },
  {
    // 오프닝 패턴: 공감 한숨
    id: 'D4-money', type: 'multi', label: '추석 용돈',
    photoDefaults: { photo: 'assets/photos/money.webp', pos: 'center' },
    slides: [
      { kind: 'photo', place: '추석 용돈', cat: '부모경제',
        head: ['올해도 이 고민이네', '조카 용돈 얼마 줘야 돼'] },
      { kind: 'photoBody',
        body: ['명절만 되면 꼭 이 얘기가 나와.',
               '많이 주자니 부담이고, 적게 주자니 눈치 보이고.'] },
      { kind: 'photoBody',
        body: ['집집마다 기준이 달라서 정답이 없더라.',
               '나이로 정하는 집도 있고, 학년으로 정하는 집도 있고, 아예 안 주기로 합의했다는 집도 있더라고.'] },
      { kind: 'photoBody',
        body: ['금액이랑 줄 사람만 미리 정해두면 명절 현장에서 서로 눈치싸움 할 일이 아예 없어지더라고.',
               '다들 올해는 얼마로 잡았어? 댓글에 좀 알려줘.'] },
      { kind: 'photoEnd' },
    ],
  },
  {
    // 오프닝 패턴: 시간 압박
    id: 'D5-tax', type: 'multi', label: '근로장려금 마감',
    photoDefaults: { photo: 'assets/photos/family.jpg', pos: 'center' },
    slides: [
      { kind: 'photo', place: '근로장려금', cat: '지원금',
        head: ['이번 주 지나면 끝이야', '9월 15일이 마지막'] },
      { kind: 'photoBody',
        body: ['근로장려금 반기 신청 마감이 9월 15일이래.',
               '오늘 기준으로 열흘 남았어.'] },
      { kind: 'photoBody',
        body: ['맞벌이든 외벌이든 조건이 맞으면 대상이야.',
               '우리가 해당되는지는 홈택스에서 바로 조회돼.'] },
      { kind: 'photoBody',
        body: ['안내문을 못 받았다고 대상이 아닌 건 아니라더라.',
               '직접 한 번 조회해보는 게 확실해. 몇 분이면 끝나.'] },
      { kind: 'photoEnd' },
    ],
  },
);

// ── 커뮤니티에서 나온 이야기 ───────────────────────────────
// 오픈채팅 5개 방에서 반복되던 질문을 정리한 것. 특정 대화를 옮기지 않고
// 여러 번 나온 내용만 추려 각색했습니다. 이름은 실존 인물이 아닙니다.
DECKS.push({
  // 오프닝 패턴: 남 얘기
  id: 'A1-allergy', type: 'multi', label: '이유식 알러지 테스트',
  photoDefaults: { photo: 'assets/photos/babyfood.jpg', pos: 'center' },
  slides: [
    { kind: 'photo', place: '이유식 알러지 테스트', cat: '육아꿀팁',
      head: ['나만 몰랐던 거야?', '알러지 테스트 3가지'] },

    { kind: 'photoBody',
      lead: '1. 새 재료는 하루에 딱 하나씩만',
      items: ['두세 개를 같이 넣으면 뭐 때문인지 몰라',
              '하윤이네도 그러다 처음부터 다시 했대'] },

    { kind: 'photoBody',
      lead: '2. 먹이는 시간은 아침이나 점심',
      items: ['낮에 먹여야 병원 문 열었을 때 갈 수 있어',
              '저녁에 처음 먹였다 밤에 당황한 집이 제일 많더라'] },

    { kind: 'photoBody',
      lead: '3. 한 가지 넣고 사나흘은 지켜보기',
      items: ['며칠 뒤에 올라오는 경우도 있대',
              '뭘 언제 먹였는지 메모해두면 훨씬 편해'] },

    { kind: 'photoBody',
      lead: '이상이 보이면 그 재료는 일단 멈추기',
      items: ['발진이 올라오면 소아과에 확인받는 게 먼저',
              '여긴 부모들 경험이고, 판단은 병원에서'] },

    { kind: 'photoEnd' },
  ],
});

// 오프닝 패턴: 반전 — 잘 재우려고 산 게 위험해진다는 뒤집기
DECKS.push({
  id: 'B1-rollover', type: 'multi', label: '뒤집기 시작하면 수면템',
  photoDefaults: { photo: 'assets/photos/rollover.jpg', pos: 'center' },
  slides: [
    { kind: 'photo', place: '뒤집기 시작 시기', cat: '수면안전',
      head: ['어제 처음 뒤집었는데', '오늘 밤 뺄 것 3가지'] },

    { kind: 'photoBody', lead: '1. 스와들업은 뒤집기 전에 졸업',
      items: ['팔이 묶인 채로 엎어지면 스스로 빠져나오질 못해',
              '한 번에 빼면 아예 못 자니까 한쪽 팔씩 천천히 풀어줘'] },

    { kind: 'photoBody', lead: '2. 자는 자리엔 아무것도 두지 않기',
      items: ['바디필로우도 범퍼도 뒤집기 시작하면 다 소용없더라',
              '푹신한 이불이랑 베개는 특히 위험하다고 하더라고'] },

    { kind: 'photoBody', lead: '3. 되집기 할 때까지는 지켜보기',
      items: ['뒤집고 되돌아오질 못하면 그대로 얼굴이 묻혀버려',
              '되집기까지 한 달 넘게 걸리는 집도 생각보다 많더라'] },

    { kind: 'photoBody', lead: '이불이 걱정되면 수면조끼로 바꾸기',
      items: ['이불 대신 입혀두면 얼굴이 덮일 일이 아예 없어',
              '팔다리는 자유로우니까 밤새 굴러다녀도 괜찮아'] },

    { kind: 'photoEnd' },
  ],
});

// 오프닝 패턴: 코웃음 — 인스타의 "70일 통잠" 자랑에 대한 반응
DECKS.push({
  id: 'B2-nightfeed', type: 'multi', label: '새벽수유 끊는 순서',
  photoDefaults: { photo: 'assets/photos/nightfeed.jpg', pos: 'center' },
  slides: [
    { kind: 'photo', place: '새벽수유 끊기', cat: '아기수면',
      head: ['70일에 통잠은 무슨', '새벽수유 끊는 순서 3가지'] },

    { kind: 'photoBody', lead: '1. 낮에 먹는 양부터 채우기',
      items: ['낮에 덜 먹으면 밤에 딱 그만큼 깨서 찾더라',
              '100일쯤 통잠을 못 자면 낮 총량부터 확인해봐'] },

    { kind: 'photoBody', lead: '2. 깨자마자 바로 안지 않기',
      items: ['낑낑대다 손 빨면서 혼자 다시 잠드는 날도 있어',
              '몇 분만 기다려보고 그래도 울면 그때 가는 거야'] },

    { kind: 'photoBody', lead: '3. 한 번에 끊지 말고 꿈수부터',
      items: ['자는 상태로 먹이는 꿈수로 한 단계만 줄여보는 거지',
              '낮에 먹는 양이 차면 어느 날 저절로 없어지더라고'] },

    { kind: 'photoBody', lead: '다시 깨도 실패한 게 아니야',
      items: ['수면퇴행이 오면 끊었던 새벽수유도 돌아온대',
              '47일에 통잠 온 집도, 150일에 온 집도 다 있어'] },

    { kind: 'photoEnd' },
  ],
});
