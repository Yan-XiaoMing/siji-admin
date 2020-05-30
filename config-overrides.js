const {override, fixBabelImports, addLessLoader, addDecoratorsLegacy} = require('customize-cra');
const {getLessVars} = require('antd-theme-generator');
const path = require('path');

module.exports = override(
  fixBabelImports('antd', {
      libraryDirectory: 'es',
      style: true
    }
  ),

  addLessLoader({
    lessOptions: {
      javascriptEnabled: true
    }
  }),

  addDecoratorsLegacy()
);
