const Router = require('koa-router')

const router = new Router()

router.get('/v1/book/bookList',async (ctx)=>{
    ctx.body = 'hrllo';
})

router.post('/v1/:index/books',async (ctx)=>{
    // const params = ctx.params;
    // const body = ctx.request.body;
    // const headers = ctx.headers
    // const header = ctx.header
    const query = ctx.query
    // console.log('params',params)
    // console.log('body',body)
    // console.log('headers',headers)
    // console.log('header',header);
    console.log('query',query)
    ctx.body = 'hrllo'
})

module.exports = router