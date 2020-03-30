// Dependencies
const Router = require("./core/router")

// Local Packages
const hash = require("./util/hash")
const Data = require("./data")

// Init Router
let base = new Router()

// Base router
// announce
base.on("announce", async (ctx, next) => {
    let body = ctx.requestBody
    // body: {"id":"Cocoa","action":"announce"}
    let ip = ctx.remote.address
    let port = ctx.remote.port

    ctx.shareId = hash.sha256(`${ip}:${port}${body.id}`).substring(0, 8)
    // check if has
    Data.dbFind({ ip: ip, port: port }).then(res => {
        // pull if has
        if (!res) {
            console.log(`New peer connected! Generating ShareID...`)
            ctx.sessionId = Data.dbInsert({ 
                ip: ip, 
                port: port, 
                shareId: ctx.shareId, 
                id: body.id,
                lastSeen: ctx.timestamp
             }).then(res => {
                console.log(`ShareID ${ctx.shareId} successfully generated for peer ${ip}:${port}!`)
            })
        }
        else {
            console.log(`Peer connection updated! Generating ShareID...`)
            Data.dbUpdate({ ip: ip, port: port }, { $set: { shareId: ctx.shareId, id: body.id, lastSeen: ctx.timestamp } }).then(res => {
                console.log(`ShareID ${ctx.shareId} successfully generated for peer ${ip}:${port}!`)
            })
        }
    })

    let announceRes = {
        action:  "announced",
        data: {
            shareId: ctx.shareId
        }
    }

    ctx.body = announceRes

    await next()
})

// alive
base.on("alive", async (ctx, next) => {
    let ip = ctx.remote.address
    let port = ctx.remote.port
    
    Data.dbFind({ ip: ip, port: port }).then(res => {
        // reconnection needed
        if (!res) {
            console.log(`Peer [${ip}:${port}] connection expired, please reconnect`)
            let expiredMessage = {
                action: 'expired'
            }
            ctx.body = alivedMessage
        }
        // keep alive
        else {
            let alivedMessage = {
                action: 'alived'
            }
            ctx.body = alivedMessage
            Data.dbUpdate({ ip: ip, port: port }, { $set: { lastSeen: ctx.timestamp } }).then(res => {
            })
        }
    })
})

// push
base.on("push", async (ctx, next) => {
    let body = ctx.requestBody
    let targetShareId = body.shareId

    console.log("on push, targetShareId", targetShareId)
    // return shareId and set multiaddr into session
    let findResult = await Data.dbFind({ shareId: targetShareId })
    if (findResult) {
        let target = findResult.pop()
        console.log(`Establishing connection from ${ctx.remote.address}:${ctx.remote.port} to ${target.ip}:${target.port}...`)

        // Feedback to client whom from this socket
        // send back pushedMessage to peer
        // Pushed -> Server send to A with pushedMessage with B info
        let pushedMessage = {
            action: "pushed",
            data: {
                peeraddr: `${target.ip}:${target.port}`
            }
        }
        ctx.server.send(JSON.stringify(pushedMessage), ctx.remote.port, ctx.remote.address, (err) => {
            if (err) console.log(err)
        })

        // Income -> Sever send to B with incomeMessage with A info
        let incomeMessage = {
            action: 'income', 
            data: {
                peeraddr: `${ctx.remote.address}:${ctx.remote.port}`
            }
        }
        ctx.server.send(JSON.stringify(incomeMessage), target.port, target.ip, (err) => {
            if (err) console.log(err)
        })
        await next()
    }
})

module.exports = base
