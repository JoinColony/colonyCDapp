module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
    },
    fontSize: {
      xs: ['0.625rem', 1.6],
      sm: ['0.75rem', 1.5],
      md: ['0.875rem', 1.4],
      lg: ['1rem', 1.5],
      xl: ['1.125rem', 1.5],
      '2xl': ['1.5rem', 1.25],
      '3xl': ['1.875rem', 1.3],
      '4xl': ['2.375rem', 1.2],
    },
    extend: {
      colors: {
        gray: {
          25: 'var(--color-gray-25)',
          50: 'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          900: 'var(--color-gray-900)',
        },
        base: {
          white: 'var(--color-base-white)',
          black: 'var(--color-base-black)',
          bg: 'var(--color-base-bg)',
          sprite: 'var(--color-base-sprite)',
        },
        blue: {
          100: 'var(--color-blue-100)',
          200: 'var(--color-blue-200)',
          300: 'var(--color-blue-300)',
          400: 'var(--color-blue-400)',
        },
        'blue-light': {
          100: 'var(--color-blue-light-100)',
          200: 'var(--color-blue-light-200)',
        },
        pink: {
          100: 'var(--color-pink-100)',
          200: 'var(--color-pink-200)',
        },
        negative: {
          100: 'var(--color-negative-100)',
          200: 'var(--color-negative-200)',
          300: 'var(--color-negative-300)',
          400: 'var(--color-negative-400)',
        },
        warning: {
          100: 'var(--color-warning-100)',
          200: 'var(--color-warning-200)',
          400: 'var(--color-warning-400)',
        },
        success: {
          100: 'var(--color-success-100)',
          200: 'var(--color-success-200)',
          400: 'var(--color-success-400)',
        },
        indigo: {
          100: 'var(--color-indigo-100)',
          200: 'var(--color-indigo-200)',
          400: 'var(--color-indigo-400)',
        },
        purple: {
          100: 'var(--color-purple-100)',
          200: 'var(--color-purple-200)',
          400: 'var(--color-purple-400)',
        },
        'teams-yellow': {
          50: 'var(--color-teams-yellow-50)',
          100: 'var(--color-teams-yellow-100)',
          500: 'var(--color-teams-yellow-500)',
        },
        'teams-red': {
          50: 'var(--color-teams-red-50)',
          100: 'var(--color-teams-red-100)',
          400: 'var(--color-teams-red-400)',
          600: 'var(--color-teams-red-600)',
        },
        'teams-pink': {
          50: 'var(--color-teams-pink-50)',
          100: 'var(--color-teams-pink-100)',
          150: 'var(--color-teams-pink-150)',
          400: 'var(--color-teams-pink-400)',
          500: 'var(--color-teams-pink-500)',
          600: 'var(--color-teams-pink-600)',
        },
        'teams-green': {
          50: 'var(--color-teams-green-50)',
          100: 'var(--color-teams-green-100)',
          400: 'var(--color-teams-green-400)',
          500: 'var(--color-teams-green-500)',
        },
        'teams-teal': {
          50: 'var(--color-teams-teal-50)',
          500: 'var(--color-teams-teal-500)',
        },
        'teams-blue': {
          50: 'var(--color-teams-blue-50)',
          400: 'var(--color-teams-blue-400)',
        },
        'teams-indigo': {
          50: 'var(--color-teams-indigo-50)',
          500: 'var(--color-teams-indigo-500)',
        },
        'teams-purple': {
          100: 'var(--color-teams-purple-100)',
          400: 'var(--color-teams-purple-400)',
          500: 'var(--color-teams-purple-500)',
        },
        'teams-grey': {
          50: 'var(--color-teams-grey-50)',
          100: 'var(--color-teams-grey-100)',
          500: 'var(--color-teams-grey-500)',
        },
      },
      boxShadow: {
        default: '0px 10px 30px rgba(0, 0, 0, 0.05)',
        content: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        overlay: 'blur(2px)',
      },
      transitionDuration: {
        slow: '450ms',
        normal: '300ms',
        fast: '175ms',
      },
      screens: {
        sm: '53.125rem',
        md: '64rem',
        lg: '90rem',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
};
