/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        loginForm: "url('/images/login-form.jpg')"
      },
      colors: {
        customColor: {
          dark: '#94a3b8' // Darker shade
        }
      }
    }
  },

  darkMode: ['variant', ['@media (prefers-color-scheme: dark) { &:not(.light *) }', '&:is(.dark *)']],
  plugins: []
}
