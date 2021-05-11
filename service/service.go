package service

import (
	"github.com/Pawdia/sobani-tracker/config"
	"github.com/Pawdia/sobani-tracker/service/database"
)

// service
var (
	NutsDB *database.NutsDB
)

// Init 初始化服务
func Init(conf config.ServerConfig) {
	NutsDB = database.InitNutsDB(conf)
}
