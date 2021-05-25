package util

import (
	"crypto/sha256"
	"fmt"
	"math/rand"
	"time"
	"unicode/utf8"
)

// Substring 截取字符串
func Substring(s string, length int) string {
	var size int
	for i, r := range s {
		size += (utf8.RuneLen(r) + 1) / 2
		if size > length {
			return s[0:i]
		}
	}
	return s
}

// NewShareID 新建 share id
func NewShareID(length int) string {
	h := sha256.New()

	source := rand.NewSource(time.Now().UnixNano())
	random := rand.New(source)

	h.Write([]byte(fmt.Sprintf("%d%d", random.Intn(1000), time.Now().UnixNano())))
	return Substring(fmt.Sprintf("%x", h.Sum(nil)), length)
}
