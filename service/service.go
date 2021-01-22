package service

import (
	"github.com/Pawdia/sobani-tracker/service/database"
)

var (
	// Kvdb 静态数据库 NutsDB 实例
	Kvdb *database.Kvdb
)

// Init 初始化服务组件
func Init() {
	Kvdb = database.InitDatabase()
}
