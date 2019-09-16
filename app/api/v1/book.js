const Router = require('koa-router')

const router = new Router({
    prefix:'/v1/book'
})

const {PositiveIntegerValidator,SearchValidator,AddShortCommentValidator} = require('../../validators/validator')

const {HotBook} = require('../../models/hot-book')

const {Book} = require('../../models/book')

const {Comment} = require('../../models/book-comment')

const {Auth} = require('../../../middlewares/auth')

router.get('/hot_list',async (ctx)=>{
    const hotList = await HotBook.getAll()
    ctx.body = {
        books:hotList
    }
})

router.get('/:id/detail',async (ctx)=>{
    const v = await new PositiveIntegerValidator().validate(ctx)
    const book = new Book()
    const result = await book.detail(v.get('path.id'))
    ctx.body = result.data
})

router.get('/search',async (ctx)=>{
    const v = await new SearchValidator().validate(ctx)
    const result = await Book.searchFromYuShu(v.get('query.q'),v.get('query.start'),v.get('query.count'))
    ctx.body = result
})

router.get('/favor/count',new Auth().m, async (ctx)=>{
    const count = await Book.getMyFavorBookCount(ctx.auth.uid)
    ctx.body ={
        count
    }
})

router.get('/:book_id/favor',new Auth().m,async (ctx)=>{
    const v = await new PositiveIntegerValidator().validate(ctx,{id:'book_id'})
    const favor = await Book.getBookFavor(ctx.auth.uid,v.get('path.book_id'))

    ctx.body = favor
})

router.post('/add/short_comment',new Auth().m,async (ctx)=>{
    const v= await new AddShortCommentValidator().validate(ctx,{
        id:'book_id'
    })
    const result = await Comment.addComment(v.get('body.book_id'),v.get('body.content'))
    ctx.body = result
})

router.get('/get/short_comment',new Auth().m,async (ctx)=>{
    const result = await Comment.getComment()
    ctx.body = result
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