const Router = require('koa-router')

const { generateToken } = require('../../../core/util')

const { TokenValidator, ParameterException,NotEmptyValidator } = require('../../validators/validator')

const { User } = require('../../models/user')

const { LoginType } = require('../../lib/enum')

const { Auth } = require('../../../middlewares/auth')

const { WXManager } = require('../../services/wx')


const router = new Router({
    prefix: '/v1/token'
})


// 获取token
router.post('/', async (ctx) => {
    const v = await new TokenValidator().validate(ctx)
    const account = v.get('body.account');
    const secret = v.get('body.secret');
    let token;
    switch (v.get('body.type')) {
        // 邮箱登录
        case LoginType.USER_EMAIL:
            token = await emailLogin(account, secret)
            break;
        case LoginType.USER_MINI_PROGRAM: //小程序登录
            token = await WXManager.codeToToken(account)
            break;
        default:
            throw new ParameterException('没有响应处理函数')

    }
    ctx.body = {token}
})

// 校验token
router.post('/verify',async (ctx)=>{
    const v = await new NotEmptyValidator().validate(ctx)

    const result = Auth.verifyToken(v.get('body.token'))

    ctx.body = {result}
})

// 邮箱登录
async function emailLogin(account, secret) {
    // 查询用户
    const user = await User.verifyMobilePassword(account, secret)
    // 生成token
    const token = generateToken(user.id, Auth.USER)
    return token
}

module.exports = router