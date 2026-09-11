/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Core brand — a restrained "command console" blue, not a generic SaaS indigo.
        brand: {
          50: '#eef4ff',
          100: '#dbe7fe',
          200: '#bcd4fd',
          300: '#8db8fb',
          400: '#5794f6',
          500: '#2f6fee',
          600: '#1e54d6',
          700: '#1941ab',
          800: '#193a8a',
          900: '#18336e',
          950: '#0f2047',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f5f7fa',
          subtle: '#eef1f5',
          border: '#e2e7ee',
        },
        ink: {
          900: '#0f1a2e',
          700: '#334155',
          500: '#64748b',
          400: '#94a3b8',
        },
        success: {
          50: '#ecfdf3',
          500: '#16a34a',
          600: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          500: '#d97706',
          600: '#b45309',
        },
        danger: {
          50: '#fef2f2',
          500: '#dc2626',
          600: '#b91c1c',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15, 26, 46, 0.04), 0 1px 3px 0 rgba(15, 26, 46, 0.06)',
      },
      borderRadius: {
        md: '8px',
        lg: '10px',
      },
    },
  },
  plugins: [],
}
