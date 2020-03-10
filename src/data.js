const fs = require("fs")
const path = require("path")
const DataStore = require("nedb")

let __dbName = path.resolve("./data/sobani_tracker.db")
let __dataDir = path.parse(__dbName).dir

if (!fs.existsSync(__dataDir)) {
    fs.mkdirSync(__dataDir)
}

let db = new DataStore({ filename: __dbName, autoload: true })

let Data = {
    dbFind(query) {
        return new Promise((resolve, reject) => {
           db.find(query, (err, doc) => {
               if (err) resolve(false)
               if (doc.length == 0) resolve(false)
               resolve(doc)
           })
        })
    },
    
    dbUpdate(query, result) {
        return new Promise((resolve, reject) => {
            db.update(query, result, {}, (err, num, doc) => {
                if (err) resolve(false)
                if (num == 0) resolve(false)
                resolve(doc)
            })
        })
    },
    
    dbInsert(field) {
        return new Promise((resolve, reject) => {
            db.insert(field, (err, doc) => {
                if (err) resolve(false)
                resolve(doc)
            })
        })
    },
    
    dbRemove(field) {
        return new Promise((resolve, reject) => {
            db.remove(field, {multi: true}, (err, num) => {
                if (err) resolve(false)
                resolve(true)
            })
        })
    }
}

module.exports = {
    dbFind: Data.dbFind,
    dbUpdate: Data.dbUpdate,
    dbInsert: Data.dbInsert,
    dbRemove: Data.dbRemove
}