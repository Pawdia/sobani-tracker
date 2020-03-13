// Dependencies
const Koa = require("koa")
const Router = require("koa-router")
const koaBody = require("koa-body")
const compress = require("koa-compress")

// Local Packages
let BaseRoute = require("./src/router")
const config = require("./config.json")

// Init
const app = new Koa()

app.use(async (ctx, next) => {
    ctx.income = new Date()
    await next()
})

// Compress
app.use(compress({
    filter: (content_type) => {
        return /text/i.test(content_type)
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}))

// Bodyparser
app.use(koaBody())
app.proxy = true

// Router
app.use(BaseRoute.base.routes(), BaseRoute.base.allowedMethods())

// Response time
app.use(async (ctx, next) => {
    let reptime = Date.now() - ctx.income
    console.log(`${ctx.method} ${ctx.url} - ${ctx.origin} ${reptime}ms`)
})


// App start
app.listen(config.port)
console.log(`Listening on port ${config.port}...`)
console.log("Awaits for incoming messages...")