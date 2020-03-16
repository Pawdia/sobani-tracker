function SobaniRouter() {
    this.routerMap = {}
    
    this.on = async (event, func) => {
        this.routerMap[event] = func
    }
    
    this.emit = async (event, ctx, next) => {
        handler = this.routerMap[event]
        if (handler !== undefined) await handler(ctx, next)
    }
}

module.exports = SobaniRouter
