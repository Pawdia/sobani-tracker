package server

// Context 上下文
type Context struct {
	Status     string `json:"status"`
	StatusCode int    `json:"status_code"`

	Writer func()
	Reader func()

	Error error `json:"error"`
	Keys  map[string]interface{}
}

// JSON render JSON
func (c *Context) JSON(obj interface{}) {
}
