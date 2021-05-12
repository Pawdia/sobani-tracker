package server

import (
	"fmt"
	"net"
	"os"
	"strconv"

	"github.com/Pawdia/sobani-tracker/config"
	"github.com/Pawdia/sobani-tracker/logger"
)

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
		fmt.Println("failed to read UDP msg because of ", err.Error())
		return
	}

	fmt.Println(n, remoteAddr)
	fmt.Println(string(data[:n]))
	conn.WriteToUDP([]byte("hello, world!"), remoteAddr)
}
