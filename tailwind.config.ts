import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ...
      borderRadius: {
        'custom-sm': '0.25rem',
        'custom-md': '0.5rem',
        'custom-lg': '1rem',
        'custom-xl': '2rem',
      },
      colors: {
        primary: {
          DEFAULT: '#00a667',
          dark: '#007347',
          on: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f21872',
          dark: '#bf135b',
          on: '#ffffff',
        },
        tertiary: {
          DEFAULT: '#f27d18',
          dark: '#bf6313',
          on: '#ffffff',
        },
        quaternary: {
          DEFAULT: '#0eb7ff',
          dark: '#0a8fd1',
          on: '#ffffff',
        },
        text: {
          light: '#585858',
          DEFAULT: '#212121',
          dark: '#000000',
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#e0e0e0',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'sans-serif'],
        serif: ['"Young Serif"', 'ui-serif', 'serif'],
      },
      fontSize: {
        'heading-lg': ['2.5rem', '1'],
        'heading-md': ['2rem', '1'],
        'heading-sm': ['1.5rem', '1'],
        'body-lg': ['1.5rem', 'normal'],
        'body-md': ['1rem', 'normal'],
        'body-sm': ['0.75rem', 'normal'],
      },
      margin: {
        xs: '2rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '2rem',
        xl: '4rem',
      },
      'margin-block': {
        xs: '2rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '2rem',
        xl: '4rem',
      },
      'margin-inline': {
        xs: '2rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '2rem',
        xl: '4rem',
      },
      padding: {
        xs: '2rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '2rem',
        xl: '4rem',
      },
      'padding-block': {
        xs: '2rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '2rem',
        xl: '4rem',
      },
      'padding-inline': {
        xs: '2rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '2rem',
        xl: '4rem',
      },
      transitionTimingFunction: {
        'custom-default': 'cubic-bezier(0.34, 0.48, 1, 0.42)',
      },
    },
  },
  plugins: [],
};
export default config;
