/**
 * Create a sobani router that process specify event on receiving UDP message
 *
 * @method on(event, handler)     - Saves handler which will be invoked on given `event`
 * @method emit(event, ctx, next) - Emits event to corresponding handler
 */
class SobaniRouter {
    constructor() {
        // stores all `event` - `handler` pair
        this.routerMap = new Map()
    }
    
    /**
     * Saves handler which will be invoked on given `event`
     *
     * @async
     * @function on
     * @param {string} event           - The name of the event.
     * @param {async function} handler - The handler that process the event.
     */
    async on(event, handler) {
        // save `handler` in `routerMap`
        this.routerMap[event] = handler
    }
    
    /**
     * Emits event to corresponding handler
     *
     * @async
     * @function emit
     * @param {string} event        - The name of the event.
     * @param {Object} ctx          - Session context.
     * @param {async function} next - Next handler.
     */
    async emit(event, ctx, next) {
        // get `handler` from `routerMap`
        let handler = this.routerMap[event]
        // if such `handler` exists
        // then invoke `handler` with `ctx` and `next`
        if (handler !== undefined) await handler(ctx, next)
    }
}

module.exports = SobaniRouter
