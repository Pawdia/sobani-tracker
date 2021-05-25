package util

import "unicode/utf8"

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
