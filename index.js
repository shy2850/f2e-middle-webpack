// ts-check
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const RUNNING = process.argv.includes('start')

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
/**
 * @returns {import('f2e-server').Middleware}
 */
module.exports = (conf, opt = {}) => {
    const { build, root, gzip, output } = conf
    const {
        setBefore,
        test = /^static\//,
        config_file = 'webpack.config.js',
        running = RUNNING,
        options = {}
    } = opt;
    const configs = getWebpackConfig(config_file, conf)
    const compiler = webpack(configs.map(c => Object.assign({
        context: root,
        devtool: build ? false : 'source-map',
        mode: build ? 'production' : 'development'
    }, c, {
        output: Object.assign({}, c.output, { path: output })
    })))

    let app;
    if (!running) {
        compiler.run(function (error, stat) {
            if (error) {
                console.log(error)
            } else {
                console.log(stat.toString())
            }
        })
    }
    return {
        setBefore,
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