// src/data/works.js

/**
 * category: 'agency' | 'digital-signage'
 *
 * ✅ 권장 media 구조:
 * media: { kind: 'youtube' | 'file', src: '...', poster?: '...' }
 *
 * ✅ 하위호환:
 * info.youtubeUrl이 있어도 ProjectsPage에서 youtube로 처리합니다.
 *
 * ✅ 정렬 규칙(자동):
 * - work.info.year 기준 내림차순(최신 → 과거)
 * - year가 없거나 숫자로 변환 불가면 0으로 처리되어 뒤로 감
 * - placeholder는 항상 맨 뒤로
 */

// =========================
// 실제 작업 데이터
// =========================
export const works = [
  // ✅ 예시 1개
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
      // poster: "/images/projects/infographics-01-poster.jpg",
    },
  },
];

// =========================
// 유틸: year 파싱 & 정렬
// =========================
function parseYear(value) {
  // value가 "2024", 2024, "2024년" 등이어도 숫자만 뽑아 처리
  const s = String(value ?? "").trim();
  const m = s.match(/\d{4}/);
  if (!m) return 0;
  const y = Number(m[0]);
  return Number.isFinite(y) ? y : 0;
}

function isPlaceholder(work) {
  // placeholder는 slug가 placeholder-로 시작하도록 생성하므로 이를 기준으로 판별
  return typeof work?.slug === "string" && work.slug.startsWith("placeholder-");
}

function sortWorksLatestFirst(list) {
  // ✅ placeholder는 항상 뒤로 보내고,
  // ✅ 그 외에는 year 내림차순(최신 → 과거)
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
 * Placeholder 생성
 * - media.kind/src가 비어있으면 클릭해도 모달이 안 열리는(=정상) 상태
 * - year는 "-"로 두고, 정렬에서 자동으로 맨 뒤에 위치(placeholder 판별로 뒤로 감)
 */
export function makePlaceholders({ count = 30, category = "all" } = {}) {
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
 * 목표 카드 수(기본 30개)로 자동 채우기 + 최신순 정렬 유지
 * - 실제 작업이 8개면: (최신순 정렬된 8개) + placeholder 22개 = 30개
 */
export function buildGrid({ category = "all", targetCount = 30 } = {}) {
  const baseSorted = getWorksByCategory(category); // ✅ 이미 최신순 정렬 적용됨
  const remain = Math.max(0, targetCount - baseSorted.length);

  if (remain <= 0) return baseSorted;

  const filled = [...baseSorted, ...makePlaceholders({ count: remain, category })];
  // placeholder는 이미 뒤지만, 안전하게 한 번 더 정렬(규칙 고정)
  return sortWorksLatestFirst(filled);
}
