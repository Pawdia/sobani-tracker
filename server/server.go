package server

import (
	"encoding/json"
	"fmt"
	"net"
	"os"
	"strconv"
	"time"

	"github.com/Pawdia/sobani-tracker/config"
	"github.com/Pawdia/sobani-tracker/handler"
	"github.com/Pawdia/sobani-tracker/logger"
)

// Bucket 集合
const Bucket = "peers"

// Handler 处理
var Handler handler.Groups

// Init 初始化 Sobani Tracker 服务器
func Init(conf config.ServerConfig) {
	addr, err := net.ResolveUDPAddr("udp", net.JoinHostPort(conf.IP, strconv.Itoa(conf.Port)))
	if err != nil {
		fmt.Println("Can't resolve address: ", err)
		os.Exit(1)
	}
	conn, err := net.ListenUDP("udp", addr)
	if err != nil {
		fmt.Println("Error listening:", err)
		os.Exit(1)
	}
	logger.Infof("当前服务器运行在 %s", addr.String())
	defer conn.Close()
	for {
		handleClient(conn)
	}
}

func handleClient(conn *net.UDPConn) {
	data := make([]byte, 1024)
	n, remoteAddr, err := conn.ReadFromUDP(data)
	if err != nil {
		logger.Warnf("failed to read UDP msg because of ", err.Error())
		return
	}

	c := new(handler.Context)
	c.Instance = conn
	c.Remote = remoteAddr
	c.Message = string(data[:n])
	c.Timestamp = time.Now().Unix()

	var req handler.Request
	err = json.Unmarshal(data[:n], &req)
	if err != nil {
		logger.Warnf("failed to parse UDP msg because of ", err.Error())
		return
	}

	for i := range Handler {
		item := Handler[i]
		if h, ok := item.Handlers[req.Action]; ok {
			c.Handler = h
			h(c)
		}
	}
}
