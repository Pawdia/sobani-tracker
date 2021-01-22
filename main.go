package main

import (
	"github.com/Pawdia/sobani-tracker/config"
	"github.com/Pawdia/sobani-tracker/service"
)

func main() {
	// 加载配置文件
	config.LoadConfig()
	service.Init()

}
