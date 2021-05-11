package logger

import (
	"fmt"
	"os"

	"github.com/withmandala/go-log"
)

// Trace 该级别日志，默认情况下，既不打印到终端也不输出到文件。此时，对程序运行效率几乎不产生影响。
func Trace(v ...interface{}) {
	logger := log.New(os.Stdout).WithDebug()
	logger.Trace(v...)
}

// Tracef 带有字符串模版的 Trace 日志
func Tracef(fotmat string, v ...interface{}) {
	logger := log.New(os.Stdout).WithDebug()
	logger.Tracef(fotmat, v...)
}

// Debug 该级别日志，默认情况下会打印到终端输出，但是不会归档到日志文件。因此，一般用于开发者在程序当前启动窗口上，查看日志流水信息。
func Debug(v ...interface{}) {
	f, err := os.Create("sobani-tracker.log")
	if err != nil {
		fmt.Println(err)
	}
	logger := log.New(f).WithDebug()
	loggerStdout := log.New(os.Stdout).WithDebug()
	logger.Debug(v...)
	loggerStdout.Debug(v...)
}

// Debugf 带有字符串模版的 Debug 日志
func Debugf(format string, v ...interface{}) {
	f, err := os.Create("sobani-tracker.log")
	if err != nil {
		fmt.Println(err)
	}
	logger := log.New(f).WithDebug()
	loggerStdout := log.New(os.Stdout).WithDebug()
	logger.Debugf(format, v...)
	loggerStdout.Debugf(format, v...)
}

// Info 一般这种信息都是一过性的，不会大量反复输出。
func Info(v ...interface{}) {
	f, err := os.Create("sobani-tracker.log")
	if err != nil {
		fmt.Println(err)
	}
	logger := log.New(f)
	loggerStdout := log.New(os.Stdout).WithDebug()
	logger.Info(v...)
	loggerStdout.Info(v...)
}

// Infof 带有字符串模版的 Info 日志
func Infof(format string, v ...interface{}) {
	f, err := os.Create("sobani-tracker.log")
	if err != nil {
		fmt.Println(err)
	}
	logger := log.New(f)
	loggerStdout := log.New(os.Stdout).WithDebug()
	logger.Infof(format, v...)
	loggerStdout.Infof(format, v...)
}

// Warn 程序处理中遇到非法数据或者某种可能的错误。
func Warn(v ...interface{}) {
	f, err := os.Create("sobani-tracker.log")
	if err != nil {
		fmt.Println(err)
	}
	logger := log.New(f)
	loggerStdout := log.New(os.Stdout).WithDebug()
	logger.Warn(v...)
	loggerStdout.Warn(v...)
}

// Warnf 带有字符串模版的 Warn 日志
func Warnf(format string, v ...interface{}) {
	f, err := os.Create("sobani-tracker.log")
	if err != nil {
		fmt.Println(err)
	}
	logger := log.New(f)
	loggerStdout := log.New(os.Stdout).WithDebug()
	logger.Warnf(format, v...)
	loggerStdout.Warnf(format, v...)
}

// Error 该错误发生后程序仍然可以运行，但是极有可能运行在某种非正常的状态下，导致无法完成全部既定的功能。
func Error(v ...interface{}) {
	f, err := os.Create("sobani-tracker.log")
	if err != nil {
		fmt.Println(err)
	}
	logger := log.New(f)
	loggerStdout := log.New(os.Stderr).WithDebug()
	logger.Error(v...)
	loggerStdout.Error(v...)
}

// Errorf 带有字符串模版的 Error 日志
func Errorf(format string, v ...interface{}) {
	f, err := os.Create("sobani-tracker.log")
	if err != nil {
		fmt.Println(err)
	}
	logger := log.New(f)
	loggerStdout := log.New(os.Stderr).WithDebug()
	logger.Errorf(format, v...)
	loggerStdout.Errorf(format, v...)
}

// Fatal 表明程序遇到了致命的错误，必须马上终止运行。
func Fatal(v ...interface{}) {
	f, err := os.Create("sobani-tracker.log")
	if err != nil {
		fmt.Println(err)
	}
	logger := log.New(f)
	loggerStdout := log.New(os.Stderr).WithDebug()
	logger.Fatal(v...)
	loggerStdout.Fatal(v...)
}

// Fatalf 带有字符串模版的 Fatal 日志
func Fatalf(format string, v ...interface{}) {
	f, err := os.Create("sobani-tracker.log")
	if err != nil {
		fmt.Println(err)
	}
	logger := log.New(f)
	loggerStdout := log.New(os.Stderr).WithDebug()
	logger.Fatalf(format, v...)
	loggerStdout.Fatalf(format, v...)
}
