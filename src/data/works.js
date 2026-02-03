// src/data/works.js

/**
 * category: 'agency' | 'digital-signage'
 * thumbnail image는 /public 아래 경로를 권장합니다. (예: /images/projects/xxx.jpg)
 *
 * ✅ 권장 media 구조:
 * media: { kind: 'youtube' | 'file', src: '...', poster?: '...' }
 *
 * ✅ 하위호환:
 * info.youtubeUrl이 있어도 ProjectsPage에서 youtube로 처리합니다.
 */
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
    // ✅ 권장: 앞으로는 여기만 채우면 됩니다.
    media: {
      kind: "youtube",
      src: "https://youtu.be/LLY3FR1Sb3I?si=1O3wcJZANL766oDf",
      // poster: "/images/projects/infographics-01-poster.jpg", // 필요 시 사용
    },
  },
];

/** category로 필터링 */
export function getWorksByCategory(category) {
  if (!category || category === "all") return works;
  return works.filter((w) => w.category === category);
}

/**
 * Placeholder 생성
 * - media.kind/src가 비어있으면 클릭해도 모달이 안 열리는(=정상) 상태
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
 * 목표 카드 수(기본 30개)로 자동 채우기
 * - 실제 작업이 8개면: 8개 + placeholder 22개 = 30개
 */
export function buildGrid({ category = "all", targetCount = 30 } = {}) {
  const base = getWorksByCategory(category);
  const remain = Math.max(0, targetCount - base.length);
  return remain > 0 ? [...base, ...makePlaceholders({ count: remain, category })] : base;
}
