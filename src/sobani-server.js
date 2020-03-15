const udp = require('dgram')

function SobaniServer() {
    this.pipeline = []
    
    this.use = (func) => { this.pipeline.push(func) }
    
    this._foldPipeline = async (message, remote) => {
        let ctx = { message: message, remote: remote };
        try { ctx.requestBody = JSON.parse(ctx.message) } catch {}
        
        finalHandler = async () => {
            console.log(ctx.body)
            if (ctx.body) {
                if (typeof ctx.body !== 'string') ctx.body = JSON.stringify(ctx.body)
                this.socket.send(ctx.body, remote.port, remote.address, (err) => {
                    if (err) console.log(`[ERROR] UDP message sent to ${remote.address}:${remote.port}: ${err}`);;
                })
            }
        }
        
        for (var index = 0; index < this.pipeline.length; index++) {
            handler = this.pipeline[index]
            breakPipeline = true
            pipelineBreaker = async () => { if (index + 1 != this.pipeline.length) breakPipeline = false }
            if (typeof handler.emit === 'function' && ctx.requestBody && ctx.requestBody.action) {
                await handler.emit(ctx.requestBody.action, ctx, pipelineBreaker)
            } else {
                await handler(ctx, pipelineBreaker)
            }
            if (breakPipeline) { await finalHandler(); break }
        }
    }
    
    this.listen = (port) => {
        this.socket = udp.createSocket('udp4')
        this.socket.on('message', this._foldPipeline)
        this.socket.bind(port);
    }
}

module.exports = SobaniServer
