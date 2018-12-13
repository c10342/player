//获取屏幕的宽度和高度
export function client() {
    if (window.innerWidth != null) {   //ie
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    } else if (document.compatMode == "CSS1Compat") {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    }
    return {
        width: document.body.clientWidth,
        height: document.body.clientHeight
    }
}

// 格式化时间
export const formatTime = (time) =>{
    let h = parseInt(time/60/60)
    let m = parseInt(time/60%60)
    let s = parseInt(time%60)
    h = h==0?'':h<10?`0${h}`:h
    m = m<10?`0${m}`:m
    s = s<10?`0${s}`:s
    return h?`${h}:${m}:${s}`:`${m}:${s}`
}