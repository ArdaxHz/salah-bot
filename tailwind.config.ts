import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'
import tailwindcssDisplaymodes from 'tailwindcss-displaymodes'

export default <Partial<Config>>{
  plugins: [daisyui, tailwindcssDisplaymodes],
  theme: {
    extend: {
      borderRadius: {
        base: '.25rem',
      },
      fontFamily: {
        custom: ['Lexend', 'ui-sans-serif', 'system-ui'],
      },
      screens: {
        'xs': '380px',
        '3xl': '1600px',
      },
      colors: {
        bell: {
          50: '#f7f8fb',
          100: '#f0eff8',
          200: '#e3e2f2',
          300: '#cdcbe7',
          400: '#b2acd9',
          500: '#978dc9',
          600: '#8070b7',
          700: '#6f5da4',
          800: '#5d4e89',
          900: '#4d4171',
          950: '#312a4b',
        },
        chetwode: {
          50: '#f6f6fc',
          100: '#efeef9',
          200: '#e0dff5',
          300: '#c9c6ec',
          400: '#ada5e0',
          500: '#9081d3',
          600: '#7b63c4',
          700: '#6a51b0',
          800: '#594394',
          900: '#4a3979',
          950: '#2e2451',
        },
        silver: {
          50: '#f7f7f7',
          100: '#ededed',
          200: '#dfdfdf',
          300: '#c8c8c8',
          400: '#b8b8b8',
          500: '#999999',
          600: '#888888',
          700: '#7b7b7b',
          800: '#676767',
          900: '#545454',
          950: '#363636',
        },
        mulled: {
          50: '#f2f2fb',
          100: '#e6e7f9',
          200: '#d3d3f2',
          300: '#b8b7ea',
          400: '#a19adf',
          500: '#9081d3',
          600: '#7e67c4',
          700: '#6d57ab',
          800: '#59488b',
          900: '#4a3f6f',
          950: '#2c2541',
        },
      },
    },
  },
  daisyui: {
    themes: false,
    darkTheme: 'dark',
    base: false,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root',
  },
  darkMode: 'selector',
}
