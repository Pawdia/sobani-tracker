package peer

import "github.com/Pawdia/sobani-tracker/handler"

func announceHandlers() handler.Handler {
	handlers := handler.Handler{
		"announce": ActionAnnounce,
		"push":     ActionPush,
		"alive":    ActionAlive,
	}
	return handlers
}

// Handlers 处理函数
func Handlers() handler.Handlers {
	handlers := handler.Handlers{
		Handlers: announceHandlers(),
	}

	return handlers
}
