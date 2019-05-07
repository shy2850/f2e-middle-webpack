const { argv } = process
const build = argv[argv.length - 1] === 'build'
module.exports = {
    livereload: !build,
    build,
    gzip: true,
    useLess: true,
    buildFilter: (p) => !p || /^(test|css|index\.html)/.test(p),
    middlewares: [
        require('./')
    ],
    output: require('path').join(__dirname, './output')
}
