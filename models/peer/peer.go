package peer

import (
	"encoding/json"
	"errors"
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
	LasSeen int64  `json:"last_seen"`
	ShareID string `json:"share_id"`
}

// RemoteKey 获取基于 remote 信息创建的 key
func RemoteKey(remote *net.UDPAddr) []byte {
	return []byte(fmt.Sprintf("%s_%d", remote.IP, remote.Port))
}

// ShareIDKey 获取基于 share id 信息创建的 key
func ShareIDKey(shareID string) []byte {
	return []byte(fmt.Sprintf("%s", shareID))
}

// Update 更新信息
func Update(remote *net.UDPAddr, shareID string, lastseen int64) error {
	if remote == nil && shareID == "" {
		return errors.New("unable to update with nil remote and empty share id")
	}
	i := Info{
		IP:      remote.IP.String(),
		Port:    remote.Port,
		LasSeen: lastseen,
	}

	if remote != nil && shareID == "" {
		info, err := GetByRemote(remote)
		if err != nil {
			return err
		}
		i.ShareID = info.ShareID
	} else if remote == nil && shareID != "" {
		info, err := GetByShareID(shareID)
		if err != nil {
			return err
		}
		i.ShareID = info.ShareID
	}

	data, err := json.Marshal(i)
	if err != nil {
		return err
	}

	remoteKey := RemoteKey(remote)
	err = service.NutsDB.Set(server.Bucket, remoteKey, data, 0)
	if err != nil {
		return err
	}
	shareIDKey := ShareIDKey(shareID)
	err = service.NutsDB.Set(server.Bucket, shareIDKey, data, 0)
	if err != nil {
		return err
	}

	return nil
}

// Get 获取值
func Get(key []byte) (*Info, error) {
	data, err := service.NutsDB.Get(server.Bucket, key)
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

// GetByRemote 根据远程信息获取值
func GetByRemote(remote *net.UDPAddr) (*Info, error) {
	return Get(RemoteKey(remote))
}

// GetByShareID 根据分享 ID 获取值
func GetByShareID(shareID string) (*Info, error) {
	return Get(ShareIDKey(shareID))
}
