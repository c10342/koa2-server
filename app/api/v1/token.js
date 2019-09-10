const Router = require('koa-router')

const { success } = require('../../lib/helper')

const { TokenValidator, ParameterException } = require('../../validators/validator')

const { User } = require('../../models/user')

const { LoginType } = require('../../lib/enum')


const router = new Router({
    prefix: '/v1/token'
})

router.post('/', async (ctx) => {
    const v = await new TokenValidator().validate(ctx)

    switch (v.get('body.type')) {
        // 邮箱登录
        case LoginType.USER_EMAIL:
            await emailLogin(v.get('body.account'),v.get('body.secret'))
            break;
        case LoginType.USER_MINI_PROGRAM:
            break;
        default:
            throw new ParameterException('没有响应处理函数')

    }
})

// 邮箱登录
async function emailLogin(account, secret) {
    const user = await User.verifyMobilePassword(account, secret)
    console.log('success')
}

module.exports = router