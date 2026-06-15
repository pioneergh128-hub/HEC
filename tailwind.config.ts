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
        navy: {
          950: '#060d1f',
          900: '#0b1426',
          800: '#0f1f3d',
          700: '#162a52',
          600: '#1e3a6e',
          500: '#2a4f8f',
        },
        accent: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          glow: '#60a5fa',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 0 0 1px rgba(59,130,246,0.15), 0 4px 24px rgba(0,0,0,0.4)',
        'glow-blue': '0 0 20px rgba(59,130,246,0.3)',
        'glow-green': '0 0 20px rgba(16,185,129,0.3)',
      },
    },
  },
  plugins: [],
}
export default config
