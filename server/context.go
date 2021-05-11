package server

// Context 上下文
type Context struct {
	Status     string `json:"status"`
	StatusCode int    `json:"status_code"`

	Writer func()
	Reader func()

	Message []byte
	Request Message

	Error error `json:"error"`
	Keys  map[string]interface{}
}

// Message 属于 Context 的 Message 结构体
type Message struct {
	Action string `json:"action"`
}

// MessageData 属于 Message 的 数据包 结构体
type MessageData struct {
	ShareID     string `json:"shareId"`
	PeerAddr    string `json:"peeraddr"`
	PeerShareID string `json:"peerShareId"`
}

// JSON render JSON
func (c *Context) JSON(obj interface{}) {
}
