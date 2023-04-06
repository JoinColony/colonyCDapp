module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx}',
    './stories/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
    },
    fontSize: {
      xs: ['0.625rem', 1.6],
      sm: ['0.75rem', 1.5],
      base: ['0.875rem', 1.4],
      lg: ['1rem', 1.5],
      xl: ['1.125rem', 1.5],
      '2xl': ['1.5rem', 1.25],
      '3xl': ['1.875rem', 1.3],
      '4xl': ['2.375rem', 1.2],
    },
    extend: {
      colors: {
        gray: {
          25: '#FCFCFD',
          50: '#F9FAFB',
          100: '#F2F4F7',
          200: '#E4E7EC',
          300: '#D0D5DD',
          400: '#98A2B3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          900: '#101828',
        },
        base: {
          white: '#ffffff',
          black: '#000000',
          bg: '#F9FBFC',
          sprite: '#343434',
        },
        blue: {
          100: '#EFF8FF',
          200: '#82B1FF',
          300: '#448AFF',
          400: '#2962FF',
        },
        'blue-light': {
          100: '#E0F2FE',
          200: '#91D2FA',
        },
        pink: {
          100: '#FCE7F6',
          200: '#FFBBDC',
        },
        negative: {
          100: '#FEF3F2',
          200: '#FEE4E2',
          300: '#F97066',
          400: '#D92D20',
        },
        warning: {
          100: '#FFFAEB',
          200: '#FEF0C7',
          400: '#F79009',
        },
        success: {
          100: '#ECFDF3',
          200: '#D1FADF',
          400: '#039855',
        },
        indigo: {
          100: '#EEF4FF',
          200: '#A4BCFD',
          400: '#444CE7',
        },
        purple: {
          100: '#F4F3FF',
          200: '#9B8AFB',
          400: '#6938EF',
        },
      },
    },
  },
};
