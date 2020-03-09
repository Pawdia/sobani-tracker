const Koa = require("koa")
const bodyParser = require("koa-bodyparser")

const app = new Koa()
app.proxy = true
app.use(bodyParser())
app.use(async (ctx, next) => {
    console.log(ctx.request.body)
})
app.listen(5000)