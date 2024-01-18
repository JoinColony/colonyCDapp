const path = require('path');
const postCSSImport = require('postcss-import');
const postCSSSvg = require('postcss-svg');
const svgoPlugins = require('./webpack.base').svgoPlugins;
const tailwindcss = require('tailwindcss');
const nesting = require('tailwindcss/nesting');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    postCSSImport(),
    postCSSSvg({
      dirs: path.resolve(__dirname, 'src/images/icons'),
      svgo: {
        plugins: svgoPlugins,
      },
    }),
    nesting(),
    tailwindcss(),
    autoprefixer(),
  ],
};
