const config = require("../config.json")
let router = require("../src/router")
const SobaniServer = require("../src/sobani-server")
const app = new SobaniServer()

app.use(router)
app.listen(config.port)
