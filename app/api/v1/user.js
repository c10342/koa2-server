const Router = require('koa-router')

const {success} = require('../../lib/helper')

const {RegisterValidator} = require('../../validators/validator')

const {User} = require('../../models/user')

const router = new Router({
    // 注册在该路由下面的路径自动添加'/v1/user'
    prefix:'/v1/user'
})

router.post('/register',async (ctx)=>{
    const v = await new RegisterValidator().validate(ctx)
    const user = {
        email:v.get('body.email'),
        password:v.get('body.password2'),
        nickname:v.get('body.nickname')
    }
    // 保存数据
    await User.create(user)

    success()
})

module.exports = router