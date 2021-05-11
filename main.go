package main

import (
	"encoding/binary"
	"fmt"
	"net"
	"os"
	"strconv"
	"time"

	"github.com/Pawdia/sobani-tracker/config"
	"github.com/Pawdia/sobani-tracker/logger"
	"github.com/Pawdia/sobani-tracker/service"
)

func main() {
	// 加载配置文件
	conf := config.LoadConfig()
	logger.Info("配置文件加载完成...")
	service.Init(conf)

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
	logger.Infof("当前服务器运行在 %s ...", addr.String())
	defer conn.Close()
	fmt.Println(conn)
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
	daytime := time.Now().Unix()
	fmt.Println(n, remoteAddr)
	b := make([]byte, 4)
	binary.BigEndian.PutUint32(b, uint32(daytime))
	conn.WriteToUDP(b, remoteAddr)
}
