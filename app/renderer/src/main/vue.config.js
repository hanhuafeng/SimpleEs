const path = require('path')
const webpack = require("webpack");


function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    outputDir: '../../pages/main',
    /* 部署应用包的基本URL */
    // publicPath: './',
    /* 是否保存时 lint 代码 */
    lintOnSave: true,
    devServer: {
        port: 18095
    },
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('views', resolve('src/views'))
            .set('plugins', resolve('src/plugins'))
        config.plugin('html')
            .tap(args => {
                args[0].title = '测试'
                return args
            })
    },
    //configureWebpack 是Vue CLI3.0 中用于配置 webpack 插件参数的地方，你在这里设置，会新建或者覆盖 webpack 默认配置。
    //webpack ProvidePlugin 的含义是创建一个全局的变量，使这个变量在 webpack 各个模块内都可以使用。这里的配置含义是创建 '$'、'jQuery'、'window.jQuery' 三个变量指向 jquery 依赖，创建 'Popper' 变量指向 popper.js 依赖。
    configureWebpack: {
        plugins: [
            /* 配置全局JQuery */
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                Popper: ['popper.js', 'default']
            })
        ]
    }
}
