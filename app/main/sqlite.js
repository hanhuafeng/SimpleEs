// import sqlite3 from 'sqlite3'
const sqlite3 = require('sqlite3');
const sqlite = sqlite3.verbose();
class Sqlite {
    static sqlInstance = null
    constructor () {
        this.db = null;
    }

    // 连接数据库
    connect (path) {
        return new Promise((resolve, reject) => {
            try{
                this.db = new sqlite.Database(path, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(1);
                    }
                });
            }catch (err){
                reject(err);
            }
        });
    }

    // 运行sql
    run (sql, params) {
        return new Promise((resolve, reject) => {
            try {
                this.db.run(sql, params, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(1);
                    }
                });
            }catch (err){
                reject(err);
            }
        });
    }

    // 运行多条sql
    exec (sql) {
        return new Promise((resolve, reject) => {
            try{
                this.db.exec(sql, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(1);
                    }
                });
            }catch (err){
                reject(err);
            }
        });
    }

    // 查询一条数据
    get (sql, params) {
        return new Promise((resolve, reject) => {
            try{
                this.db.get(sql, params, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            }catch (err){
                reject(err);
            }

        });
    }

    // 查询所有数据
    all (sql, params) {
        return new Promise((resolve, reject) => {
            try {
                this.db.all(sql, params, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            }catch (err){
                reject(err);
            }
        });
    }

    // 关闭数据库
    close () {
        this.db.close();
    }

    // 单例
    static getInstance () {
        Sqlite.sqlInstance = Sqlite.sqlInstance ? Sqlite.sqlInstance : new Sqlite();
        return Sqlite.sqlInstance;
    }
}

module.exports = Sqlite
