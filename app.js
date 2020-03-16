// Local Packages
let router = require("./src/router")
const config = require("./config.json")

// Init
const SobaniServer = require("./src/sobani-server")
const app = new SobaniServer()

app.use(async (ctx, next) => {
    ctx.income = new Date()
    await next()
})

app.use(async (ctx, next) => {
    console.log(ctx.requestBody)
    await next()
})

app.use(router)

app.use(async (ctx, next) => {
    let reptime = Date.now() - ctx.income
    console.log(`${ctx.remote.address}:${ctx.remote.port} - ${reptime}ms`)
})

// App start
app.listen(config.port)

console.log(`Listening on port ${config.port}...`)
console.log("Awaits for incoming messages...")
