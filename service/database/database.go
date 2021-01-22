package database

import (
	"log"

	"github.com/Pawdia/sobani-tracker/config"
	"github.com/xujiajun/nutsdb"
)

// Kvdb 静态数据库 NutsDB 实例
type Kvdb struct {
	db *nutsdb.DB
}

// InitDatabase 初始化静态数据库 nutsdb 组件
func InitDatabase() *Kvdb {
	opt := nutsdb.DefaultOptions
	opt.Dir = config.Conf.DataRoot
	db, err := nutsdb.Open(opt)

	kv := &Kvdb{
		db: db,
	}

	if err != nil {
		log.Fatal(err)
	}

	return kv
}

// Update 增加与修改数据
func (kvdb *Kvdb) Update(bucket string, key string, val string) error {
	err := kvdb.db.Update(
		func(tx *nutsdb.Tx) error {
			keyParsed := []byte(key)
			valParsed := []byte(val)
			if err := tx.Put(bucket, keyParsed, valParsed, 0); err != nil {
				return err
			}
			return nil
		},
	)
	if err != nil {
		log.Fatal(err)
	}
	return nil
}

// View 查找数据
func (kvdb *Kvdb) View(bucket string, key string) (val string, err error) {
	err = kvdb.db.View(
		func(tx *nutsdb.Tx) error {
			keyParsed := []byte(key)
			e, err := tx.Get(bucket, keyParsed)
			if err == nil {
				val = string(e.Value)
			} else {
				return err
			}
			return nil
		},
	)
	if err != nil {
		log.Println(err)
	}
	return val, nil
}
