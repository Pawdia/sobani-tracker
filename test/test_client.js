const hash = require("../src/util/hash")
const axios = require("axios")
const config = require("../config.json")

// Announce
let test1Multiaddr = "ip4/123.112.121.221/tcp/4000/p2p/" + hash.sha256("test1")
let test2Multiaddr = "ip4/123.112.121.222/tcp/4001/p2p/" + hash.sha256("test2")

Promise.all([
    axios.post("http://127.0.0.1:" + config.port + "/announce", 
    { 
        multiaddr: test1Multiaddr, 
        ip: "123.112.121.221", 
        port: "4000"
    }
    ),
    axios.post("http://127.0.0.1:" + config.port + "/announce",
    {
        multiaddr: test2Multiaddr,
        ip: "123.112.121.222",
        port: "4001"
    }
)
]).then(total => {
    // returns two shareId
    let test1ShareId = total[0].data.shareId
    let test2ShareId = total[1].data.shareId

    // Push
    axios.post("http://127.0.0.1:" + config.port + "/push", 
    {
        shareId: test1ShareId,
        multiaddr: test2Multiaddr
    }
    ).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}).catch(err => {
    console.log(err)
})