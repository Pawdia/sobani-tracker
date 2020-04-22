const udp = require("dgram")
const process = require("process")

// creating two client sockets
var client1 = udp.createSocket("udp4")
var client2 = udp.createSocket("udp4")

let client1ShareId = ""
let client2ShareId = ""
let client1ShareIdInPushed = ""
let client2ShareIdInIncome = ""
let pushedReceived = false
let incomeReceived = false
let maxRetry = 5

// Announce Data
var announceData = JSON.stringify({ action: "announce" })

client1.on("message", (msg, remote) => {
    try {
        response = JSON.parse(msg)
        
        if (response.action === "announced") {
            client1ShareId = response.data.shareId
            console.log("[Client 1:announced] ShareId:", client1ShareId)
            
            // delay 500ms and then try to send push event from client 2
            setTimeout(() => {
                // Client 2 requests connection to client 1
                // Sending pushData to tracker to query client 1's info
                var pushData = JSON.stringify({ action: "push", shareId: client1ShareId })
                console.log("[Client 2:push]", pushData)
                
                // Client 2 send push request after client 1 has successfully registered on tracker
                client2.send(pushData, 3000, 'localhost', err => {
                    if (err) {
                        console.log("[Client 2:err]", err)
                    }
                })
            }, 500)
            
        } else if (response.action === "income") {
            console.log("[Client 1:income]", response.data)
            client2ShareIdInIncome = response.data.peerShareId
            incomeReceived = true
        }
    } catch (err) {
        console.log(err)
    }
})

client2.on("message", (msg, remote) => {
    try {
        response = JSON.parse(msg)
        
        if (response.action === "announced") {
            client2ShareId = response.data.shareId
            console.log("[Client 2:announced] ShareId:", client2ShareId)
        } else if (response.action === "pushed") {
            console.log("[Client 2:pushed]", response.data)
            client1ShareIdInPushed = response.data.peerShareId
            pushedReceived = true
        }
    } catch (err) {
        console.log("[Client 2:err]", err)
    }
})

// Announce
client1.send(announceData, 3000, "localhost", err => {
    if (err) {
        console.log(err)
    }
})
client2.send(announceData, 3000, "localhost", err => {
    if (err) {
        console.log(err)
    }
})

setInterval(() => {
    maxRetry--
    if (maxRetry == 0) {
        console.log("[ERROR] Failed to get response in time")
        process.exit(1)
    }
    if (pushedReceived && incomeReceived) {
        if (client1ShareIdInPushed === client1ShareId &&
            client2ShareIdInIncome === client2ShareId) {
            console.log("[OK] Everything works as expected")
            process.exit(0)
        } else {
            if (client1ShareIdInPushed !== client1ShareId) {
                console.log(`[ERROR] Share ID for client 1 is ${client1ShareId}, but client 2 received ${client2ShareIdInIncome}`)
            }
            if (client2ShareIdInIncome !== client2ShareId) {
                console.log(`[ERROR] Share ID for client 2 is ${client2ShareId}, but client 1 received ${client2ShareIdInIncome}`)
            }
            process.exit(2)
        }
    }
}, 500)
