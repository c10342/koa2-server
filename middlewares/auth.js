
const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const { Forbidden } = require('../core/http-exception')

class Auth {
    constructor(level) {
        // api登记
        this.level = level || 1
        // 用户角色
        Auth.USER = 8
        Auth.ADMIN = 16
        Auth.SUPER_ADMIN = 32
    }

    get m() {
        return async (ctx, next) => {
            const userToken = basicAuth(ctx.req)
            // "userToken": {
            //     "name": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOmZhbHNlLCJzY29wZSI6MiwiaWF0IjoxNTY4MTY2NzA5LCJleHAiOjE3MjM2ODY3MDl9.Y8RUKG5IttliNd4vDnUCbv3GNbzcdmNzV-cjL3tYclE",
            //     "pass": ""
            // }
            // 没有传递令牌
            if (!userToken || !userToken.name) {
                throw new Forbidden('令牌不合法')
            }
            try {
                // 校验令牌,返回的是用户存储在令牌中的信息
                var decode = jwt.verify(userToken.name, global.config.security.secretKey)
            } catch (error) {
                if (error.name == 'TokenExpiredError') {
                    throw new Forbidden('令牌已经过期')
                }
                throw new Forbidden('令牌不合法')
            }
            // 判断用户是否有权限访问该api
            if (decode.scope < this.level) {
                throw new Forbidden('权限不足')
            }
            // 用户id和权限会在很多地方用到，所以直接挂载到ctx中
            ctx.auth = {
                uid: decode.uid,
                scope: decode.scope
            }
            await next()
        }
    }

    static verifyToken(token){
        try {
            jwt.verify(token, global.config.security.secretKey)
            return true
        } catch (error) {
            return false
        }
    }
}

module.exports = {
    Auth
}