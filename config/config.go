package config

import (
	"encoding/json"
	"os"
)

// ServerConfig 服务器的基本配置结构
type ServerConfig struct {
	DataRoot string `json:"data-root"`
	IP       string `json:"ip"`
	Port     int    `json:"port"`
}

// Conf 用于外部访问 ServerConfig
var Conf *ServerConfig

// LoadConfig 载入配置文件
func LoadConfig() error {
	file, err := os.Open("./.conf.json")
	if err != nil {
		return err
	}

	defer file.Close()
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&Conf)
	if err != nil {
		return nil
	}

	return nil
}
