/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0F172A',
          accent: '#4F46E5',
        },
        surface: {
          page: '#F8FAFC',
          card: '#FFFFFF',
        },
        text: {
          primary: '#0F172A',
          muted: '#475569',
        },
        // Tweak in M6 (tag-style) and M8 (due-tint)
        feature: '#0284C7', // brand feature blue from DESIGN.md
        bug: '#DC2626',     // crimson from DESIGN.md
        due: {
          safe: '#16A34A',
          warning: '#D97706',
          overdue: '#B91C1C',
          neutral: '#64748B',
        },
      },
    },
  },
  plugins: [],
};
