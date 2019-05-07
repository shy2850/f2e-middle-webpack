const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const running = process.argv.includes('start')

const getWebpackConfig = (config_file, conf) => {
    const cfg_path = path.join(conf.root, config_file)
    if (fs.existsSync(cfg_path)) {
        const cfg = require(cfg_path)
        if (typeof cfg === 'function') {
            return [].concat(cfg(conf))
        } else {
            return [].concat(cfg)
        }
    } else {
        throw Error(`${config_file} needed!`)
    }
}

module.exports = (conf, opt = {}) => {
    const { build, root, gzip, output } = conf
    const { setBefore, test = /^static\//, config_file = 'webpack.config.js', options = {} } = opt;
    const configs = getWebpackConfig(config_file, conf)
    const compiler = webpack(configs.map(c => Object.assign({
        context: root,
        devtool: build ? false : 'source-map',
        mode: build ? 'production' : 'development'
    }, c, {
        output: Object.assign({}, c.output, { path: output })
    })))

    let app;
    let init;
    return {
        setBefore,
        onSet: !running ? (pathname, data, store) => {
            if (!init && configs.find(({ entry }) => path.join(root, entry) === path.join(root, pathname) )) {
                init = true
                return new Promise((resolve, reject) => {
                    compiler.run(function (error, stat) {
                        error ? reject(error) : resolve(data)
                    })
                })
            }
        } : undefined,
        onRoute: running ? (pathname, req, resp) => {
            if (test.test(pathname)) {
                app = app || webpackMiddleware(compiler, Object.assign({

                }, options))
                const _end = resp.end.bind(resp)
                let end = _end
                if (gzip) {
                    end = function (content, ...args) {
                        const result = zlib.gzipSync(content)
                        resp.setHeader('Content-Encoding', 'gzip')
                        resp.setHeader('Content-Length', result.length)
                        _end(result, ...args)
                    }
                }
                app(req, Object.assign(resp, {
                    end
                }), function () {
                    resp.end('')
                })
                return false
            }
        } : undefined
    }
}