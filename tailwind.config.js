/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FF6B6B',
        'secondary': '#4ECDC4',
        'accent': '#FFE66D',
        'success': '#2ECC71',
        'warning': '#F39C12',
        'danger': '#E74C3C',
        'info': '#3498DB'
      }
    },
  },
  plugins: [],
}
