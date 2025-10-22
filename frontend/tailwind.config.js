/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#6366f1',
        indigoGlow: '#4f46e5',
        emeraldGlow: '#34d399',
        slateOverlay: 'rgba(15, 23, 42, 0.75)',
      },
      boxShadow: {
        glow: '0 25px 50px -20px rgba(99, 102, 241, 0.45)',
        'glow-emerald': '0 25px 45px -18px rgba(52, 211, 153, 0.35)',
      },
      backgroundImage: {
        'radial-dashboard': 'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(59, 130, 246, 0.18), transparent 40%), radial-gradient(circle at 50% 120%, rgba(16, 185, 129, 0.2), transparent 55%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
