const axios = require("axios")

axios.post("https://cf28155b.ngrok.io", 
    { 
        multiaddr: "asuahdiauhdqiuwnduqwdiqu", 
        ip: "123.112.121.111", 
        port: "4000"
    })
    .then(res => {
    console.log(res)
})