import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

export default <Partial<Config>>{
  plugins: [daisyui],
  theme: {
    extend: {
      fontFamily: {
        custom: ['Lexend', 'ui-sans-serif', 'system-ui'],
      },
      screens: {
        'xs': '380px',
        '3xl': '1600px',
      },
      colors: {
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
        flax: {
          50: '#f3f4f1',
          100: '#e6e7e0',
          200: '#cfd2c4',
          300: '#b0b6a0',
          400: '#949b80',
          500: '#7a8266',
          600: '#5c634d',
          700: '#494e3d',
          800: '#3c4034',
          900: '#35382f',
          950: '#1b1d16',
        },
      }
    }
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
  darkMode: 'selector'
}
