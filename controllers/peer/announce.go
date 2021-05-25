package peer

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"time"

	"github.com/Pawdia/sobani-tracker/handler"
	"github.com/Pawdia/sobani-tracker/logger"
	"github.com/Pawdia/sobani-tracker/models/peer"
	"github.com/Pawdia/sobani-tracker/util"
)

type announceBody struct {
	ID string `json:"id"`
}

type announceResp struct {
	Action string `json:"action"`
	Data   data   `json:"data"`
}
type data struct {
	ShareID string `json:"shareId"`
}

// ActionAnnounce 公开自己
func ActionAnnounce(c *handler.Context) {
	var body announceBody
	err := json.Unmarshal([]byte(c.Message), &body)
	if err != nil {
		logger.Warnf("%s:%d incoming connection parse errored: %s", c.Remote.IP, c.Remote.Port, err.Error())
	}

	info, err := peer.Get(c.Remote)
	if err != nil {
		logger.Error(err)
		// PASS
	}

	isNew := info == nil
	h := sha256.New()
	h.Write([]byte(fmt.Sprintf("%s%d", body.ID, time.Now().Unix())))
	c.ShareID = util.Substring(fmt.Sprintf("%x", h.Sum(nil)), 8)

	if isNew {
		logger.Info("[announce] New peer connected! Generating ShareID...")
		err = peer.Update(c.Remote, body.ID, c.ShareID, time.Now().Unix())
		if err != nil {
			logger.Error(err)
			return
		}
	} else {
		logger.Info("[announce] Peer connection updated! Generating ShareID...")
		err = peer.Update(c.Remote, body.ID, c.ShareID, time.Now().Unix())
		if err != nil {
			logger.Error(err)
			return
		}
	}
	logger.Infof("[announce] ShareID %s successfully generated for peer %s:%d!", c.ShareID, c.Remote.IP, c.Remote.Port)

	var resp announceResp
	resp.Action = "announce"
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
