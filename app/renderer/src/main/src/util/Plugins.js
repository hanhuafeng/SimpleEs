/**
 * 创建窗口
 */
function windowCreate(ipcRenderer,args) {
    console.log(args)
    ipcRenderer.send('window-new', args)
}

/**
 * 关闭窗口
 */
function windowClose(ipcRenderer,id) {
    console.log('窗口id：' + id)
    ipcRenderer.send('window-closed', id)
}

module.exports = {windowCreate,windowClose}
