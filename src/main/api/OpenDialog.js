import {ipcMain,dialog} from 'electron'


class OpenDialog{
    init(){
        this.openFile()
    }
    openFile(){
        ipcMain.on('openFile',(e)=>{
            dialog.showOpenDialog({
                title:'打开文件',
                defaultPath:'xxx',
                properties:['openFile','multiSelections'],
                filters: [
                    {name: 'video', extensions: ['MP4', 'WebM', 'Ogg']}
                ]
            },(path)=>{
                if(!path){
                    e.returnValue=null
                    return
                }
                // path是选择文件后返回的路径
                // 主进程接收到渲染进程发送过来的消息并且返回消息
                e.returnValue=path
            })
        })
    }
}

export default OpenDialog