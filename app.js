// Dependencies
const Koa = require("koa")
const koaBody = require("koa-body")
const compress = require("koa-compress")
const crypto = require("crypto")

// Local
const Data = require("./src/data")
const config = require("./config.json")

// Init
const app = new Koa()
app.use(compress({
    filter: (content_type) => {
        return /text/i.test(content_type)
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}))
app.use(koaBody())
app.proxy = true

function sha256(string) {
    let hash = crypto.createHash('sha256').update(string, "utf8").digest("hex")
    return hash
}

app.use(async (ctx, next) => {
    ctx.income = new Date()

    await next()
})

app.use(async (ctx, next) => {
    if (ctx.method != "POST") {
        ctx.status = 405
        ctx.body = "Method Not Allowed"
    }

    let body = ctx.request.body
    let ip = body.ip
    let port = body.port
    let multiaddr = body.multiaddr

    ctx.shareId = sha256(multiaddr.split("/").pop())
    // check if has
    Data.dbFind({ ip: ip, port: port }).then(res => {
        // pull if has
        if(!res) {
            console.log(`New peer connected! Generating ShareID...`)
            ctx.sessionId = Data.dbInsert({ ip: ip, multiaddr: multiaddr, port: port, shareId: ctx.shareId }).then(res => {
                console.log(`ShareID ${ctx.shareId} successfully generated for peer!`)
            })
            
        }
        else {
            console.log(`Peer connection updated! Generating ShareID...`)
            Data.dbUpdate({ ip: ip, port: port }, { $set: { multiaddr: multiaddr, shareId: ctx.shareId }}).then(res => {
                console.log(`ShareID ${ctx.shareId} successfully generated for peer!`)
            })
        }
    })
    await next()
})

app.use(async (ctx, next) => {
    let res = {
        shareId: ctx.shareId
    }
    console.log(res)
    ctx.body = res
    
    let reptime = Date.now() - ctx.income
    console.log(`${ctx.method} ${ctx.url} - ${ctx.origin} ${reptime}ms`)
})

app.listen(config.port)
console.log(`Listening on port ${config.port}...`)
console.log("Awaits for incoming messages...")