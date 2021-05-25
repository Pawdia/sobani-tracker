package peer

import (
	"encoding/json"
	"time"

	"github.com/Pawdia/sobani-tracker/handler"
	"github.com/Pawdia/sobani-tracker/logger"
	"github.com/Pawdia/sobani-tracker/models/peer"
	"github.com/Pawdia/sobani-tracker/util"
)

type announceResp struct {
	Action string `json:"action"`
	Data   data   `json:"data"`
}
type data struct {
	ShareID string `json:"shareId"`
}

// ActionAnnounce 公开自己
func ActionAnnounce(c *handler.Context) {
	info, err := peer.GetByRemote(c.Remote)
	if err != nil {
		logger.Error(err)
		// PASS
	}

	c.ShareID = util.NewShareID(16)
	if info == nil {
		logger.Info("[announce] New peer connected! Generating ShareID...")
		err = peer.Update(c.Remote, c.ShareID, time.Now().Unix())
		if err != nil {
			logger.Error(err)
			return
		}
	} else {
		logger.Info("[announce] Peer connection updated! Generating ShareID...")
		err = peer.Update(c.Remote, c.ShareID, time.Now().Unix())
		if err != nil {
			logger.Error(err)
			return
		}
	}
	logger.Infof("[announce] ShareID %s successfully generated for peer %s:%d!", c.ShareID, c.Remote.IP, c.Remote.Port)

	var resp announceResp
	resp.Action = "announced"
	resp.Data = data{
		ShareID: c.ShareID,
	}
	data, err := json.Marshal(resp)
	if err != nil {
		logger.Error(err)
		return
	}

	c.Instance.WriteToUDP(data, c.Remote)
}
