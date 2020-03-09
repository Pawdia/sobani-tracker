// Dependencies
const Koa = require("koa")
const koaBody = require("koa-body")
const compress = require("koa-compress")
const crypto = require("crypto")
const path = require("path")
const DataStore = require("nedb")

// Local
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

let __dbDir = path.resolve("./sobani_tracker.db")

let db = new DataStore({ filename: __dbDir, autoload: true })

// Find
function dbFind(query) {
    return new Promise((resolve, reject) => {
       db.find(query, (err, doc) => {
           if (err) resolve(false)
           if (doc.length == 0) resolve(false)
           resolve(doc)
       })
    })
}

function dbUpdate(query, result) {
    return new Promise((resolve, reject) => {
        db.update(query, result, {}, (err, num, doc) => {
            if (err) resolve(false)
            if (num == 0) resolve(false)
            resolve(doc)
        })
    })
}

function dbInsert(field) {
    return new Promise((resolve, reject) => {
        db.insert(field, (err, doc) => {
            if (err) resolve(false)
            resolve(doc)
        })
    })
}

function dbRemove(field) {
    return new Promise((resolve, reject) => {
        db.remove(field, {multi: true}, (err, num) => {
            if (err) resolve(false)
            resolve(true)
        })
    })
}

function sha256(string) {
    let hash = crypto.createHash('sha256').update(string, "utf8").digest("hex")
    return hash
}

/**
 * Counter
 */
app.use(async (ctx, next) => {
    console.log(ctx.request.body)
    ctx.income = new Date()
    console.log(`${ctx.method} ${ctx.url} - ${ctx.origin}`)

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
    dbFind({ ip: ip, port: port }).then(res => {
        // pull if has
        if(!res) {
            ctx.sessionId = dbInsert({ ip: ip, multiaddr: multiaddr, port: port, shareId: ctx.shareId }).then(res => {
                console.log(`New share id [${ctx.shareId}] successfully generated for new peer!`)
            })
            
        }
        else {
            dbUpdate({ ip: ip, port: port }, { $set: { multiaddr: multiaddr, shareId: ctx.shareId }}).then(res => {
                console.log(`Updating [${ctx.shareId}] for ${ip}:${port} successfully generated for new peer!`)
            })
        }
    })

    let res = {
        shareId: ctx.shareId
    }
    console.log(res)
    ctx.body = res
    
    let reptime = Date.now() - ctx.income
    console.log(`${ctx.method} ${ctx.url} - ${reptime}ms`)
})

app.listen(config.port)
console.log(`Listening on port ${config.port}...`)
console.log("Awaits for incoming messages...")