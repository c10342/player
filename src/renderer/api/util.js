//获取屏幕个宽度和高度
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