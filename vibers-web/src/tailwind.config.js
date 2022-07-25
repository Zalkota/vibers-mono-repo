module.exports = {
  purge: {
    enabled: false,
  },
  theme: {},
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'group-hover'],
    opacity: ['responsive', 'hover', 'focus', 'disabled'],
    cursor: ['disabled'],
  },
  plugins: [

import '@tailwindcss/custom-forms'
  ],
};
