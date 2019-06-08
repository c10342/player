const {
    Menu,
    BrowserWindow
} = require('electron')

const contextMenuTemplate = [
    {
        label: '打开',
        submenu: [
            {
                label: '打开文件',
                click() {
                    console.log('打开文件11')
                },
            },
            {
                label: '打开文件夹',
                click() {
                    console.log('打开文件夹')
                },
            },
            {
                label: '打开URL',
                click() {
                    console.log('打开URL')
                },
            }
        ]
    },
    {
        type: 'separator'
    },
    {
        label: '全屏',
    },
    {
        label: '窗口置顶',
        submenu: [
            {
                label: '从不',
                click() {
                    console.log('从不')
                },
            },
            {
                label: '始终',
                click() {
                    console.log('始终')
                },
            },
        ]
    },
    {
        type: 'separator'
    },
    {
        label: '播放列表'
    },
    {
        label: '播放顺序',
        submenu: [
            {
                label: '单个播放',
                click() {
                    console.log('单个播放')
                },
            },
            {
                label: '单个循环',
                click() {
                    console.log('单个循环')
                },
            },
            {
                label: '循环列表',
                click() {
                    console.log('循环列表')
                },
            },
            {
                label: '随机播放',
                click() {
                    console.log('随机播放')
                },
            }
        ]
    },
    {
        type: 'separator'
    },
    {
        label: '声音',
        submenu: [
            {
                label: '10%',
                click() {
                    console.log('10%')
                },
            },
            {
                label: '20%',
                click() {
                    console.log('20%')
                },
            },
            {
                label: '30%',
                click() {
                    console.log('30%')
                },
            },
            {
                label: '40%',
                click() {
                    console.log('40%')
                },
            },
            {
                label: '50%',
                click() {
                    console.log('50%')
                },
            },
            {
                label: '60%',
                click() {
                    console.log('60%')
                },
            },
            {
                label: '70%',
                click() {
                    console.log('70%')
                },
            },
            {
                label: '80%',
                click() {
                    console.log('80%')
                },
            },
            {
                label: '90%',
                click() {
                    console.log('90%')
                },
            },
            {
                label: '100%',
                click() {
                    console.log('100%')
                },
            },
            {
                label: '静音',
                click() {
                    console.log('静音')
                },
            }
        ]
    },
    {
        type: 'separator'
    },
    {
        label: '设置'
    },
    {
        label: '文件信息'
    },
]


// 点击video区域创建右键菜单
export const createContextMenu = () => {
    const contextMenu = Menu.buildFromTemplate(contextMenuTemplate)
    contextMenu.popup(BrowserWindow.getFocusedWindow())
}


// 点击播放列表区域创建右键菜单
export const createPlayListMenu = (obj={
    '播放': { enabled: true },
    '删除选中项': { enabled: true },
    '打开文件所在位置': { enabled: true },
})  => {
    let playListMenuTemplate = [
        {
            label: '播放',
            enabled: obj['播放'].enabled
        },
        {
            label: '删除选中项',
            enabled: obj['删除选中项'].enabled
        },
        {
            label: '添加',
            submenu: [
                {
                    label: '添加文件'
                },
                {
                    label: '添加文件夹'
                },
                {
                    label: '添加URL'
                }
            ]
        },
        {
            type: 'separator'
        },
        {
            label: '清空播放列表'
        },
        {
            label: '删除无效文件'
        },
        {
            type: 'separator'
        },
        {
            label: '播放顺序',
            submenu: [
                {
                    label: '单个播放'
                },
                {
                    label: '单个循环',
                },
                {
                    label: '循环列表',
                },
                {
                    label: '随机播放',
                }
            ]
        },
        {
            label: '排序',
            submenu: [
                {
                    label: '默认排序',
                },
                {
                    label: '大小排序',
                },
                {
                    label: '时间排序',
                },
                {
                    label: '随机排序',
                },
                {
                    label: '名称排序',
                }
            ]
        },
        {
            type: 'separator'
        },
        {
            label: '打开文件所在位置',
            enabled: obj['打开文件所在位置'].enabled
        },
    ]
    const contextMenu = Menu.buildFromTemplate(playListMenuTemplate)

    contextMenu.addListener('menu-will-close', () => {
        //发送消息给渲染进程
        BrowserWindow.getFocusedWindow().webContents.send('menu-will-close')
    })
    contextMenu.popup(BrowserWindow.getFocusedWindow())
}