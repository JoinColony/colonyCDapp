/* eslint-disable global-require */

module.exports = {
  mode: 'jit',
  content: ['./src/styles/main.css', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
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
        800: 'var(--color-gray-800)',
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
        300: 'var(--color-teams-green-300)',
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
        500: 'var(--color-teams-blue-500)',
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
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
    },
    fontSize: {
      '2xs': ['.5rem', 1.5],
      xs: ['0.625rem', 1.6],
      sm: ['0.75rem', 1.5],
      md: ['0.875rem', '1.25rem'],
      lg: ['1rem', 1.5],
      xl: ['1.125rem', 1.5],
      '2xl': ['1.5rem', 1.25],
      '3xl': ['1.875rem', 1.3],
      '4xl': ['2.375rem', 1.2],
    },
    extend: {
      height: {
        screen: ['100vh /* fallback for Opera, IE and etc. */', '100dvh'],
      },
      boxShadow: {
        default: '0px 10px 30px rgba(0, 0, 0, 0.05)',
        content: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        overlay: 'blur(2px)',
        'light-blue': '0px 0px 3px 3px rgba(239, 248, 255, 1)',
      },
      transitionDuration: {
        slow: '450ms',
        normal: '300ms',
        fast: '175ms',
      },
      screens: {
        sm: '48rem',
        md: '64.0625rem',
        lg: '80rem',
        xl: 'calc(90rem + 1px)',
      },
      zIndex: {
        base: '1',
        mid: '2',
        sidebar: '10',
        dropdown: '20',
        header: '100',
        top: '1000',
        userNav: '11',
        userNavModal: '1001',
      },
      spacing: {
        4.5: '1.125rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    // https://github.com/tailwindlabs/tailwindcss/issues/5989#issuecomment-962048436
    function ({ addUtilities, addComponents, addBase, theme }) {
      addBase({
        ':root': {
          '--top-content-height': '0px',
        },
        html: {
          '@apply font-inter text-lg text-gray-900 min-h-full h-auto antialiased':
            {},
        },
        body: {
          '@apply min-h-screen bg-base-white overflow-x-hidden': {},
        },
        'svg:not([class])': {
          '@apply fill-current stroke-none': {},
        },
        '#root': {
          '@apply min-h-screen': {},
        },
        button: {
          'text-decoration': 'inherit',
        },
        'input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button':
          {
            margin: 0,
            '-webkit-appearance': 'none',
          },
        /* hide arrows for Firefox */
        'input[type="number"]': {
          '-moz-appearance': 'textfield',
        },
        '::-webkit-scrollbar': {
          '@apply w-[.4375rem]': {},
        },
        '::-webkit-scrollbar-track': {
          '@apply w-[.3125rem] bg-transparent': {},
        },
        '::-webkit-scrollbar-thumb': {
          '@apply rounded-md bg-gray-100 transition-all md:hover:bg-gray-300':
            {},
        },
      });
      addUtilities({
        '.heading-1': {
          '@apply text-4xl font-semibold': {},
        },
        '.heading-2': {
          '@apply text-3xl font-semibold': {},
        },
        '.heading-3': {
          '@apply font-semibold text-2xl': {},
        },
        '.heading-4': {
          '@apply text-xl font-semibold': {},
        },
        '.heading-5': {
          '@apply text-lg font-semibold': {},
        },
        '.text-1': {
          '@apply text-md font-medium': {},
        },
        '.text-2': {
          '@apply text-md font-semibold': {},
        },
        '.text-3': {
          '@apply text-sm font-medium': {},
        },
        '.text-4': {
          '@apply text-xs font-medium': {},
        },
        '.text-5': {
          '@apply text-xs font-semibold': {},
        },
        '.text-6': {
          '@apply font-bold text-xs': {},
        },
        '.description-1': {
          '@apply text-sm text-gray-700': {},
        },
        '.skeleton': {
          position: 'relative',
          'pointer-events': 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-1px',
            left: '-1px',
            right: '-1px',
            bottom: '-1px',
            'z-index': 1,
            'background-color': theme('colors.gray.100'),
            'background-repeat': 'no-repeat',
            'min-height': '1em',
            'background-image':
              'linear-gradient(90deg,rgba(255, 255, 255, 0),rgba(255, 255, 255, 0.5),rgba(255, 255, 255, 0))',
            'background-size': '2.5rem 100%',
            'background-position': 'left -2.5rem top 0',
            animation: 'shine 1.125s ease infinite',
          },
        },
        '.break-word': {
          'word-break': 'break-word',
        },
        '.no-scrollbar': {
          'scrollbar-width': 'none',
        },
      });
      addComponents({
        '.inner': {
          '@apply px-6 w-full max-w-[77.375rem] mx-auto': {},
        },
        '.navigation-link': {
          '@apply text-gray-700 w-full flex items-center !duration-0 heading-5 hover:!text-gray-900 hover:font-medium px-4 py-2 sm:font-normal sm:text-md sm:text-gray-900':
            {},
        },
        '.subnav-button': {
          '@apply flex w-full items-center text-md transition-colors duration-normal text-gray-900 sm:hover:bg-gray-50 sm:hover:font-medium rounded py-2 px-3.5':
            {},
        },
        '.input-round': {
          '@apply bg-base-white rounded border py-3 px-3.5': {},
        },
        '.input': {
          '@apply w-full text-gray-900 text-md outline-0 placeholder:text-gray-400 outline-none':
            {},
        },
        '.selectButton': {
          '@apply outline-blue-100 outline outline-[0.1875rem] border-blue-200':
            {},
        },
        '.divider': {
          '@apply w-full border border-gray-200': {},
        },
      });
    },
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
