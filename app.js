const Koa = require('koa')

const bodyparser = require('koa-bodyparser')

const InitManager = require('./core/init')

const catchError = require('./middlewares/exceptions')

require('./app/models/user')
require('./app/models/classic')
require('./app/models/flow')

const app = new Koa()

app.use(catchError)

app.use(bodyparser())

InitManager.initCore(app)

const port = process.env.PORT || 3000
const host = process.env.HOST || 3000

app.listen(port,()=>{
    console.log(`${host}:${port}`)
})