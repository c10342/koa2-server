module.exports = {
    env:'dev',
    database:{
        dbName:'KoaServer',
        port:3306,
        host:'localhost',
        user:'root',
        password:'123',
        dialect:'mysql' // 连接的数据库类型
    },
    security:{
        secretKey:'asdad',
        expiresIn:60*60*60*24*30 //令牌过期时间
    },
    wx:{
        appId:'wxfd42849555bd7a4d',
        appSecret:'819a1a038c8724c5e440753bff141f25',
        loginUrl:'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
    }
}