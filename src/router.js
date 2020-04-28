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
            console.log(`[announce] New peer connected! Generating ShareID...`)
            Data.dbInsert({ 
                ip: ip, 
                port: port, 
                shareId: ctx.shareId, 
                id: body.id,
                lastSeen: ctx.timestamp
             }).then(res => {
                console.log(`[announce] ShareID ${ctx.shareId} successfully generated for peer ${ip}:${port}!`)
            })
        }
        else {
            console.log(`[announce] Peer connection updated! Generating ShareID...`)
            Data.dbUpdate({ ip: ip, port: port }, { $set: { shareId: ctx.shareId, id: body.id, lastSeen: ctx.timestamp } }).then(res => {
                console.log(`[announce] ShareID ${ctx.shareId} successfully generated for peer ${ip}:${port}!`)
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
    
    let res = await Data.dbFind({ ip: ip, port: port })
    // reconnection needed
    if (!res) {
        console.log(`Peer [${ip}:${port}] connection expired, please reconnect`)
        let expiredMessage = {
            action: 'expired'
        }
        ctx.body = expiredMessage
        console.log(ctx.body)
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

// push
base.on("push", async (ctx, next) => {
    console.log(`[push] from ${ctx.remote.address}:${ctx.remote.port}`)
    let requestor = await Data.dbFind({ ip: ctx.remote.address, port: ctx.remote.port })
    // requestor expired / not announced yet
    if (!requestor) {
        console.log(`Peer [${ctx.remote.address}:${ctx.remote.port}] connection expired, please reconnect`)
        let expiredMessage = {
            action: 'expired'
        }
        ctx.body = expiredMessage
    }
    // requestor exists
    else {
        requestor = requestor.pop()
        let body = ctx.requestBody
        let requesteeId = body.shareId
        
        let findResult = await Data.dbFind({ shareId: requesteeId })
        if (findResult) {
            let requestee = findResult.pop()
            console.log(`[push] Establishing connection from ${requestor.ip}:${requestor.port} to ${requestee.ip}:${requestee.port}...`)

            // Feedback to requestor
            // send back pushedMessage to peer
            // Pushed -> Server send to requestor with pushedMessage with requestee's info
            let pushedMessage = {
                action: "pushed",
                data: {
                    peeraddr: `${requestee.ip}:${requestee.port}`,
                    peerShareId: requestee.shareId
                }
            }
            ctx.server.send(JSON.stringify(pushedMessage), ctx.remote.port, ctx.remote.address, (err) => {
                if (err) console.log(err)
            })
            console.log(`[pushed] to ${ctx.remote.address}:${ctx.remote.port}`)

            // Income -> Sever send to B with incomeMessage with A info
            let incomeMessage = {
                action: 'income', 
                data: {
                    peeraddr: `${requestor.ip}:${requestor.port}`,
                    peerShareId: requestor.shareId
                }
            }
            ctx.server.send(JSON.stringify(incomeMessage), requestee.port, requestee.ip, (err) => {
                if (err) console.log(err)
            })
            console.log(`[income] to ${requestee.ip}:${requestee.port}`)
            await next()
        }
    }
})

module.exports = base
