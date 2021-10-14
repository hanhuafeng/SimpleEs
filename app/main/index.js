const {app, screen, ipcMain} = require('electron')
const {
    initDb,
    initConnectionInfo,
    deleteConnectionInfo,
    addNewConnectionInfo,
    updateConnectionInfo
} = require('./util/indexSqlliteOperation')
const {Window} = require('./util/window')
let win

async function createWindow() {
    let window = new Window()
    window.listen()
    window.createWindows({
        isMainWin: true,
        webPreferences: {
            // 可以过滤跨域的问题
            webSecurity: false,
            // 允许在renderer进程使用node的功能
            nodeIntegration: true,
            // 上下文环境隔离关闭
            contextIsolation: false
        },
        titleBarStyle: 'default',
        width: screen.getPrimaryDisplay().workAreaSize.width,
        height: screen.getPrimaryDisplay().workAreaSize.height,
        title: "SimpleEs",
        show: false, // 先隐藏
        resizable: true
    })
    // 创建托盘
    // window.createTray()


    // win = new BrowserWindow({
    //     webPreferences: {
    //         // 可以过滤跨域的问题
    //         webSecurity: false,
    //         // 允许在renderer进程使用node的功能
    //         nodeIntegration: true,
    //         // 上下文环境隔离关闭
    //         contextIsolation: false
    //     },
    //     width: screen.getPrimaryDisplay().workAreaSize.width,
    //     height: screen.getPrimaryDisplay().workAreaSize.height,
    //     title: "SimpleEs",
    //     show: false // 先隐藏
    // })

    // if (isDev) {
    //     win.loadURL('http://localhost:18095/')
    //     // win.loadURL('http://localhost:18095/#/addNewConnection')
    //     win.webContents.openDevTools() // 打开窗口调试
    // } else {
    //     win.loadFile(path.resolve(__dirname, '../renderer/pages/main/index.html'))
    // }
    // win.on('ready-to-show', function () {
    //     win.show() // 初始化后再显示
    // })

    // Emitted when the window is closed.
    // win.on('closed', function () {
    //     // Dereference the window object, usually you would store windows
    //     // in an array if your app supports multi windows, this is the time
    //     // when you should delete the corresponding element.
    //     win = null
    // })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) createWindow()
})

/**
 * 初始化db
 */
initDb()

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
/**
 * 初始化es连接信息
 */
ipcMain.on('init_connection_info', (event, arg) => {
    initConnectionInfo(event, arg)
})

/**
 * 删除数据库连接信息
 */
ipcMain.on('delete_connection_info', (event, arg) => {
    deleteConnectionInfo(event, arg)
})

/**
 * 添加新的连接信息
 */
ipcMain.on('add_new_connection_info', (event, arg) => {
    addNewConnectionInfo(event, arg)
})

/**
 * 修改连接信息
 */
ipcMain.on('update_connection_info', (event, arg) => {
    updateConnectionInfo(event, arg)
})
