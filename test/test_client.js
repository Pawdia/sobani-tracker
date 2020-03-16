const hash = require("../src/util/hash")
const config = require("../config.json")
const udp = require('dgram')

// creating two client sockets
var client1 = udp.createSocket('udp4')
var client2 = udp.createSocket('udp4')

// Announce Data
var announceData = JSON.stringify({ action: "announce" })

client1.on('message', (msg, remote) => {
    try {
        response = JSON.parse(msg)
        
        if (response.action === "announceReceived") {
            // Push Data
            var pushData = JSON.stringify({ action: "push", shareId: response.data.shareId })
            
            // Client 2 send push request after client 1 has successfully registered on tracker
            client2.send(pushData, config.port, 'localhost', err => {
                if (err) {
                    console.log(err)
                }
            })
        }
    } catch (err) {
        console.log(err)
    }
})

client2.on('message', (msg, remote) => {
    try {
        response = JSON.parse(msg)
        
        if (response.action === "announceReceived") {
            // Push Data
            var pushData = JSON.stringify({ action: "push", shareId: response.data.shareId })
            console.log(pushData)
        } else if (response.action === "pushReceived") {
            console.log(response.data)
        }
    } catch (err) {
        console.log(err)
    }
})

// Announce
client1.send(announceData, config.port, 'localhost', err => {
    if (err) {
        console.log(err)
    }
})
client2.send(announceData, config.port, 'localhost', err => {
    if (err) {
        console.log(err)
    }
})
