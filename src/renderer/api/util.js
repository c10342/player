//获取屏幕的宽度和高度
export function client() {
    if (window.innerWidth != null) { //ie
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    } else if (document.compatMode == "CSS1Compat") { //最新浏览器,有声明头的
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    }
    return { //谷歌和其他没有声明头的
        width: document.body.clientWidth,
        height: document.body.clientHeight
    }
}

// 格式化时间
export const formatTime = (time) => {
    let h = parseInt(time / 60 / 60)
    let m = parseInt(time / 60 % 60)
    let s = parseInt(time % 60)
    h = h == 0 ? '' : h < 10 ? `0${h}` : h
    m = m < 10 ? `0${m}` : m
    s = s < 10 ? `0${s}` : s
    return h ? `${h}:${m}:${s}` : `${m}:${s}`
}

// 格式化时间
export const getTime = (time) => {
    const d = new Date(time)
    const year = d.getFullYear()
    const month = d.getMonth()+1
    const day = d.getDate()
    const h = d.getHours()
    const m = d.getMinutes()
    const s = d.getSeconds()
    return  `${year}-${month}-${day} ${h}:${m}:${s}`
}

// 在min和max之间的数中取一个随机数
export const getRandomInt = (min, max) => {
    // max-min+1是为了能去到上限max，0<Math.random<1
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// 打乱数组
export function shuffle(arr) {
    // 复制一个新数组
    var _arr = arr.slice()
    for (var i = 0; i < _arr.length; i++) {
        var j = getRandomInt(0, i);
        var t = _arr[i];
        _arr[i] = _arr[j];
        _arr[j] = t;
    }
    return _arr;
}

//进入全屏
export function requestFullScreen(element) {
    var de = document.querySelector(element) || document.documentElement;
    if (de.requestFullscreen) {
        de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen();
    }
}
//退出全屏
export function exitFullscreen(element) {
    var de = document.querySelector(element) || document.documentElement;
    if (de.exitFullscreen) {
        de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
    }
}

// 音乐后缀
export const musicSuffix = ['.mp3']

// 可播放的后缀
export const suffix = ['.MP4', '.WebM', '.Ogg', '.mkv', '.avi', '.MOV', '.ASF', '.WMV', '.NAVI', '.3GP', '.FLV', '.F4V', '.RMVB', '.HDDVD', '.rm', '.rmvb', '.MP3']

export const reg = /\.(MP4|WebM|Ogg|mkv|avi|MOV|ASF|WMV|NAVI|3GP|FLV|F4V|RMVB|HDDVD|rm|rmvb|mp3)$/i

export const musicReg = /\.(mp3)$/i

export const themes = [
    { 
        bgUrl:require('../assets/bg0.jpg'),
        textColor:'#818181',
        bgColor:'#252528',
        hover:'default-hover',
        itemHover:'default-hover'
     },
    {
        bgUrl:require('../assets/bg1.jpg'),
        textColor:'#ffffff',
        bgColor:'#FAFCFD',
        hover:'theme-hover',
        itemHover:'item-theme-hover'
    },
    {
        bgUrl:require('../assets/bg2.jpg'),
        textColor:'#ffffff',
        bgColor:'#FAFCFD',
        hover:'theme-hover',
        itemHover:'item-theme-hover'
    },
    {
        bgUrl:require('../assets/bg3.jpg'),
        textColor:'#ffffff',
        bgColor:'#FAFCFD',
        hover:'theme-hover',
        itemHover:'item-theme-hover'
    },
    {
        bgUrl:require('../assets/bg4.jpg'),
        textColor:'#ffffff',
        bgColor:'#FAFCFD',
        hover:'theme-hover',
        itemHover:'item-theme-hover'
    },
    {
        bgUrl:require('../assets/bg5.jpg'),
        textColor:'#ffffff',
        bgColor:'#FAFCFD',
        hover:'theme-hover',
        itemHover:'item-theme-hover'
    },
    {
        bgUrl:require('../assets/bg6.jpg'),
        textColor:'#ffffff',
        bgColor:'#FAFCFD',
        hover:'theme-hover',
        itemHover:'item-theme-hover'
    },
]


export const getVideoSize = (size) => {
    let mb = parseFloat(Math.round(size/1024/1024*100)/100)

    if(mb < 1024){
        return `${mb}MB`
    }else{
        mb = parseFloat(Math.round(mb/1024*100)/100)
        return `${mb}GB`
    }
}


