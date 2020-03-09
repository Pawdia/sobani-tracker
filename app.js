// Dependencies
const Koa = require("koa")
const bodyparser = require("koa-bodyparser")
const path = require("path")
const DataStore = require("nedb")

// Init
const app = new Koa()
app.use(bodyparser())
app.proxy = true

let __dbDir = path.resolve("./sobani_tracker.db")

let db = new DataStore({ filename: __dbDir, autoload: true })

function dbFind(query) {
    return new Promise((resolve, reject) => {
        
    })
}

/**
 * Counter
 */
app.use(async (ctx, next) => {
    let income = new Date()
    console.log(`${ctx.method} received ${ctx.request.body}`)
    await next()

    let reptime = Date.now() - income
    console.log(`${ctx.method} ${ctx.url} - ${reptime}ms`)
})

/**
 * X-Forward IP may not be accurate
 * Accept only get method
 */
app.use(async (ctx, next) => {
    // check if has
    
    // pull if has

    // push in if nothing and return none
})

app.listen(8000)