# f2e-middle-webpack
f2e-middle-webpack
[f2e-server](https://github.com/shy2850/f2e-server) middleware for webpack

# [f2e-server](https://github.com/shy2850/f2e-server)

``.f2econfig.js``

```js
module.exports = {
    middlewares: [
        {
            middleware: 'webpack',
            // test 需要配合 webpack 的 output 配置
            test: /^static\//,
            config_file: 'webpack.config.js',
            // options?: WebpackDevMiddleware.Options
        }
    ]
}
```
