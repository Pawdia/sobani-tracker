package config

import (
	"io/ioutil"
	"path/filepath"

	"github.com/Pawdia/sobani-tracker/logger"
	"gopkg.in/yaml.v2"
)

// ServerConfig 服务器的基本配置结构
type ServerConfig struct {
	AppName  string `yaml:"app-name"`
	DataRoot string `yaml:"data-root"`
	IP       string `yaml:"ip"`
	Port     int    `yaml:"port"`
	NutsDB   NutsDB `yaml:"nutsdb"`
}

// Conf 用于外部访问 ServerConfig
var Conf *ServerConfig

// NutsDB 配置
type NutsDB struct {
	Dir string `yaml:"path"`
}

// LoadConfig 载入配置文件
func LoadConfig() ServerConfig {
	fileName, _ := filepath.Abs("./conf.yaml")
	yamlFile, err := ioutil.ReadFile(fileName)
	if err != nil {
		logger.Fatal(err)
	}

	conf := new(ServerConfig)
	err = yaml.Unmarshal(yamlFile, conf)
	if err != nil {
		return ServerConfig{}
	}
	return *conf
}
