package handler

import "github.com/Pawdia/sobani-tracker/server"

// CodeSuccess 正常返回值
const CodeSuccess = 0

// Action 行为类型
type Action struct {
	Type    string
	Func    ActionFunc
	Handler Func
}

// Handler 处理控制器
type Handler struct {
	Name string

	SubHandlers []Handler
}

// Func 处理器函数
type Func func(*server.Context)

// ActionFunc 行为对应的处理控制器调用的函数
type ActionFunc func(c *server.Context) (ActionResponse, error)

// ActionResponse 行为的响应结构体
type ActionResponse interface{}

type baseResponse struct {
	Code int            `json:"code"`
	Data ActionResponse `json:"data"`
}

// ErrResponse 错误响应结构体
type ErrResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// NewAction 创建新的行为
func NewAction(actionType string, handler ActionFunc) {
	// a := &Action{Type: actionType, Func: handler}
	// a.Handler = func(c *server.Context) {
	// 	ctx := *c
	// 	r, err := a.Func(&ctx)
	// 	if err != nil {
	// 		server.Handle(c)
	// 	}
	// 	c.JSON(baseResponse{Code: CodeSuccess, Data: r})
	// }
}
