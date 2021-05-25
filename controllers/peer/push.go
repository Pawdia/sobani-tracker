package peer

import (
	"encoding/json"
	"fmt"
	"net"

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
	data []byte

	srcResp pushResp
	dstResp pushResp

	srcClientInfo *peer.Info
	dstClientInfo *peer.Info
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
		logger.Warnf("%s:%d incoming connection parse errored: %s", c.Remote.IP, c.Remote.Port, err.Error())
		return
	}

	push.srcClientInfo, err = peer.GetByRemote(c.Remote)
	if err != nil {
		logger.Error(err)
		return
	}
	if push.srcClientInfo == nil {
		push.expire()
		_, err = c.Instance.WriteToUDP(push.data, c.Remote)
		if err != nil {
			logger.Error(err)
			// PASS
		}
		return
	}

	push.dstClientInfo, err = peer.GetByShareID(push.body.ShareID)
	if err != nil {
		logger.Error(err)
		return
	}
	if push.dstClientInfo != nil {
		push.sendToSourceClient()
		logger.Infof("[pushed] from %s:%d to %s:%d with shareID: %s", push.srcClientInfo.IP, push.srcClientInfo.Port, push.dstClientInfo.IP, push.dstClientInfo.Port, push.body.ShareID)
		_, err = c.Instance.WriteToUDP(push.data, &net.UDPAddr{IP: net.ParseIP(push.srcClientInfo.IP), Port: push.srcClientInfo.Port})
		if err != nil {
			logger.Error(err)
			// PASS
		}

		push.sendToDestinationClient()
		logger.Infof("[income] from %s:%d to %s:%d with shareID: %s", push.srcClientInfo.IP, push.srcClientInfo.Port, push.dstClientInfo.IP, push.dstClientInfo.Port, push.body.ShareID)
		_, err = c.Instance.WriteToUDP(push.data, &net.UDPAddr{IP: net.ParseIP(push.dstClientInfo.IP), Port: push.dstClientInfo.Port})
		if err != nil {
			logger.Error(err)
			// PASS
		}

	}
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
	push.srcResp.Action = "expire"

	data, err := json.Marshal(push.srcResp)
	if err != nil {
		logger.Error(err)
		return
	}
	push.data = data
}

func (push *pushContext) sendToSourceClient() {
	resp := pushResp{
		Action: "pushed",
		Data: pushData{
			PeerAddr:    fmt.Sprintf("%s:%d", push.dstClientInfo.IP, push.dstClientInfo.Port),
			PeerShareID: push.dstClientInfo.ShareID,
		},
	}
	push.srcResp = resp

	data, err := json.Marshal(push.srcResp)
	if err != nil {
		logger.Error(err)
		return
	}
	push.data = data
}

func (push *pushContext) sendToDestinationClient() {
	resp := pushResp{
		Action: "income",
		Data: pushData{
			PeerAddr:    fmt.Sprintf("%s:%d", push.srcClientInfo.IP, push.srcClientInfo.Port),
			PeerShareID: push.srcClientInfo.ShareID,
		},
	}
	push.dstResp = resp

	data, err := json.Marshal(push.dstResp)
	if err != nil {
		logger.Error(err)
		return
	}
	push.data = data
}
