package peer

import (
	"encoding/json"

	"github.com/Pawdia/sobani-tracker/handler"
	"github.com/Pawdia/sobani-tracker/logger"
	"github.com/Pawdia/sobani-tracker/models/peer"
)

type pushBody struct {
	ShareID string `json:"shareId"`
}

type pushContext struct {
	c    *handler.Context
	body pushBody
	resp pushResp
	data []byte
}

type pushResp struct {
	Action string   `json:"action"`
	Data   pushData `json:"data,omitempty"`
}

type pushData struct {
	PeerAddr    string `json:"peeraddr"`
	PeerShareID string `json:"peerShareId"`
}

// ActionPush 推送请求
func ActionPush(c *handler.Context) {
	var push pushContext
	err := push.load(c)
	if err != nil {
		logger.Warnf("%s:%d incoming connection parse errored: %s", push.c.Remote.IP, push.c.Remote.Port, err.Error())
		return
	}

	info, err := peer.GetByRemote(push.c.Remote)
	if err != nil {
		logger.Error(err)
		// PASS
	}

	if info == nil {
		push.expire()
	} else {

	}

	c.Instance.WriteToUDP(push.data, c.Remote)
}

func (push *pushContext) load(c *handler.Context) error {
	push.c = c
	var body pushBody
	err := json.Unmarshal([]byte(push.c.Message), &body)
	if err != nil {
		return err
	}
	push.body = body
	return nil
}

func (push *pushContext) expire() {
	push.resp.Action = "expire"

	data, err := json.Marshal(push.resp)
	if err != nil {
		logger.Error(err)
		return
	}
	push.data = data
}

func (push *pushContext) pushed() {
	push.resp.Action = "expire"
}
