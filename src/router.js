// Dependencies
const Router = require("koa-router")

// Local Packages
const hash = require("./util/hash")
const Data = require("./data")

// Init Router
let base = new Router()

// Base router
// announce
base.post("/announce", async (ctx, next) => {
    let body = ctx.request.body
    let ip = body.ip
    let port = body.port
    let multiaddr = body.multiaddr

    ctx.shareId = hash.sha256(multiaddr.split("/").pop()).substring(0, 8)
    // check if has
    Data.dbFind({ ip: ip, port: port }).then(res => {
        // pull if has
        if (!res) {
            console.log(`New peer connected! Generating ShareID...`)
            ctx.sessionId = Data.dbInsert({ ip: ip, multiaddr: multiaddr, port: port, shareId: ctx.shareId }).then(res => {
                console.log(`ShareID ${ctx.shareId} successfully generated for peer ${ip}!`)
            })

        }
        else {
            console.log(`Peer connection updated! Generating ShareID...`)
            Data.dbUpdate({ ip: ip, port: port }, { $set: { multiaddr: multiaddr, shareId: ctx.shareId } }).then(res => {
                console.log(`ShareID ${ctx.shareId} successfully generated for peer ${ip}!`)
            })
        }
    })

    let announceRes = {
        shareId: ctx.shareId
    }

    ctx.body = announceRes

    await next()
})

// pulse
base.post("/pulse", async (ctx, next) => {
    
})

// push
base.post("/push", async (ctx, next) => {
    let body = ctx.request.body
    let targetShareId = body.shareId
    let sourceMultiaddr = body.multiaddr

    // return shareId and set multiaddr into session
    let findResult = await Data.dbFind({ shareId: targetShareId })
    let target = findResult.pop()
    console.log(`Establishing connection from ${sourceMultiaddr} to ${target.multiaddr}...`)
        
    let pushRes = {
        multiaddr: target.multiaddr
    }

    ctx.body = pushRes
    await next()
})

module.exports = {
    base
}