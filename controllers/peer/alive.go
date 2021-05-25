package peer

import (
	"encoding/json"
	"time"

	"github.com/Pawdia/sobani-tracker/handler"
	"github.com/Pawdia/sobani-tracker/logger"
	"github.com/Pawdia/sobani-tracker/models/peer"
)

type aliveResp struct {
	Action string `json:"action"`
}

// ActionAlive 维持状态
func ActionAlive(c *handler.Context) {
	info, err := peer.GetByRemote(c.Remote)
	if err != nil {
		logger.Error(err)
		// PASS
	}

	var resp aliveResp
	if info == nil {
		resp.Action = "expired"
	} else {
		err = peer.Update(c.Remote, "", time.Now().Unix())
		if err != nil {
			logger.Error(err)
			return
		}
		resp.Action = "alived"
	}

	data, err := json.Marshal(resp)
	if err != nil {
		logger.Error(err)
		return
	}

	c.Instance.WriteToUDP(data, c.Remote)
}
