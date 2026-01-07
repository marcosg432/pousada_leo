import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A90E2', // Azul médio
          dark: '#357ABD',
          light: '#6BA3E8',
        },
        accent: {
          DEFAULT: '#FFB84D', // Amarelo quente
          dark: '#E6A03D',
          light: '#FFC870',
        },
        secondary: {
          DEFAULT: '#FF9B9B', // Rosa suave/coral
          dark: '#E67B7B',
          light: '#FFB5B5',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
export default config





