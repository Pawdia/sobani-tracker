package handler

import "net"

// 变量
var (
	DispatchHandlers Groups
)

// Handler 处理器
type Handler map[string]BaseHandler

// BaseHandler 基本处理器
type BaseHandler func(c *Context)

// Handlers 处理对象
type Handlers struct {
	Handlers Handler
}

// Groups 处理组
type Groups []Handlers

// Context 上下文
type Context struct {
	Handler  BaseHandler  `json:"-"`
	Instance *net.UDPConn `json:"-"`

	Message   string `json:"message"`
	Timestamp int64  `json:"timestamp"`

	Body    interface{}  `json:"-"`
	Remote  *net.UDPAddr `json:"-"`
	ShareID string       `json:"-"`
}

// Request 请求
type Request struct {
	Action string `json:"action"`
}

// RemoteAddr 远程
type RemoteAddr struct {
	Address string `json:"-"`
	Port    int    `json:"-"`
}

// Handler 命令处理
func (h *Handlers) Handler() Handler {
	return h.Handlers
}

// Dispatch 分发
func Dispatch(c interface{}) {
}
