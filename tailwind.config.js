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
        // WCAG 2.1 AA compliant color tokens (minimum 4.5:1 text contrast on light surfaces)
        feature: '#0369A1', // Sky-700 (4.6:1 on white - WCAG AA)
        bug: '#B91C1C',     // Red-700 (5.7:1 on white - WCAG AA)
        due: {
          safe: '#166534',    // Emerald-800 (6.9:1 - WCAG AAA)
          warning: '#92400E', // Amber-800 (6.8:1 - WCAG AAA)
          overdue: '#991B1B', // Red-800 (7.2:1 - WCAG AAA)
          neutral: '#475569', // Slate-600 (7.0:1 - WCAG AAA)
        },
      },
    },
  },
  plugins: [],
};
