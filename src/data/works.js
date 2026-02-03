// src/data/works.js

/**
 * ✅ 정렬:
 * - work.info.year 기준 내림차순(최신 → 과거)
 * - year가 없거나 숫자로 변환 불가면 0 처리
 *
 * ✅ 페이지네이션:
 * - paginateWorks(list, page, perPage) 제공
 *
 * ✅ media:
 * - kind: 'youtube' | 'file'
 * - src: 유튜브 URL 또는 mp4 경로
 *
 * ✅ tags:
 * - 기존 tags + 자동 태그를 합쳐서 중복 제거 후 사용
 */

// =========================
// Auto Tags (rule-based)
// =========================
const TAG_RULES = {
  // title 기반 "작업 타입" 태그
  typeFromTitle: [
    [/^POP\s*\|/i, "POP"],
    [/^Full\s*Banner/i, "Full Banner"],
    [/^메뉴보드/i, "Menu Board"],
    [/인포그래픽/i, "Infographic"],
    [/캠페인/i, "Campaign"],
    [/행사/i, "Event"],
    [/영상\s*템플릿|템플릿/i, "Template"],
    [/전시포스터|포스터/i, "Poster"],
    [/로고\s*애니메이션/i, "Logo Animation"],
    [/유튜브\s*콘텐츠/i, "YouTube"],
    [/카드뉴스/i, "Card News"],
    [/홍보\s*영상/i, "Promo Film"],
    [/프로모션/i, "Promotion"],
    [/제품\s*홍보/i, "Product Promo"],
    [/브랜드\s*홍보/i, "Brand Film"],
  ],

  // slug/image/title/summary 등에서 "확실한" 클라이언트/브랜드만 추출
  clientFromAny: [
    [/artbox/i, "ARTBOX"],
    [/ediya|eydia/i, "EDIYA"],
    [/twosome|twosom/i, "TWOSOME"],
    [/mmth/i, "MMTH"],
    [/uptention/i, "UPTENTION"],
    [/daehan/i, "DAEHAN"],

    [/GS25/i, "GS25"],
    [/갤럭시|Galaxy/i, "Galaxy"],
    [/롯데관광/i, "LOTTE TOUR"],
    [/유한/i, "YUHAN"],
    [/방배유스센터/i, "Bangbae Youth Center"],
    [/대구한의대|K\s*MEDI/i, "K-MEDI"],
    [/Woom/i, "WOOM"],
    [/PRMR/i, "PRMR"],
    [/Mongs/i, "Mongs"],
    [/B1B1/i, "B1B1"],
  ],
};

function normalizeTag(tag) {
  return String(tag || "").trim();
}

function uniqTags(tags) {
  const seen = new Set();
  const out = [];
  for (const t of tags.map(normalizeTag).filter(Boolean)) {
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

function pickTagsByRules(text, rules) {
  const out = [];
  const s = String(text || "");
  for (const [re, tag] of rules) {
    if (re.test(s)) out.push(tag);
  }
  return out;
}

function buildAutoTags(work) {
  const tags = [];

  // 1) category 기반 태그
  if (work?.category === "agency") tags.push("Agency");
  if (work?.category === "digital-signage") tags.push("Digital Signage");

  // 2) title 기반 타입 태그
  tags.push(...pickTagsByRules(work?.title, TAG_RULES.typeFromTitle));

  // 3) signage의 대표 포맷이면 루핑 태그
  const isSignage = work?.category === "digital-signage";
  const title = String(work?.title || "");
  if (
    isSignage &&
    (/^POP\s*\|/i.test(title) || /^Full\s*Banner/i.test(title) || /^메뉴보드/i.test(title))
  ) {
    tags.push("Looping");
  }

  // 4) any-text에서 클라이언트/브랜드 태그 추출(확실한 것만)
  const blob = [work?.slug, work?.image, work?.title, work?.summary].filter(Boolean).join(" ");
  tags.push(...pickTagsByRules(blob, TAG_RULES.clientFromAny));

  // 5) 키워드 기반 보조 태그
  const sum = String(work?.summary || "");
  if (/콜라보|collab/i.test(sum + " " + title)) tags.push("Collaboration");
  if (/시즌|할로윈|새학기|발렌타인|여름|봄|가을|겨울|새해/i.test(sum + " " + title))
    tags.push("Seasonal");
  if (/프로모션|이벤트|event/i.test(sum + " " + title)) tags.push("Event Promo");
  if (/DID|사이니지|signage/i.test(sum + " " + title)) tags.push("Signage");

  // 6) 해상도/포맷(문장에 명시된 경우만)
  if (/960x1080/i.test(sum + " " + title)) tags.push("960x1080");

  return uniqTags(tags);
}

function mergeTags(work) {
  const existing = Array.isArray(work?.tags) ? work.tags : [];
  const auto = buildAutoTags(work);
  return uniqTags([...existing, ...auto]);
}

// =========================
// Raw Works Data
// =========================
const rawWorks = [
  // --- digital-signage ---
  {
    title: "POP | 새학기 프로모션",
    slug: "pop-artbox-01",
    category: "digital-signage",
    image: "/images/projects/POP_artbox_01.jpg",
    tags: ["POP", "Digital Signage"],
    summary:
      "이 영상은 새학기 시즌에 맞춰 기획·제작되었으며, 해당 시즌과 연관된 제품의 홍보 및 판매 촉진을 목적으로 제작되었습니다.",
    info: { year: "2024년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/muUWRXHJn68" },
  },
  {
    title: "POP | 멤버십 가입 안내",
    slug: "pop-artbox-02",
    category: "digital-signage",
    image: "/images/projects/POP_artbox_02.jpg",
    tags: ["POP", "Digital Signage"],
    summary:
      "이 영상은 고객사의 멤버십 가입을 유도하기 위해 제작되었습니다. 거북이 캐릭터의 특성을 활용해 시각적 재미를 더하고, 멤버십 가입 시 제공되는 혜택 정보를 효과적으로 전달하는데 중점을 두었습니다.",
    info: { year: "2024년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/NOarf3mNDu8" },
  },
  {
    title: "POP | 모바일 상품권 안내",
    slug: "pop-artbox-03",
    category: "digital-signage",
    image: "/images/projects/POP_artbox_03.jpg",
    tags: ["POP", "Digital Signage"],
    summary:
      "이 영상은 고객사의 모바일 상품권을 홍보하기 위해 제작되었습니다. 텍스트 정보와 이미지가 순차적으로 전달되도록 타이밍을 조절하여, 시청자가 내용을 자연스럽게 인식할 수 있도록 구성하였습니다.",
    info: { year: "2022년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/LA77OSrIjHc" },
  },
  {
    title: "POP | 리뷰쓰기",
    slug: "pop-artbox-04",
    category: "digital-signage",
    image: "/images/projects/POP_artbox_04.jpg",
    tags: ["POP", "Digital Signage"],
    summary:
      "이 영상은 상품을 구매한 소비자들이 리뷰를 작성하도록 유도하기 위해 제작되었습니다. 고객사 앱 내 리뷰 작성 기능을 보다 직관적으로 전달하기 위해, 하나의 장면을 여러 컷으로 나누어 연출했습니다.",
    info: { year: "2024년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/_-dQqjLaKyE" },
  },
  {
    title: "POP | 할로윈 시즌",
    slug: "pop-artbox-05",
    category: "digital-signage",
    image: "/images/projects/POP_artbox_05.jpg",
    tags: ["POP", "Digital Signage"],
    summary:
      "이 영상은 할로윈 시즌 한정 상품의 판매를 촉진하기 위해 제작되었습니다. 할로윈 특유의 분위기와 감성을 살리기 위해 스토리텔링을 더한 연출에 중점을 두었습니다.",
    info: { year: "2024년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/Muk7xmH1moY" },
  },
  {
    title: "POP | 서포터즈모집 프로모션",
    slug: "pop-artbox-06",
    category: "digital-signage",
    image: "/images/projects/POP_artbox_06.png",
    tags: ["POP", "Digital Signage"],
    summary:
      "이 영상은 서포터즈모집 내용을 홍보하고 참여를 유도하기 위해 제작되었습니다. 메시지를 보다 쉽고 임팩트 있게 전달하기 위해 하나의 장면을 여러 컷으로 분할하고, 시선을 끌 수 있는 모션 디자인을 적용했습니다.",
    info: { year: "2024년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/WbfIcGUG7ZQ" },
  },
  {
    title: "POP | 메뉴홍보프로모션",
    slug: "pop-daehan-01",
    category: "digital-signage",
    image: "/images/projects/POP_daehan_01.jpg",
    tags: ["POP", "Digital Signage"],
    summary:
      "이 영상은 특정 메뉴의 홍보와 판매 촉진을 위해 진행된 프로모션 영상입니다. 메뉴의 불맛과 매운맛을 시각적으로 표현하는데 중점을 두었습니다.",
    info: { year: "2022년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/HXQuSaqM0NM" },
  },
  {
    title: "POP | 힐링이벤트",
    slug: "pop-daehan-02",
    category: "digital-signage",
    image: "/images/projects/POP_daehan_02.jpg",
    tags: ["POP", "Digital Signage"],
    summary: "대한 곱창에서 특정 기간 동안 진행한 이벤트를 홍보하는 목적으로 제작된 프로모션 영상입니다.",
    info: { year: "2022년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/yDP5JP5SiNQ" },
  },
  {
    title: "POP | 시그니처제품",
    slug: "pop-ediya-01",
    category: "digital-signage",
    image: "/images/projects/POP_ediya_01.jpg",
    tags: ["POP", "Digital Signage"],
    summary:
      "이 영상은 960x1080 해상도로 제작되었으며, 고급스럽고 시네마틱한 무드를 기반으로 제품의 부드러움을 시각적으로 표현하는데 중점을 두었습니다.",
    info: { year: "2023년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/PeTnB0UVurA" },
  },
  {
    title: "POP | 요거트 음료",
    slug: "pop-ediya-02",
    category: "digital-signage",
    image: "/images/projects/POP_ediya_02.jpg",
    tags: ["POP", "Digital Signage"],
    summary:
      "이 영상은 960x1080 해상도로 제작되었으며, 새로 출시된 각 메뉴가 잘 보이도록 연출에 중점을 두었습니다. 요거트의 건강함과 재료의 신선함을 원형 요소를 장식적으로 활용하여 모션으로 표현했습니다.",
    info: { year: "2024년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/XQmBH9v7YPY" },
  },
  {
    title: "POP | 샌드위치",
    slug: "pop-ediya-03",
    category: "digital-signage",
    image: "/images/projects/POP_ediya_03.jpg",
    tags: ["POP", "Digital Signage"],
    summary: "이 영상은 960x1080 사이즈로 제작되었으며, 샌드위치 제품별 재료와 특징을 시각적으로 효과적으로 표현하는데 중점을 두었습니다.",
    info: { year: "2023년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/saxJ__1qmsQ" },
  },

  {
    title: "POP | 시그니처제품",
    slug: "pop-pizza-01",
    category: "digital-signage",
    image: "/images/projects/POP_pizza_01.jpg",
    tags: ["POP", "Digital Signage"],
    summary:
      "이 영상은 오픈 이벤트를 홍보하기 위해 제작되었습니다. 시선을 끌기 위해 배경 패턴과 대비되는 컬러를 인트로에 적용했으며, 텍스트에 시각적 효과를 주어 정보가 잘 전달되도록 구성했습니다.",
    info: { year: "2023년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/rBh_CPotZd0" },
  },
  {
    title: "POP | 브랜드 홍보",
    slug: "pop-pizza-02",
    category: "digital-signage",
    image: "/images/projects/POP_pizza_02.jpg",
    tags: ["POP", "Digital Signage"],
    summary:
      "이 영상은 오픈 이벤트를 홍보하기 위해 제작되었습니다. 시선을 끌기 위해 배경 패턴과 대비되는 컬러를 인트로에 적용했으며, 텍스트에 시각적 효과를 주어 정보가 잘 전달되도록 구성했습니다.",
    info: { year: "2023년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/n88263j4DI4" },
  },

  {
    title: "POP | MD 상품 01",
    slug: "pop-twosome-01",
    category: "digital-signage",
    image: "/images/projects/POP_twosome_01.jpg",
    tags: ["POP", "Digital Signage"],
    summary:
      "이 영상은 여름 밤, 바다 속의 몽환적이고 신비로운 분위기를 통해 시즌 한정 MD 상품이 더욱 돋보일 수 있도록 연출에 중점을 두었습니다.",
    info: { year: "2022년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/TTJ_oMfFbHA" },
  },
  {
    title: "POP | 시즌 제품 홍보",
    slug: "pop-twosome-02",
    category: "digital-signage",
    image: "/images/projects/POP_twosome_02.jpg",
    tags: ["POP", "Digital Signage"],
    summary:
      "이 영상은 투썸플레이스와 피넛츠(스누피)의 콜라보 메뉴를 홍보하기 위해 제작되었습니다. 여름과 바다가 연상되도록 모션을 연출해 시즌 분위기를 살렸습니다.",
    info: { year: "2024년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/tgu-sKLfxzM" },
  },

  {
    title: "POP | 디카페인공법 소개",
    slug: "pop-uptention-01",
    category: "digital-signage",
    image: "/images/projects/POP_uptention_01.jpg",
    tags: ["POP", "Digital Signage"],
    summary:
      "이 영상은 원두의 디카페인 공법에 대한 정보 전달을 목적으로 제작되었으며 카페 매장 내부에 있는 사이니지에 송출되는 영상입니다.",
    info: { year: "2023년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/pzPFgEX7B3Y" },
  },

  {
    title: "Full Banner 02",
    slug: "fullbanner-eydia-01",
    category: "digital-signage",
    image: "/images/projects/Fullbanner_eydia_01.jpg",
    tags: ["Full Banner", "Digital Signage"],
    summary:
      "이 영상은 2개의 패널을 한 화면으로 구성하여 허쉬초콜릿과 콜라보한 제품을 홍보하기 위한 목적으로 제작되었습니다. 초코의 크리미함과 고급스러움, 발렌타인데이의 러블리함을 키워드로 제작했습니다.",
    info: { year: "2024년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/gRtlnLy_HWc" },
  },
  {
    title: "Full Banner 03",
    slug: "fullbanner-eydia-02",
    category: "digital-signage",
    image: "/images/projects/Fullbanner_eydia_02.jpg",
    tags: ["Full Banner", "Digital Signage"],
    summary:
      "이 영상은 3대의 패널을 한 화면으로 구성하여 시즌성 신제품을 홍보하는 영상입니다. 봄의 싱그러움과 딸기의 이미지를 시각적으로 적극 활용해서 모션 디자인 되었습니다.",
    info: { year: "2023년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/Pv7lYlzMkyw" },
  },
  {
    title: "Full Banner 04",
    slug: "fullbanner-eydia-03",
    category: "digital-signage",
    image: "/images/projects/Fullbanner_eydia_03.jpg",
    tags: ["Full Banner", "Digital Signage"],
    summary:
      "이 영상은 3개의 디지털 사이니지 패널을 하나의 화면으로 구성하여, 캐릭터 '먼작귀'와의 콜라보레이션을 홍보하기 위해 제작되었습니다. 콜라보의 콘셉트와 캐릭터의 개성을 살릴 수 있도록 모션 디자인에 집중했습니다.",
    info: { year: "2024년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/LTICQ9AnuQY" },
  },
  {
    title: "Full Banner 05",
    slug: "fullbanner-eydia-04",
    category: "digital-signage",
    image: "/images/projects/Fullbanner_eydia_04.jpg",
    tags: ["Full Banner", "Digital Signage"],
    summary:
      "이 영상은 3개의 디지털 사이니지 패널을 하나의 화면으로 구성하여, 여름 시즌 주력 상품을 홍보하기 위해 제작되었습니다. 강렬한 태양 아래에서 즐기는 과일 음료의 청량감과 시원함을 시각적으로 표현하는데 중점을 두었습니다.",
    info: { year: "2024년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/SQyAtnPEUQc" },
  },

  {
    title: "Full Banner 06",
    slug: "fullbanner-mmth-01",
    category: "digital-signage",
    image: "/images/projects/Fullbanner_mmth01.jpg",
    tags: ["Full Banner", "Digital Signage"],
    summary:
      "이 영상은 2대의 패널로 구성된 디지털 사이니지 화면에서 시즌성 제품을 홍보하기 위해 제작되었습니다. 레트로 감성을 담은 디자인 요소를 모션 연출 전반에 자연스럽게 반영하여 제작했습니다.",
    info: { year: "2024년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/HZvZI9wCA1I" },
  },
  {
    title: "Full Banner 07",
    slug: "fullbanner-mmth-02",
    category: "digital-signage",
    image: "/images/projects/Fullbanner_mmth02.jpg",
    tags: ["Full Banner", "Digital Signage"],
    summary:
      "이 영상은 2대의 패널로 구성된 디지털 사이니지 화면에서 시즌성 제품을 홍보하기 위해 제작되었습니다. 또한 ‘chilling’이라는 키워드와 여름 시즌 음료의 분위기를 모션을 통해 경쾌하고 시원한 느낌으로 표현했습니다.",
    info: { year: "2024년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/95236_9sbCs" },
  },
  {
    title: "Full Banner 08",
    slug: "fullbanner-mmth-03",
    category: "digital-signage",
    image: "/images/projects/Fullbanner_mmth03.jpg",
    tags: ["Full Banner", "Digital Signage"],
    summary:
      "이 영상은 2대의 패널로 구성된 디지털 사이니지 화면에서 시즌성 제품을 홍보하기 위해 제작되었습니다. 또한, 오트 사이드 제품과의 콜라보레이션 상품을 함께 소개하는 내용으로 제작되었습니다.",
    info: { year: "2023년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/yV4wDWs7-Rs" },
  },

  {
    title: "Full Banner 09",
    slug: "fullbanner-twosom-01",
    category: "digital-signage",
    image: "/images/projects/Fullbanner_twosom_01.jpg",
    tags: ["Full Banner", "Digital Signage"],
    summary:
      "이 영상은 여름 시즌 출시 제품을 강조하기 위해 제작되었습니다. ‘힐링, 휴식, 시원함, 차분함’이라는 키워드를 중심으로 여름의 계절감을 표현했으며, 전체적인 무드에 어울리도록 모션을 디자인했습니다.",
    info: { year: "2023년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/YLPUW1zrQag" },
  },
  {
    title: "Full Banner 10",
    slug: "fullbanner-twosom-02",
    category: "digital-signage",
    image: "/images/projects/Fullbanner_twosom_02.jpg",
    tags: ["Full Banner", "Digital Signage"],
    summary:
      "이 영상은 피넛츠(스누피) 캐릭터와의 콜라보로 출시된 제품을 홍보하기 위해 제작되었습니다. 캐릭터의 사랑스러움과 봄날의 피크닉 무드 속에 제품이 자연스럽게 어우러질 수 있도록 기획 및 연출되었습니다.",
    info: { year: "2023년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/IfFTnuebCQ8" },
  },

  {
    title: "메뉴보드01",
    slug: "menu-01",
    category: "digital-signage",
    image: "/images/projects/Menu_01.jpg",
    tags: ["Menu Board", "Digital Signage"],
    summary: "매장 내 주력 메뉴 홍보를 목적으로 시각 효과와 정보 전달력을 고려해 제작되었습니다.",
    info: { year: "2023년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/oN_zlpojZTQ" },
  },
  {
    title: "메뉴보드02",
    slug: "menu-02",
    category: "digital-signage",
    image: "/images/projects/Menu_02.jpg",
    tags: ["Menu Board", "Digital Signage"],
    summary:
      "이 영상은 2개의 디지털 사이니지 패널을 하나의 화면으로 구성하여 제작된 메뉴보드입니다. 정글 속 원숭이들의 한가로운 일상을 콘셉트로, 여유롭고 따뜻한 분위기를 시각적으로 표현하는데 중점을 두었습니다.",
    info: { year: "2025년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/Qo9ppBcMegY" },
  },
  {
    title: "메뉴보드03",
    slug: "menu-03",
    category: "digital-signage",
    image: "/images/projects/Menu_03.jpg",
    tags: ["Menu Board", "Digital Signage"],
    summary:
      "이 메뉴보드는 두 개의 디지털 사이니지 패널 전체를 아우르도록 디자인되었습니다. 새해의 시작을 기념하기 위해 제작되었으며, 해당 해를 상징하는 ‘용’을 콘셉트로 삼았습니다. 모션 디자인에는 용과 관련된 역동적인 이미지를 활용하여 시각적 임팩트와 주제의 상징성을 더욱 강조했습니다.",
    info: { year: "2023년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/fW76DgQuIxM" },
  },
  {
    title: "메뉴보드04",
    slug: "menu-04",
    category: "digital-signage",
    image: "/images/projects/Menu_04.jpg",
    tags: ["Menu Board", "Digital Signage"],
    summary:
      "이 디자인은 두 개의 디지털 사이니지 화면을 가득 채우도록 제작되었습니다. '꿈─이의 우주 여행'을 컨셉으로 하여, 디자인 전반에 재미있고 환상적인 분위기를 불어넣었습니다.",
    info: { year: "2023년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/v0Fvit-MB18" },
  },
  {
    title: "메뉴보드07",
    slug: "menu-07",
    category: "digital-signage",
    image: "/images/projects/Menu_07.jpg",
    tags: ["Menu Board", "Digital Signage"],
    summary:
      "이 영상은 3대의 디지털 사이니지 패널을 하나의 화면으로 구성하여 제작된 메뉴보드입니다. 스포츠 빈티지 펍의 매장 분위기에 어울리도록, 캐릭터들이 야구 경기를 펼치는 장면을 B급 감성으로 위트 있게 표현했습니다.",
    info: { year: "2024년", role: "기획,애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/kcye9jnNSVk" },
  },
  {
    title: "메뉴보드08",
    slug: "menu-08",
    category: "digital-signage",
    image: "/images/projects/Menu_08.jpg",
    tags: ["Menu Board", "Digital Signage"],
    summary:
      "이 영상은 4개의 디지털 사이니지 패널을 하나의 화면으로 구성하여 제작된 메뉴보드입니다. 고전 게임 '팩맨(Pac-Man)'을 모티브로, 브랜드의 레트로한 무드와 시그니처 컬러인 레드의 이미지를 시각적으로 강조하는데 중점을 두었습니다.",
    info: { year: "2025년", role: "기획,애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/BCTmEGdkYt8" },
  },

  {
    title: "제품홍보 | 발렌타인데이 시즌",
    slug: "pop-cafe-01",
    category: "digital-signage",
    image: "/images/projects/POP_cafe_01.png",
    tags: ["POP", "Digital Signage"],
    summary:
      "발렌타인 시즌 무드와 어울리는 ‘로맨틱, 러블리’를 키워드로 이 무드가 느껴지도록 디자인 및 모션을 기획해서 제작했습니다.",
    info: { year: "2024년", role: "기획,디자인,애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/er4nezdXvMA" },
  },
  {
    title: "제품 홍보 | JMT 버거",
    slug: "pop-burgur-01",
    category: "digital-signage",
    image: "/images/projects/POP_burgur_01.png",
    tags: ["POP", "Digital Signage"],
    summary:
      "스트릿 푸드 브랜드의 와일드한 감성을 담아 시그니처 메뉴를 홍보하기 위해 제작했습니다. 젊고 키치한 무드는 유지하면서 거칠고 자유로운 브랜드의 개성이 느껴지도록 연출했습니다.",
    info: { year: "2024년", role: "기획, 디자인, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/c3FEGWKtJxY" },
  },
  {
    title: "제품 홍보 | 엽떡 밀키트",
    slug: "pop-ddokbokki-01",
    category: "digital-signage",
    image: "/images/projects/POP_ddokbokki_01.jpg",
    tags: ["POP", "Digital Signage"],
    summary:
      "Red 계열의 컬러를 중심으로 엽떡의 매운맛을 시각적으로 표현하고, 10~20대 주요 고객층에게 어필할 수 있도록 귀엽고 발랄한 무드를 담아 제작했습니다.",
    info: { year: "2024년", role: "기획, 3D, 디자인, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/SMyAhCY3vdg" },
  },

  // --- agency ---
  {
    title: "행사 홍보 | 유한산학협력어워즈",
    slug: "event-02",
    category: "agency",
    image: "/images/projects/Event_02.jpg",
    tags: ["Event", "Agency"],
    summary:
      "유한 산학협력 어워즈 홍보를 위해 제작된 대형 디지털 사이니지용 루핑 영상입니다. 고객사에서 전달한 홍보 포스터를 기반으로 각 LED 사이즈에 맞게 변형(베리에이션)하였으며, 배경 요소를 활용해 잔잔한 모션 효과를 더했습니다.",
    info: { year: "2024년", role: "디자인, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/kvSakwgEMfw" },
  },
  {
    title: "영상 템플릿 | 롯데관광",
    slug: "templete-01",
    category: "agency",
    image: "/images/projects/Templete_01.jpg",
    tags: ["Template", "Agency"],
    summary:
      "인터뷰 영상에 사용되는 영상 템플릿(루핑)을 제작한 프로젝트로 고객사가 제공한 포스터를 베리에이션하여 톤앤무드를 유지하여 제작하였습니다. 인터뷰 영상에 집중할 수 있도록 움직임 과한 모션은 지양하되 심심한 느낌이 들지 않도록 제작하였습니다.",
    info: { year: "2024년", role: "디자인, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/SSEQF9q0EcI" },
  },
  {
    title: "캠페인 | 아동학대예방",
    slug: "campaign-01",
    category: "agency",
    image: "/images/projects/campaign_01.jpg",
    tags: ["Campaign", "Agency"],
    summary:
      "아동학대 예방 캠페인을 위한 영상으로, 고객사에서 제공한 콘티를 기반으로 디자인하였습니다. 공공기관 캠페인 영상의 특성에 맞춰 성별 편향이 느껴지지 않도록 배색을 조정하였으며, ‘아동’이라는 주제에 맞게 지나치게 낮은 채도는 피하고 중채도의 따뜻한 컬러 톤으로 따스하고 긍정적인 분위기를 연출했습니다.",
    info: { year: "2024년", role: "디자인, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/LDZpvtg6kQI" },
  },
  {
    title: "인포그래픽 | 방배유스센터",
    slug: "campaign-02",
    category: "agency",
    image: "/images/projects/campaign_02.png",
    tags: ["Infographic", "Agency"],
    summary:
      "고객사로부터 전달받은 콘티와 로고 이미지를 기반으로, 친환경 사업의 메시지에 어울리도록 그린과 블루 톤을 활용하여 제작하였습니다. 전반적으로 따뜻하고 친근한 인상을 줄 수 있도록 디자인했습니다.",
    info: { year: "2024년", role: "디자인, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/8b42Ly7RKo4" },
  },
  {
    title: "기업/관공서 행사 | 정보통신우수사례발표대회",
    slug: "events-01",
    category: "agency",
    image: "/images/projects/Events_01.jpg",
    tags: ["Event", "Agency"],
    summary:
      "행사 기록 영상으로, IT 분야 행사라는 특징을 반영하여 블루를 키 컬러로 설정하고 전반적인 톤앤무드를 구성했습니다. 각 영상 및 사진 자료의 다양한 색감을 그레이 톤으로 통일하여 일관성을 높였으며, 긴 러닝타임에 지루하지 않도록 영상의 흐름을 세 가지 테마로 구분하고, 톤앤무드는 유지하되 디자인에 변화를 주었습니다.",
    info: { year: "2025년", role: "디자인, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/CFXUgshPK8I" },
  },
  {
    title: "인포그래픽 | 대구한의대학 x K MEDI",
    slug: "info-01",
    category: "agency",
    image: "/images/projects/info_01.jpg",
    tags: ["Infographic", "Agency"],
    summary:
      "전달받은 기획안과 레퍼런스를 바탕으로 제작하였으며, 정보를 쉽게 전달하면서 지루해지지 않도록 각 정보에 시간을 배분하는데 중점을 두어 제작했습니다.",
    info: { year: "2025년", role: "디자인, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/W59TdkU7HKI" },
  },
  {
    title: "제품 홍보 | GS25X갤럭시캠퍼스",
    slug: "ads-04",
    category: "agency",
    image: "/images/projects/Ads_04.jpg",
    tags: ["Ads", "Agency"],
    summary:
      "GSTV 갤럭시 캠퍼스 x GS25 콜라보레이션으로 지하철 역사 내부 미디어 보드에 광고하기 위해 제작된 영상입니다. 갤러시 S25 홍보물의 전반적인 이미지와 컬러감을 바탕으로 베리에이션 하여 제작했습니다.",
    info: { year: "2025년", role: "디자인, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/XpAn9CzgAzI" },
  },
  {
    title: "제품 홍보 | Forest",
    slug: "ads-05",
    category: "agency",
    image: "/images/projects/Ads_05.jpg",
    tags: ["Ads", "Agency"],
    summary:
      "고객사로부터 전달받은 리드미컬하고 밝은 느낌을 모션 타이밍에 적용하는데 신경을 썼고 브랜드 콘텐츠의 전반적인 톤을 유지하며 제품과 모델이 매력적으로 노출 될 수 있도록 제작했습니다.",
    info: { year: "2025년", role: "기획,디자인, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/nEmbptX9pm4" },
  },
  {
    title: "영상 템플릿 | 영수증 콘서트",
    slug: "templete-02",
    category: "agency",
    image: "/images/projects/Templete_02.jpg",
    tags: ["Template", "Agency"],
    summary:
      "전달받은 영수증 콘서트 홍보 포스터 이미지를 바탕으로 바다, '축제, 영수증' 이 3개의 키워드가 잘 보이도록 베리에이션해서 제작했습니다. 인터뷰 영상에 집중할 수 있도록 주변 요소의 모션은 최대한 절제하였습니다.",
    info: { year: "2025년", role: "디자인, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/YdkyD4s7htc" },
  },
  {
    title: "로고 애니메이션",
    slug: "logo-animation-01",
    category: "agency",
    image: "/images/projects/Logo%20Animation_01.jpg",
    tags: ["Logo", "Agency"],
    summary: "브랜드 고유의 로고를 브랜드의 철학, 정체성 등을 고려하여 모션을 기획/제작하였습니다.",
    info: { year: "2025년", role: "기획,애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/B0aUvWTJ3MY" },
  },
  {
    title: "유튜브 콘텐츠 | 언니의 작업실",
    slug: "title-01",
    category: "agency",
    image: "/images/projects/title_01.jpg",
    tags: ["YouTube", "Agency"],
    summary:
      "‘작업실을 엿보다’라는 콘셉트로, 드로잉 강의 유튜브 채널의 타이틀 영상을 제작했습니다. 작가의 창작 공간과 작업 과정을 살짝 들여다보는 듯한 감성을 담아 디자인했습니다.",
    info: { year: "2022년", role: "기획, 디자인, 영상 편집, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/lWck2fMrQac" },
  },
  {
    title: "유튜브 콘텐츠 | 그냥 놀면 뭐하니",
    slug: "title-02",
    category: "agency",
    image: "/images/projects/title_02.jpg",
    tags: ["YouTube", "Agency"],
    summary:
      "‘위트 있고, 재미있고, 트렌디한, 키치한’ 이 키워드를 바탕으로 인기 예능 프로그램 <놀면 뭐하니>를 오마주한 컨셉의 영상을 기획·제작했습니다. 프로그램의 독특한 컬러감과 유쾌한 분위기를 반영하여 브랜드의 밝고 긍정적인 이미지를 전달했습니다.",
    info: { year: "2022년", role: "기획, 디자인, 영상 편집, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/oZ5ZHbciU-M" },
  },
  {
    title: "제품 홍보 | 에멘탈치즈",
    slug: "ads-01",
    category: "agency",
    image: "/images/projects/Ads_01.jpg",
    tags: ["Ads", "Agency"],
    summary: "포근하고 따스한 아침 어느 날이 연상될 수 있는 톤을 유지하면서 고급스러운 디저트 제품으로 보여주고자 하였습니다.",
    info: { year: "2021년", role: "색보정, 편집, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/5mAtuoU4aq4" },
  },
  {
    title: "제품 홍보 | Grida 연필광고",
    slug: "ads-02",
    category: "agency",
    image: "/images/projects/Ads_02.jpg",
    tags: ["Ads", "Agency"],
    summary:
      "“창작의 모든 과정은 연필로 아이디어를 끄적이는 순간부터 시작된다”는 메시지를 중심으로, 드로잉적인 요소와 모션 효과를 활용해 유쾌하고 생동감 있게 표현했습니다.",
    info: { year: "2022년", role: "기획, 3D, 디자인, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/dcmq0tn98So" },
  },
  {
    title: "인포그래픽 | 기후동행카드",
    slug: "campaign-03",
    category: "agency",
    image: "/images/projects/campaign_03.jpg",
    tags: ["Infographic", "Agency"],
    summary:
      "기후동행카드 사용법을 쉽게 이해할 수 있도록 텍스트를 최소화하고, 직관적인 이미지 중심으로 디자인했습니다. 또한 카드의 디자인과 톤앤무드에 맞춰 일관된 비주얼로 제작했습니다.",
    info: { year: "2024년", role: "기획, 디자인, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/LLY3FR1Sb3I" },
  },
  {
    title: "브랜드 홍보 | Woom",
    slug: "woom-01",
    category: "agency",
    image: "/images/projects/Woom_01.jpg",
    tags: ["Brand", "Agency"],
    summary: "모션그래픽스튜디오움 홍보를 위해 기획/디자인 한 타이포 키네틱 영상입니다.",
    info: { year: "2025년", role: "기획, 디자인, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/i8aG0qeuBXM" },
  },
  {
    title: "프로모션 홍보 | PRMR 크루 모집",
    slug: "pop-prmr",
    category: "agency",
    image: "/images/projects/POP_prmr.jpg",
    tags: ["Promotion", "Agency"],
    summary:
      "텍스트 중심의 화면 구성으로 리드미컬하고 감각적인 정보 전달이 가능하도록 타이포 키네틱 형태로 제작했습니다. 또한, 홍보물의 그레이 톤과 옐로우 컬러감을 영상 전반에 유지하여 브랜드 일관성을 강조했습니다.",
    info: { year: "2024년", role: "기획, 디자인, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/K_o555Ywq28" },
  },
  {
    title: "홍보 영상 | Mongs 리뉴얼 인스타 홍보",
    slug: "shorts-01",
    category: "agency",
    image: "/images/projects/shorts_01.jpg",
    tags: ["SNS", "Agency"],
    summary:
      "매장 리뉴얼을 인스타그램에 홍보하기 위해 제작된 영상으로 사람이 원숭이로 진화하는 과정을 컨셉으로 기획/제작되었습니다.",
    info: { year: "2025년", role: "디자인, 애니메이션 전반" },
    media: { kind: "youtube", src: "https://youtu.be/FDbF2XwzpgY" },
  },
  {
    title: "카드뉴스 | 건강상식",
    slug: "card-01",
    category: "agency",
    image: "/images/projects/card_01.jpg",
    tags: ["Card News", "Agency"],
    summary:
      "일상 속 건강을 해치는 습관에 대한 정보를 쉽고 효과적으로 전달하기 위해 모션 효과와 이미지를 활용했습니다. 옐로우와 그린 컬러를 사용하여 밝고 경쾌하면서 건강한 분위기를 표현했습니다.",
    info: { year: "2021년", role: "기획, 디자인 및 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/koA5qodezKY" },
  },
  {
    title: "제품 홍보 | 골든아일랜드",
    slug: "ads-03",
    category: "agency",
    image: "/images/projects/Ads_03.jpg",
    tags: ["Ads", "Agency"],
    summary:
      "고객사에서 전달받은 기획안을 바탕으로, 브랜드의 와일드하고 남성적인 무드를 유지하면서 제품 패키지 디자인과 조화를 이루는 톤앤무드로 제작하였으며, 제품 정보를 효과적으로 전달하는 데 중점을 두었습니다.",
    info: { year: "2024년", role: "디자인, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/al4g49FD9vc" },
  },
  {
    title: "전시포스터 | 5립기념관 DID 송출",
    slug: "poster-01",
    category: "agency",
    image: "/images/projects/poster_01.jpg",
    tags: ["Poster", "Agency"],
    summary:
      "고객사로부터 전달받은 디자인과 모션안을 기반으로, 부드럽고 잔잔한 무드가 느껴지도록 모션을 기획 및 제작하였습니다.",
    info: { year: "2024년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/UouW07Uw1tQ" },
  },
  {
    title: "전시포스터 | 히든 시퀀스 웹포스터",
    slug: "poster-02",
    category: "agency",
    image: "/images/projects/poster_02.jpg",
    tags: ["Poster", "Agency"],
    summary:
      "고객사로부터 전달받은 디자인 시안을 기반으로 텍스트와 도형 등 장식 요소에 은은한 모션을 적용하여 잔잔한 무드를 유지하도록 제작했습니다.",
    info: { year: "2025년", role: "애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/peIZCtTXweA" },
  },
  {
    title: "홍보 영상 | B1B1 리뉴얼 인스타 홍보",
    slug: "shorts-02",
    category: "agency",
    image: "/images/projects/shorts_02.jpg",
    tags: ["SNS", "Agency"],
    summary:
      "매장 및 메뉴 리뉴얼 소식을 인스타그램에 홍보하기 위해 제작된 영상으로, ‘공사장’과 ‘게토(Ghetto)’스러움을 키워드로 하여 거칠고 스트리트한 무드를 강조한 디자인과 애니메이션으로 제작했습니다.",
    info: { year: "2025년", role: "기획, 디자인, 애니메이션" },
    media: { kind: "youtube", src: "https://youtu.be/KbimY6hlyA4" },
  },
];

// ✅ 최종 export: 기존 tags + 자동 태그를 합쳐서 중복 제거한 결과를 사용
export const works = rawWorks.map((w) => ({
  ...w,
  tags: mergeTags(w),
}));

// =========================
// Sort utils (year desc)
// =========================
function parseYear(value) {
  const s = String(value ?? "").trim();
  const m = s.match(/\d{4}/);
  if (!m) return 0;
  const y = Number(m[0]);
  return Number.isFinite(y) ? y : 0;
}

function sortWorksLatestFirst(list) {
  return [...list].sort((a, b) => {
    const ay = parseYear(a?.info?.year);
    const by = parseYear(b?.info?.year);
    return by - ay;
  });
}

// =========================
// Public helpers
// =========================
/** category로 필터링 + 최신순 정렬 */
export function getWorksByCategory(category) {
  const filtered =
    !category || category === "all" ? works : works.filter((w) => w.category === category);
  return sortWorksLatestFirst(filtered);
}

/**
 * 페이지네이션 유틸
 * @param {Array} list - 정렬된 전체 리스트
 * @param {number} page - 1부터 시작
 * @param {number} perPage - 페이지당 개수
 */
export function paginateWorks(list, page = 1, perPage = 30) {
  const safePerPage =
    typeof perPage === "number" && Number.isFinite(perPage) && perPage > 0 ? perPage : 30;

  const total = Array.isArray(list) ? list.length : 0;
  const totalPages = Math.max(1, Math.ceil(total / safePerPage));

  let currentPage = Number(page);
  if (!Number.isFinite(currentPage) || currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * safePerPage;
  const end = start + safePerPage;

  return {
    items: (list || []).slice(start, end),
    total,
    totalPages,
    currentPage,
    perPage: safePerPage,
  };
}

/**
 * buildGrid: pages에서 "정렬된 전체 리스트"를 얻는 용도
 * (페이지네이션은 각 page.astro에서 paginateWorks로 처리)
 */
export function buildGrid({ category = "all" } = {}) {
  return getWorksByCategory(category);
}
