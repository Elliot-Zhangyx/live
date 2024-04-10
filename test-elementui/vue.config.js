module.exports = {
    chainWebpack(config) {
      // set worker-loader
      config.module
        .rule('worker')
        .test(/\.worker\.js$/)
        .use('worker-loader')
        .loader('worker-loader')
        .end();

      // 解决：worker 热更新问题
      config.module.rule('js').exclude.add(/\.worker\.js$/);
    },
    chainWebpack: config => {
      // 解决：“window is undefined”报错，这个是因为worker线程中不存在window对象，因此不能直接使用，要用this代替
      config.output.globalObject('this')
    },
    publicPath: "/",
    assetsDir: "static",
    parallel: false,
    outputDir: 'dist',
    lintOnSave: false, //关闭语法检查
     devServer: { // 跨域配置
        //  port: 8081, // 本地服务端口号，如果端口号被占用，会自动提升1
        //  host: 'localhost', //本地主机名， 127.0.0.1， 真机 0.0.0.0
        https: false, //不适应https协议
        open: true, //启动服务时自动打开浏览器访问
        proxy: {  
          '/socket.io': {
          //  target: 'http://101.43.196.8:3000',
          target: 'http://localhost:3000',
           ws: true,
            // pathRewrire: {
            //   '^/socket.io': ''
            // },
           changeOrigin: true
         },
         'sockjs-node': {
          //  target: 'http://101.43.196.8:3000',
          target: 'http://localhost:3000',
           ws: false,
           changeOrigin: true
         },
        },
      },

}