/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd3ff',
          300: '#8eb8ff',
          400: '#5991ff',
          500: '#2563eb', // Royal Blue
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e378a',
          900: '#1e2f6f',
        },
        accent: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // Vivid Purple
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        trust: {
          high: '#10b981',   // Emerald
          moderate: '#f59e0b', // Amber
          low: '#ef4444',    // Rose
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(37, 99, 235, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 25px -3px rgba(37, 99, 235, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 25px -5px rgba(124, 58, 237, 0.35)',
      }
    },
  },
  plugins: [],
}
