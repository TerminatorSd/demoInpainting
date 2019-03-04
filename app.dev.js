
const db = require('./utils/mongo.js')
const path = require('path')
const Koa = require('koa')
const cors = require('koa2-cors');
const Router = require('koa-router')
const glob = require('glob')
const koaWebpack = require('koa-webpack')
const koaStatic = require('koa-static')
const history = require('koa2-history-api-fallback')

const koaBody = require('koa-body');

const {PORT} = require('./config/server')
const {getRouterPath, log} = require('./utils/framework')
// const webpackConfig = require('./vue/webpack.config.js')

const app = new Koa()
const router = new Router()

process.env.NODE_ENV = 'development'

registerApp()

async function registerApp () {
  app.use(async (ctx, next) => {
    log.info(ctx.url)
    await next()
  })

  try {
    // node 端中间件和路由
    await registerMiddlewares();
    await registerRoutes();

    // 进行requestbody解析，要放在routes 前面
    app.use(koaBody({
      jsonLimit: '10mb',
      formLimit: '10mb',
      textLimit: '10mb',
      multipart:true, // 支持文件上传
      // encoding:'gzip',
      formidable: {
        uploadDir: path.join(__dirname, 'upload/'), // 设置文件上传目录
        keepExtensions: true,    // 保持文件的后缀
        maxFieldsSize: 20 * 1024 * 1024, // 文件上传大小
        onFileBegin:(name, file) => { // 文件上传前的设置
          console.log(`name: ${name}`);
          console.log(file);
        },
      }
    }));

    // 解决跨域问题
    app.use(cors());

    // 路由
    app.use(router.routes());
    app.use(router.allowedMethods());

    // app.use(bodyParse.json({limit: '10mb'}));
    // app.use(bodyParse.urlencoded({limit: '10mb', extended: true}));

    // 前端(vue)路由
    // 所有 navigate 请求重定向到 '/'，因为 webpack-dev-server 只服务这个路由
    app.use(history({
        htmlAcceptHeaders: ['text/html'],
        index: '/',
        verbose: true
    }));
    app.use(koaStatic('public'));
    // await registerWebpack();

    app.listen(PORT);

    log.info('开发环境服务器启动于端口号', PORT, '等待 webpack 编译中，请稍候。\n\n');
  } catch (e) {
    log.error(e)
    log.error('开发环境服务器启动失败\n\n')
  }
}

async function registerRoutes () {
  return new Promise((resolve, reject) => {
    glob('actions/**/*.js', (err, files) => {
      if (err) {
        log.error('读取 actions 失败')
        log.error(err)
        reject()
        return
      }

      files.forEach(actionPath => {
        let action = require(`./${actionPath}`)
        action.forEach(item => {
          if (typeof item.handler !== 'function') {
            log.warn(actionPath, '不是一个合法的 action，已经跳过')
            return
          }
          if (!item.routerPath) {
            log.warn(item.routerPath, '不是一个合法的 routerPath，已经跳过')
            return
          }
          if(item.method == 'get') {
            router.get(item.routerPath, item.handler)
          } else {
            router.post(item.routerPath, item.handler)
          }
        })
      })
      
      resolve()
    })
  })
}

async function registerMiddlewares () {
  return new Promise((resolve, reject) => {
    glob('middlewares/**/*.js', (err, files) => {
      if (err) {
        log.error('读取 middlewares 失败')
        log.error(err)
        reject()
        return
      }

      files.forEach(middlewarePath => {
        let middleware = require(`./${middlewarePath}`)
        if (typeof middleware !== 'function') {
          return
        }

        router.use(middleware)
      })

      resolve()
    })
  })
}

// async function registerWebpack() {
//   return new Promise(resolve => {
//     koaWebpack({
//       config: webpackConfig,
//       devMiddleware: {
//         stats: 'minimal'
//       }
//     }).then(middleware => {
//       app.use(middleware)
//       resolve()
//     })
//   })
// }