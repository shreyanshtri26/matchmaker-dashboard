/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef9f0',
          100: '#fdf2e0',
          200: '#fbe0c2',
          300: '#f9ce9f',
          400: '#f7bc7d',
          500: '#f5aa5a',
          600: '#de9951',
          700: '#b87f43',
          800: '#8c6234',
          900: '#604326',
        },
        secondary: {
          50: '#f5f7f7',
          100: '#e0e7e7',
          200: '#c1cfcf',
          300: '#9fb2b2',
          400: '#7d9595',
          500: '#5c7878',
          600: '#4a6060',
          700: '#384848',
          800: '#263030',
          900: '#141818',
        },
        background: '#f8f5f0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        72: '18rem',
        84: '21rem',
        96: '24rem',
        128: '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
