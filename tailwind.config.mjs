/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ✅ 모드별 primary 자동 변경 (global.css의 --color-primary-rgb를 따라감)
        primary: 'rgb(var(--color-primary-rgb) / <alpha-value>)',

        // ✅ 가독성 개선: 너무 탁하게 느껴지지 않으면서 정보 전달력이 좋은 딥 차콜 그린
        // 기존: '#233630'
        secondary: '#182421',

        // ✅ highlightBlue는 더 진한 톤(포커스 링/강조선이 라이트 배경에서도 확실히 보이게)
        // 그라데이션 끝 색(#7CA69A)은 gradient 전용으로만 사용
        highlightBlue: '#2C423C',

        neutral: {
          bg: '#FAFAF0',
          dark: '#333331',
        },
      },

      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Sora', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },

      fontSize: {
        h1: 'clamp(3rem, 5vw, 4.5rem)',
        h2: 'clamp(2.25rem, 4vw, 3rem)',
        body: 'clamp(1rem, 1.125vw, 1.125rem)',
      },

      maxWidth: {
        container: '1280px',
      },

      gridTemplateColumns: {
        12: 'repeat(12, minmax(0, 1fr))',
      },

      gap: {
        gutter: '24px',
      },

      // ✅ 버튼 섀도는 기존 의도대로 유지(#2C423C 계열)
      boxShadow: {
        button: '0 4px 12px 0 rgba(44,66,60,0.25)',
      },

      transitionProperty: {
        transform: 'transform',
      },

      backgroundImage: {
        // ✅ primary(모드별) → #7CA69A(그라데이션 전용)로 연결
        akzentGradient:
          'linear-gradient(180deg, rgb(var(--color-primary-rgb)) 0%, #7CA69A 100%)',
      },
    },

    screens: {
      sm: '600px',
      md: '960px',
      lg: '1280px',
    },
  },
  plugins: [],
};
