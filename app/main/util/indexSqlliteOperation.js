const sqllite = require('../sqlite')

function initDb() {
    let lite = sqllite.getInstance()
    lite.connect('sq3.db').then((res, err) => {
        // console.log(res)
        // console.log(err)
        if (res === 1) {
            const sql1 = "create table IF NOT EXISTS es_database_info(id INTEGER not null constraint es_database_info_pk primary key autoincrement,title text not null,username text default '',passwd text default '',base_url text,es_version text default '' not null);"
            const sql2 = "create unique index IF NOT EXISTS es_database_info_id_uindex on es_database_info (id);"
            const sql3 = "create unique index IF NOT EXISTS es_database_info_title_uindex on es_database_info (title);"
            lite.run(sql1).then((resolve, reject) => {
                if (resolve === 1) {
                    lite.run(sql2);
                    lite.run(sql3);
                    lite.close()
                } else {
                    console.error(reject)
                    lite.close()
                }
            });
        } else {
            console.error(err)
        }
    })
}

/**
 * 初始化连接信息
 * @param event
 * @param arg
 */
function initConnectionInfo(event, arg) {
    let lite = sqllite.getInstance()
    lite.connect('sq3.db').then((res, err) => {
        if (res === 1) {
            const sql = 'select * from main.es_database_info;'
            console.log(sql)
            lite.all(sql).then((resolve, reject) => {
                if (typeof reject == 'undefined') {
                    lite.close()
                    event.reply('index_info', resolve)
                } else {
                    console.error(reject)
                    lite.close()
                    event.reply('index_info', [])
                }
            })
        } else {
            console.error(err)
            lite.close()
            event.reply('index_info', [])
        }
    })
}

/**
 * 删除索引信息
 * @param event
 * @param arg
 */
function deleteConnectionInfo(event, arg) {
    let lite = sqllite.getInstance()
    if (typeof arg == 'undefined' || arg == null || arg === '') {
        event.reply('connection_info_delete_result', '需要删除的ES连接编号异常')
        return
    }
    lite.connect('sq3.db').then((res, err) => {
        if (res === 1) {
            const sql = 'delete from main.es_database_info where id = ' + arg + ';'
            console.log(sql)
            try {
                lite.run(sql).then((resolve, reject) => {
                    if (typeof reject == 'undefined') {
                        lite.close()
                        event.reply('connection_info_delete_result', {resolve: resolve, arg: arg})
                    } else {
                        console.error(reject)
                        lite.close()
                        event.reply('connection_info_delete_result', reject)
                    }
                })
            } catch (err) {
                event.reply('connection_info_delete_result', err)
            }

        } else {
            console.error(err)
            lite.close()
            event.reply('connection_info_delete_result', err)
        }
    })
}

/**
 * 添加新的连接
 * @param event
 * @param arg
 */
function addNewConnectionInfo(event, arg) {
    let lite = sqllite.getInstance()
    lite.connect('sq3.db').then((res, err) => {
        if (res === 1) {
            let sql = "insert into main.es_database_info(title,username,passwd,base_url,es_version) values('" + arg.title + "','" + arg.username + "','" + arg.password + "','" + arg.connectionUrl + "','" + arg.version + "');"
            console.log(sql)
            try {
                lite.run(sql).then((resolve, reject) => {
                    if (typeof reject == 'undefined') {
                        sql = 'select last_insert_rowid() as new_id from main.es_database_info'
                        console.log(sql)
                        lite.get(sql).then((resp, error) => {
                            lite.close()
                            arg.id = resp.new_id
                            let returnResult = {
                                code: resolve,
                                data: arg
                            }
                            event.reply('add_new_connection_result', returnResult)
                        })
                    } else {
                        console.error(reject)
                        lite.close()
                        event.reply('add_new_connection_result', reject)
                    }
                })
            } catch (err) {
                event.reply('add_new_connection_result', err)
            }

        } else {
            console.error(err)
            lite.close()
            event.reply('add_new_connection_result', err)
        }
    })
}

function updateConnectionInfo(event, arg) {
    let lite = sqllite.getInstance()
    lite.connect('sq3.db').then((res, err) => {
        if (res === 1) {
            let sql = "update main.es_database_info set title='" + arg.title + "',username='" + arg.username + "',passwd='" + arg.password + "',base_url='" + arg.connectionUrl + "',es_version='" + arg.version + "' where id = " + arg.id + ";"
            console.log(sql)
            try {
                lite.run(sql).then((resolve, reject) => {
                    if (typeof reject == 'undefined') {
                        event.reply('update_connection_result', resolve)
                        lite.close()
                    } else {
                        console.error(reject)
                        lite.close()
                        event.reply('update_connection_result', reject)
                    }
                })
            } catch (err) {
                event.reply('update_connection_result', err)
            }
        } else {
            console.error(err)
            lite.close()
            event.reply('update_connection_result', err)
        }
    });
}


module.exports = {initConnectionInfo, deleteConnectionInfo, initDb, addNewConnectionInfo, updateConnectionInfo}
