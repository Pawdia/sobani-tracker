package peer

import (
	"encoding/json"
	"fmt"
	"net"

	"github.com/Pawdia/sobani-tracker/logger"
	"github.com/Pawdia/sobani-tracker/server"
	"github.com/Pawdia/sobani-tracker/service"
)

// Info 用户信息
type Info struct {
	IP      string `json:"ip"`
	Port    int    `json:"port"`
	ID      string `json:"id"`
	LasSeen int64  `json:"last_seen"`
	ShareID string `json:"share_id"`
}

// Update 更新信息
func Update(remote *net.UDPAddr, id, shareID string, lastseen int64) error {
	i := Info{
		IP:      remote.IP.String(),
		Port:    remote.Port,
		ID:      id,
		LasSeen: lastseen,
		ShareID: shareID,
	}
	data, err := json.Marshal(i)
	if err != nil {
		return err
	}
	logger.Info(string(data))
	logger.Info(fmt.Sprintf("%v", remote))

	err = service.NutsDB.Set(server.Bucket, []byte(fmt.Sprintf("%v", remote)), data, 0)
	if err != nil {
		return err
	}

	return nil
}

// Get 获取数据
func Get(remote *net.UDPAddr) (*Info, error) {
	data, err := service.NutsDB.Get(server.Bucket, []byte(fmt.Sprintf("%s:%d", remote.IP.String(), remote.Port)))
	if err != nil {
		return nil, err
	}
	if len(data) == 0 {
		return nil, err
	}

	logger.Info(data)
	var info Info
	err = json.Unmarshal(data, &info)
	if err != nil {
		return nil, err
	}

	return &info, nil
}
