// src/data/works.js

/**
 * ✅ 자동 정렬 규칙:
 * - work.info.year 기준 내림차순(최신 → 과거)
 * - year가 없거나 숫자로 변환 불가면 0으로 처리되어 뒤로 감
 *
 * ✅ 페이지네이션:
 * - paginateWorks(list, page, perPage) 제공
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

function sortWorksLatestFirst(list) {
  return [...list].sort((a, b) => {
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
 * buildGrid: 기존 호출부 호환용
 * - 이제 placeholder 없이 "정렬된 전체 리스트"만 반환하는 역할로 유지
 */
export function buildGrid({ category = "all" } = {}) {
  return getWorksByCategory(category);
}
