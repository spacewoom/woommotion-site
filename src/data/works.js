// src/data/works.js

/**
 * ✅ 자동 정렬 규칙:
 * - work.info.year 기준 내림차순(최신 → 과거)
 * - year가 없거나 숫자로 변환 불가면 0으로 처리되어 뒤로 감
 *
 * ✅ 카드 개수 규칙:
 * - 기본값: 업로드된 works 개수만큼만 반환(placeholder 없음)
 * - 옵션: targetCount를 숫자로 넘기면 그때만 placeholder로 채움(원할 때만)
 */

// =========================
// 실제 작업 데이터
// =========================
export const works = [
  // 예시
  {
    title: "인포그래픽 | 기후동행카드 (35s)",
    slug: "infographics-01",
    category: "agency",
    image: "/images/projects/card.jpg",
    tags: ["인포그래픽", "모션그래픽"],
    summary:
      "텍스트를 최소화하고 직관적인 이미지 중심으로 구성해, 짧은 시간 안에 핵심 정보가 이해되도록 디자인했습니다.",
    info: {
      year: "2024",
      role: "기획 · 디자인 · 애니메이션",
      // (선택) 기존 데이터 호환용
      youtubeUrl: "https://youtu.be/LLY3FR1Sb3I?si=1O3wcJZANL766oDf",
    },
    media: {
      kind: "youtube",
      src: "https://youtu.be/LLY3FR1Sb3I?si=1O3wcJZANL766oDf",
    },
  },
];

// =========================
// 유틸: year 파싱 & 정렬
// =========================
function parseYear(value) {
  const s = String(value ?? "").trim();
  const m = s.match(/\d{4}/);
  if (!m) return 0;
  const y = Number(m[0]);
  return Number.isFinite(y) ? y : 0;
}

function isPlaceholder(work) {
  return typeof work?.slug === "string" && work.slug.startsWith("placeholder-");
}

function sortWorksLatestFirst(list) {
  return [...list].sort((a, b) => {
    const aPh = isPlaceholder(a);
    const bPh = isPlaceholder(b);
    if (aPh && !bPh) return 1;
    if (!aPh && bPh) return -1;

    const ay = parseYear(a?.info?.year);
    const by = parseYear(b?.info?.year);
    return by - ay; // 최신이 먼저
  });
}

// =========================
// 데이터 빌더
// =========================
/** category로 필터링 + 최신순 정렬 */
export function getWorksByCategory(category) {
  const filtered =
    !category || category === "all"
      ? works
      : works.filter((w) => w.category === category);

  return sortWorksLatestFirst(filtered);
}

/**
 * (옵션) Placeholder 생성
 * - 이제 기본 출력에서는 사용하지 않음
 * - targetCount를 넘겼을 때만 채우는 용도
 */
export function makePlaceholders({ count = 0, category = "all" } = {}) {
  return Array.from({ length: count }, (_, i) => ({
    title: `추가 작업 준비중 #${i + 1}`,
    slug: `placeholder-${category}-${i + 1}`,
    category,
    image: "/images/projects/card.jpg",
    tags: ["Coming soon"],
    summary: "업로드 준비 중입니다.",
    info: { year: "-", role: "-" },
    media: { kind: "", src: "" },
  }));
}

/**
 * ✅ 기본: 업로드된 작업 수만큼만 반환(placeholder 없음)
 * ✅ 옵션: targetCount(숫자)를 넘기면 그때만 placeholder로 채움
 */
export function buildGrid({ category = "all", targetCount = null } = {}) {
  const baseSorted = getWorksByCategory(category);

  // 기본값: 카드 수 제한/고정 없이 실제 작업만 반환
  if (typeof targetCount !== "number" || !Number.isFinite(targetCount)) {
    return baseSorted;
  }

  // targetCount가 실제 작업 수보다 작거나 같으면 그냥 반환
  if (targetCount <= baseSorted.length) return baseSorted;

  // targetCount가 더 크면 placeholder로 채움(옵션 기능)
  const remain = targetCount - baseSorted.length;
  const filled = [...baseSorted, ...makePlaceholders({ count: remain, category })];
  return sortWorksLatestFirst(filled);
}
