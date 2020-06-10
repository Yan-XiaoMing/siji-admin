const {override, fixBabelImports, addLessLoader, addDecoratorsLegacy} = require('customize-cra');


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
