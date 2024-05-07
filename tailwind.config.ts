import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      defaultTheme: 'dark',
      themes: {
        dark: {
          colors: {
            background: '#080006',
            primary: {
              DEFAULT: '#f45c92',
            },
          },
        },
        secondaryDark: {
          extend: 'dark',
          colors: {
            background: '#09020d',
            primary: {
              DEFAULT: '#9252d1',
            },
            secondary: {
              DEFAULT: '#f45c92',
            },
          },
        },
        success: {
          extend: 'dark',
          colors: {
            background: '#010804',
            primary: {
              DEFAULT: '#17c964',
            },
            success: {
              DEFAULT: '#f45c92',
            },
          },
        },
        warning: {
          extend: 'dark',
          colors: {
            background: '#0a0701',
            primary: {
              DEFAULT: '#f5a524',
            },
            warning: {
              DEFAULT: '#17c964',
            },
          },
        },
        danger: {
          extend: 'dark',
          colors: {
            background: '#0a0205',
            primary: {
              DEFAULT: '#f31260',
            },
            danger: {
              DEFAULT: '#17c964',
            },
          },
        },
        navyBlue: {
          extend: 'dark',
          colors: {
            background: '#01050a',
            primary: {
              DEFAULT: '#0a3066',
            },
          },
        },
      },
    }),
  ],
};

export default config;

