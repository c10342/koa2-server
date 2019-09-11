const Router = require('koa-router')

const { Auth } = require('../../../middlewares/auth')

const { Flow } = require('../../models/flow')

const { Art } = require('../../models/art')

const router = new Router({
    prefix: '/v1/classic'
})

router.get('/latest', new Auth().m, async (ctx) => {
    const latest = await Flow.findOne({
        // 排序
        order: [
            // 根据index字段进行排序,DESC倒序
            ['index', 'DESC']
        ]
    })

    const art = await Art.getData(latest.art_id, latest.type)

    // 往art对象里面设置属性
    art.setDataValue('index', latest.index)
    ctx.body = art
})

module.exports = router

