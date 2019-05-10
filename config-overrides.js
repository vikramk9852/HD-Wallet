const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            '@primary-color': 'black',
            "@table-row-hover-bg": "#282c2f",
            "@table-header-bg": "#1a1d20",
            "@collapse-header-bg": "transparent",
            "@collapse-content-bg": "transparent",
            "@modal-mask-bg": "fade(black, 90%)",



        },
    }),
);