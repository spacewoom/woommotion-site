// src/data/works.js

export const works = [
  {
    title: '인포그래픽 | 기후동행카드 (35s)',
    slug: 'infographics-01',
    category: 'agency', // 'agency' | 'digital'
    image: '/images/projects/card.jpg',
    tags: ['인포그래픽', '모션그래픽'],
    summary:
      '텍스트를 최소화하고 직관적인 이미지 중심으로 구성해, 짧은 시간 안에 핵심 정보가 이해되도록 디자인했습니다.',
    info: {
      year: '2024',
      duration: '35s',
      role: '기획 · 디자인 · 애니메이션',
      youtubeUrl: 'https://youtu.be/LLY3FR1Sb3I?si=1O3wcJZANL766oDf',
    },
  },
  {
    title: '프로모션 | Prmr 크루 모집',
    slug: 'promotion-01',
    category: 'agency',
    image: '/images/projects/prmr.jpg',
    tags: ['타이포그래픽', '프로모션'],
    summary:
      '리드미컬한 타이포 키네틱과 화면 템포를 중심으로, 메시지가 빠르고 선명하게 전달되도록 제작했습니다.',
    info: {
      year: '2024',
      duration: '15s',
      role: '기획 · 디자인 · 애니메이션',
      youtubeUrl: 'https://youtu.be/K_o555Ywq28?si=hvlUgRNbGhntTqAI',
    },
  },
  {
    title: '제품 홍보 | Grida pencil',
    slug: 'product-01',
    category: 'digital',
    image: '/images/projects/grida.jpg',
    tags: ['제품 홍보', '모션그래픽'],
    summary:
      '“아이디어는 끄적이는 순간부터 시작된다”는 메시지를 중심으로 드로잉 요소와 모션을 결합해 생동감 있게 표현했습니다.',
    info: {
      year: '2022',
      duration: '30s 내외',
      role: '기획 · 디자인 · 애니메이션 · 3D 모델링',
      youtubeUrl: 'https://youtu.be/dcmq0tn98So?si=jOl7SytoZ3DJiQWZ',
    },
  },
];

// 카드 수가 부족할 때 자동으로 채우는 placeholder
export function makePlaceholders(count = 0) {
  return Array.from({ length: Math.max(0, count) }).map((_, idx) => ({
    title: `Coming soon ${idx + 1}`,
    slug: `placeholder-${idx + 1}`,
    category: 'agency',
    image: '/images/projects/placeholder.jpg',
    tags: ['준비중'],
    summary: '작업 업로드 예정입니다.',
    info: { year: '-', duration: '-', role: '-', youtubeUrl: '' },
  }));
}
