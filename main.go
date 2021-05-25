package main

import (
	"github.com/Pawdia/sobani-tracker/config"
	"github.com/Pawdia/sobani-tracker/controllers/peer"
	"github.com/Pawdia/sobani-tracker/handler"
	"github.com/Pawdia/sobani-tracker/logger"
	"github.com/Pawdia/sobani-tracker/server"
	"github.com/Pawdia/sobani-tracker/service"
)

func main() {
	// 加载配置文件
	conf := config.LoadConfig()
	logger.Info("配置文件加载完成")
	service.Init(conf)

	server.Handler = handler.Groups{
		peer.Handlers(),
	}

	server.Init(conf)
}
