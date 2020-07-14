export default class Utils {
  // 当前日期
  static todayDate () {
    const dt = new Date()
    const y = dt.getFullYear()
    const m = dt.getMonth() + 1
    const d = dt.getDate()
    const w = dt.getDay()
    const weeks = ['天', '一', '二', '三', '四', '五', '六']
    return `${y} 年 ${m.toString().padStart(2, '0')} 月 ${d.toString().padStart(2, '0')} 日 星期${weeks[w]}`
  }

  // 浏览器全屏
  static fullScreen () {
    const isFull = document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
    // 判断是否全屏
    if (isFull) {
      const close = document.exitFullscreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen
      close && close.call(document)
    } else {
      const docElm = document.documentElement
      const open = docElm.requestFullScreen || docElm.webkitRequestFullScreen || docElm.mozRequestFullScreen || docElm.msRequestFullscreen
      open && open.call(docElm)
    }
  }
}
