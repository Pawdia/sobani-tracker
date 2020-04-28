const udp = require('dgram')

/**
 * Create a sobani server that tracks all registered peers
 *
 * @method use(handler) - Add user handler to pipeline, hanlders will be called by the sequenece that they were added
 * @method listen(port) - Start UDP listening at given port
 */
class SobaniServer {
    constructor() {
        // pipeline stores all used handlers
        this.pipeline = new Array()
        // UDP server socket
        this.socket = null
    }

    /**
     * Invoke handlers in pipeline by the sequenece that they were added
     *
     * @async
     * @function _foldPipelie
     * @param {Buffer} message - The message.
     * @param {Object} remote  - Remote address information.
     */
    async _foldPipeline(message, remote) {
        // construct context
        let ctx = {
            server: this.socket,
            message: message,
            remote: remote,
            timestamp: Math.floor(new Date() / 1000),
        }
        // try to parse message as JSON object
        try { ctx.requestBody = JSON.parse(ctx.message) } catch (err) { }

        // invoke handlers in pipeline by the sequenece that they were added
        for (var index = 0; index < this.pipeline.length; index++) {
            // get current handler
            let handler = this.pipeline[index]
            // break pipeline if user does not call `next()`
            var breakPipeline = true
            let pipelineBreaker = async () => {
                // - if user does not call `next()`
                //   `breakPipeline` will remain `true`
                // - if `handler` is the last one in pipeline
                //   then even if user calls `next()`
                //   `breakPipeline` will still remain `true`
                if (index + 1 != this.pipeline.length) breakPipeline = false
            }
            // if `handler.emit` is a function, which suggests it is probably `SobaniRouter` or `SobaniRouter` alike object
            // and the message in UDP packet can be successfully parsed
            // also, if `action` field can be found in parsed JSON object
            if (typeof handler.emit === 'function' && ctx.requestBody && ctx.requestBody.action) {
                // call `handler.emit` with `ctx.requestBody.action` as `event` with `ctx` and `pipelineBreaker`
                await handler.emit(ctx.requestBody.action, ctx, pipelineBreaker)
            } else {
                // call `handler` with `ctx` and `pipelineBreaker`
                await handler(ctx, pipelineBreaker)
            }
            // if `breakPipeline` is still `true`
            if (breakPipeline) {
                // then finalize this session 
                await this._finalHandler(ctx, remote)
                break
            }
        }
    }

    /**
     * Finalize current session.
     *
     * @async
     * @function _finalHandler
     * @param {Object} ctx    - Session context.
     * @param {Object} remote - Remote address information.
     */
    async _finalHandler(ctx, remote) {
        // if user has added `body` attribute in `ctx`
        // then `ctx.body` will be used as response to remote client
        if (ctx.body) {
            // if `ctx.body` is not `string` type, then encode it with `JSON.stringify`
            if (typeof ctx.body !== 'string') {
                ctx.body = JSON.stringify(ctx.body)
            }
            // send `ctx.body` to remote client
            this.socket.send(ctx.body, remote.port, remote.address, (err) => {
                if (err) {
                    console.log(`[ERROR] UDP message sent to ${remote.address}:${remote.port}: ${err}`)
                }
            })
        }
    }

    /**
     * Start UDP listening at given port.
     *
     * @function listen
     * @param {number} port - Port for listening.
     */
    listen(port) {
        this.socket = udp.createSocket('udp4')
        this.socket.on('message', (message, remote) => { this._foldPipeline(message, remote) })
        this.socket.bind(port)
    }

    /**
     * Add user handler to pipeline, hanlders will be called by the sequenece that they were added.
     *
     * @function use
     * @param {async function} handler - The object that contains the information of matching.
     */
    use(handler) {
        // add handler to pipeline
        this.pipeline.push(handler)
    }
}

module.exports = SobaniServer
