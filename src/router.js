// Dependencies
const Router = require("./sobani-router")

// Local Packages
const hash = require("./util/hash")
const Data = require("./data")

// Init Router
let base = new Router()

// Base router
// announce
base.on("announce", async (ctx, next) => {
    let body = ctx.requestBody
    let ip = ctx.remote.address
    let port = ctx.remote.port

    ctx.shareId = hash.sha256(`${ip}:${port}${body.username}`).substring(0, 8)
    // check if has
    Data.dbFind({ ip: ip, port: port }).then(res => {
        // pull if has
        if (!res) {
            console.log(`New peer connected! Generating ShareID...`)
            ctx.sessionId = Data.dbInsert({ ip: ip, port: port, shareId: ctx.shareId }).then(res => {
                console.log(`ShareID ${ctx.shareId} successfully generated for peer ${ip}:${port}!`)
            })
        }
        else {
            console.log(`Peer connection updated! Generating ShareID...`)
            Data.dbUpdate({ ip: ip, port: port }, { $set: { shareId: ctx.shareId } }).then(res => {
                console.log(`ShareID ${ctx.shareId} successfully generated for peer ${ip}:${port}!`)
            })
        }
    })

    let announceRes = {
        action:  "announceReceived",
        data: {
            shareId: ctx.shareId
        }
    }

    ctx.body = announceRes

    await next()
})

// pulse
base.on("pulse", async (ctx, next) => {
    
})

// push
base.on("push", async (ctx, next) => {
    let body = ctx.requestBody
    let targetShareId = body.shareId

    // return shareId and set multiaddr into session
    let findResult = await Data.dbFind({ shareId: targetShareId })
    if (findResult) {
        let target = findResult.pop()
        console.log(`Establishing connection from ${ctx.remote.address}:${ctx.remote.port} to ${target.ip}:${target.port}...`)

        let pushRes = {
            action: "pushReceived",
            data: {
                peeraddr: `${target.ip}:${target.port}`
            }
        }

        ctx.body = pushRes
        await next()
    }
})

module.exports = base
