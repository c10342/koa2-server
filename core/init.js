const Router = require('koa-router')

const requireDirectory = require('require-directory')

class InitManager {
    static initCore(app){
        InitManager.app = app
        InitManager.initLoadRouters(app)
        InitManager.initLoadConfig()
    }

    // 自动加载模块,并添加路由
    // 加载app目录下的所有文件导出的模块
    static initLoadRouters() {
        // process.cwd()项目根路径
        const routerPath = `${process.cwd()}/app/api`
        requireDirectory(module, routerPath, {
            visit: whenLoadModule
        })

        function whenLoadModule(obj) {
            if (obj instanceof Router) {
                InitManager.app.use(obj.routes())
            }
        }
    }

    // 加载配置文件
    static initLoadConfig(path){
        path = path || `${process.cwd()}/config/config.js`
        const config = require(path)
        global.config = config
    }
}

module.exports = InitManager