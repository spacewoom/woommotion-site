// src/data/works.js
export const CATEGORIES = {
  AGENCY: "agency",
  SIGNAGE: "signage",
};

// YouTube / 로컬 파일 둘 다 지원
// - youtube: src에 youtu.be 또는 youtube.com 링크 넣기
// - file: public 폴더에 업로드 후 /videos/xxx.mp4 처럼 src 지정
export const works = [
  {
    id: "work-001",
    category: CATEGORIES.AGENCY,
    title: "인포그래픽 | 기후동행카드 (35s)",
    tags: ["인포그래픽", "모션그래픽"],
    summary:
      "텍스트를 최소화하고 직관적인 이미지 중심으로 구성해, 짧은 시간 안에 핵심 정보가 이해되도록 디자인했습니다.",
    info: { year: "2024", duration: "35s", role: "기획 · 디자인 · 애니메이션" },
    media: {
      kind: "youtube",
      src: "https://youtu.be/LLY3FR1Sb3I?si=1O3wcJZANL766oDf",
      // poster는 선택. 없으면 유튜브 썸네일 자동 사용
      poster: "",
    },
  },

  {
    id: "work-002",
    category: CATEGORIES.SIGNAGE,
    title: "프로모션 | Prmr 크루 모집",
    tags: ["타이포그래픽", "프로모션"],
    summary:
      "리드미컬한 타이포 키네틱과 화면 템포를 중심으로, 메시지가 빠르고 선명하게 전달되도록 제작했습니다.",
    info: { year: "2024", duration: "15s", role: "기획 · 디자인 · 애니메이션" },
    media: {
      kind: "youtube",
      src: "https://youtu.be/K_o555Ywq28?si=hvlUgRNbGhntTqAI",
      poster: "",
    },
  },

  // ✅ 로컬 mp4 예시 (public/videos/sample.mp4 업로드 후)
  // {
  //   id: "work-003",
  //   category: CATEGORIES.AGENCY,
  //   title: "로컬 파일 테스트",
  //   tags: ["제품 홍보"],
  //   summary: "로컬 mp4를 모달에서 재생합니다.",
  //   info: { year: "2025", duration: "20s", role: "애니메이션" },
  //   media: {
  //     kind: "file",
  //     src: "/videos/sample.mp4",
  //     poster: "/images/projects/grida.jpg", // 가능하면 poster 추천
  //   },
  // },

  // ... 여기서 30개까지 계속 추가
];
