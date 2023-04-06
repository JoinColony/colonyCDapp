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
      '3xl': ['1.875rem', 1.3],
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
        'teams-yellow': {
          50: '#FFFAF5',
          100: '#FFF6ED',
          500: '#F4A118',
        },
        'teams-red': {
          50: '#FFF1F3',
          100: '#FFF2ED',
          400: '#C4320A',
          600: '#E31B54',
        },
        'teams-pink': {
          50: '#FEF6FB',
          100: '#FDF2FA',
          150: '#F9EBEB',
          400: '#EE46BC',
          500: '#C11574',
          600: '#A11043',
        },
        'teams-green': {
          50: '#E5FFFA',
          100: '#FFF6ED',
          400: '#0FA98A',
          500: '#01A63E',
        },
        'teams-teal': {
          50: '#EDFAFA',
          500: '#0694A2',
        },
        'teams-blue': {
          50: '#EBF5FF',
          400: '#338FEB',
        },
        'teams-indigo': {
          50: '#EAECF5',
          500: '#4E5BA6',
        },
        'teams-purple': {
          100: '#ECE7FE',
          400: '#7A5AF8',
          500: '#3405E1',
        },
        'teams-grey': {
          50: '#F4F4F4',
          100: '#ECEFF1',
          500: '#415A77',
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
