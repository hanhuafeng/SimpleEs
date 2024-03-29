// const { createProtocol } =  require('vue-cli-plugin-electron-builder/lib')
const {app, BrowserWindow, screen, ipcMain,Tray,Menu} = require('electron')
const isDev = require('electron-is-dev');
const path = require('path')

const userDataPath = app.getPath ("userData")

const windowsCfg = {
    id: '', //唯一id
    title: '', //窗口标题
    width: '', //宽度
    height: '', //高度
    minWidth: '', //最小宽度
    minHeight: '', //最小高度
    route: '', // 页面路由URL '/manage?id=123'
    resizable: true, //是否支持调整窗口大小
    maximize: false, //是否最大化
    backgroundColor:'#eee', //窗口背景色
    data: null, //数据
    isMultiWindow: false, //是否支持多开窗口 (如果为false，当窗体存在，再次创建不会新建一个窗体 只focus显示即可，，如果为true，即使窗体存在，也可以新建一个)
    isMainWin: false, //是否主窗口(当为true时会替代当前主窗口)
    parentId: '', //父窗口id  创建父子窗口 -- 子窗口永远显示在父窗口顶部 【父窗口可以操作】
    modal: false, //模态窗口 -- 模态窗口是禁用父窗口的子窗口，创建模态窗口必须设置 parent 和 modal 选项 【父窗口不能操作】
}

/**
 * 窗口配置
 */
class Window {
    constructor() {
        this.main = null; //当前页
        this.group = {}; //窗口组
        this.tray = null; //托盘
    }

    // 窗口配置
    winOpts(wh=[]) {
        return {
            width: wh[0],
            height: wh[1],
            backgroundColor: '#f00',
            autoHideMenuBar: true,
            titleBarStyle: "hidden",
            resizable: true,
            minimizable: true,
            maximizable: true,
            frame: true,
            show: false,
            webPreferences: {
                //上下文隔离
                contextIsolation: false,
                // nodeIntegration: true,
                //启用Node集成（是否完整的支持 node）
                nodeIntegration: true,
                // devTools: false,
                // 可以过滤跨域的问题
                webSecurity: false,
                //是否启用远程模块（即在渲染进程页面使用remote）
                enableRemoteModule: true,
            }
        }
    }

    // 获取窗口
    getWindow(id) {
        console.log(BrowserWindow)
        return BrowserWindow.fromId(id)
    }

    // 获取全部窗口
    getAllWindows() {
        return BrowserWindow.getAllWindows()
    }

    // 创建窗口
    createWindows(options) {
        console.log('------------开始创建窗口...')

        console.log(options)

        // Menu.setApplicationMenu(null) // null值取消顶部菜单栏
        let args = Object.assign({}, windowsCfg, options)
        console.log(args)

        // 判断窗口是否存在
        for(let i in this.group) {
            if(this.getWindow(Number(i)) && this.group[i].route === args.route && !this.group[i].isMultiWindow) {
                this.getWindow(Number(i)).focus()
                return
            }
        }

        let opt = this.winOpts([args.width || 800, args.height || 600])
        if(args.parentId) {
            console.log('parentId：' + args.parentId)
            opt.parent = this.getWindow(args.parentId)
        } else if(this.main) {
            console.log(666)
        }

        if(typeof args.modal === 'boolean') opt.modal = args.modal
        if(typeof args.resizable === 'boolean') opt.resizable = args.resizable
        if(args.backgroundColor) opt.backgroundColor = args.backgroundColor
        if(args.minWidth) opt.minWidth = args.minWidth
        if(args.minHeight) opt.minHeight = args.minHeight

        console.log(opt)
        let win = new BrowserWindow(args)
        win.setMenu(null)
        console.log('窗口id：' + win.id)
        this.group[win.id] = {
            route: args.route,
            isMultiWindow: args.isMultiWindow,
        }
        // 是否最大化
        if(args.maximize && args.resizable) {
            win.maximize()
        }
        // 是否主窗口
        if(args.isMainWin) {
            if(this.main) {
                console.log('主窗口存在')
                delete this.group[this.main.id]
                this.main.close()
            }
            this.main = win
        }
        args.id = win.id
        win.on('close', () => {
            win.setOpacity(0)
            if (args.isMainWin){
                app.quit()
            }
        })

        // 打开网址（加载页面）
        /**
         * 开发环境: http://localhost:18095/
         * 正式环境: app://./index.html
         */
        // let winURL
        // if (process.env.WEBPACK_DEV_SERVER_URL) {
        //     // Load the url of the dev server if in development mode
        //     // win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        //     winURL = args.route ? `http://localhost:8080${args.route}` : `http://localhost:8080`
        //     // 打开开发者调试工具
        //     // if (!process.env.IS_TEST) win.webContents.openDevTools()
        // } else {
        //     createProtocol('app')
        //     // Load the index.html when not in development
        //     // win.loadURL('app://./index.html')
        //     winURL = args.route ? `app://./index.html${args.route}` : `app://./index.html`
        // }
        // win.loadURL(winURL)
        if (isDev) {
            win.webContents.openDevTools() // 打开窗口调试
            let winUrl = args.route ? `http://localhost:18095${args.route}` : `http://localhost:18095/`
            win.loadURL(winUrl)
            // win.loadURL('http://localhost:18095/#/addNewConnection')
        } else {
            // win.loadFile(path.resolve(__dirname, '../../renderer/pages/main/index.html'))
            // createProtocol('app')
            let fileName = path.resolve(__dirname, '../../renderer/pages/main/index.html')
            if (args.route){
                // if (args.route.split("#").length == 2){
                //     fileName+=args.route.split("#")[1].replace('/','')
                // }
                win.loadFile(fileName,{
                    hash: args.route.split("#")[1].replace('/','')
                })
            }else{
                win.loadFile(fileName)
            }
            // win.loadFile(fileName,{
            //     hash: args.route.split("#")[1].replace('/','')
            // })
            // win.loadURL('app://./index.html')
        }

        win.once('ready-to-show', () => {
            win.show()
        })

        // 屏蔽窗口菜单（-webkit-app-region: drag）
        // win.hookWindowMessage(278, function(e){
        //     win.setEnabled(false)
        //     setTimeout(() => {
        //         win.setEnabled(true)
        //     }, 100)
        //
        //     return true
        // })
    }

    // 关闭所有窗口
    closeAllWindow() {
        for(let i in this.group) {
            if(this.group[i]) {
                if(this.getWindow(Number(i))) {
                    this.getWindow(Number(i)).close()
                } else {
                    console.log('---------------------------')
                    app.quit()
                }
            }
        }
    }

    // 创建托盘
    createTray() {
        console.log('创建托盘')
        const contextMenu = Menu.buildFromTemplate([
            {
                label: '显示',
                click: () => {
                    for(let i in this.group) {
                        if(this.group[i]) {
                            // this.getWindow(Number(i)).show()
                            let win = this.getWindow(Number(i))
                            if(!win) return
                            if(win.isMinimized()) win.restore()
                            win.show()
                        }
                    }
                }
            }, {
                label: '退出',
                click: () => {
                    app.quit()
                }
            }
        ])
        console.log(__dirname)
        // 最小化窗口
        // const trayIco = path.join(__dirname, '../static/logo.png')
        // console.log(trayIco)
        // this.tray = new Tray(trayIco)
        // this.tray.setContextMenu(contextMenu)
        // this.tray.setToolTip(app.name)
    }


    // 开启监听
    listen() {
        // 关闭
        ipcMain.on('window-closed', (event, winId) => {
            if(winId) {
                this.getWindow(Number(winId)).close()
                if(this.group[Number(winId)]) delete this.group[Number(winId)]
            } else {
                this.closeAllWindow()
                app.quit()
            }
        })

        // 隐藏
        ipcMain.on('window-hide', (event, winId) => {
            if(winId) {
                this.getWindow(Number(winId)).hide()
            } else {
                for(let i in this.group) if(this.group[i]) this.getWindow(Number(i)).hide()
            }
        })

        // 显示
        ipcMain.on('window-show', (event, winId) => {
            if(winId) {
                this.getWindow(Number(winId)).show()
            } else {
                for(let i in this.group) if(this.group[i]) this.getWindow(Number(i)).show()
            }
        })

        // 最小化
        ipcMain.on('window-mini', (event, winId) => {
            if(winId) {
                this.getWindow(Number(winId)).minimize()
            } else {
                for(let i in this.group) if(this.group[i]) this.getWindow(Number(i)).minimize()
            }
        })

        // 最大化
        ipcMain.on('window-max', (event, winId) => {
            if(winId) {
                this.getWindow(Number(winId)).maximize()
            } else {
                for(let i in this.group) if(this.group[i]) this.getWindow(Number(i)).maximize()
            }
        })

        // 最大化/最小化
        ipcMain.on('window-max-min-size', (event, winId) => {
            if(winId) {
                if(this.getWindow(winId).isMaximized()) {
                    this.getWindow(winId).unmaximize()
                }else {
                    this.getWindow(winId).maximize()
                }
            }
        })

        // 还原
        ipcMain.on('window-restore', (event, winId) => {
            if(winId) {
                this.getWindow(Number(winId)).restore()
            } else {
                for(let i in this.group) if(this.group[i]) this.getWindow(Number(i)).restore()
            }
        })

        // 重新加载
        ipcMain.on('window-reload', (event, winId) => {
            if(winId) {
                this.getWindow(Number(winId)).reload()
            } else {
                for(let i in this.group) if(this.group[i]) this.getWindow(Number(i)).reload()
            }
        })

        // 创建窗口
        ipcMain.on('window-new', (event, args) => this.createWindows(args))
    }
}

module.exports = {windowsCfg,Window,userDataPath}
