//给Date类添加了一个新的实例方法format
Date.prototype.format = function (fmt) {
    //debugger;
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

export function fmtDate(date, pattern) {
    let ts = date.getTime();
    let d = new Date(ts).format("yyyy-MM-dd hh:mm:ss");
    if (pattern) {
        d = new Date(ts).format(pattern);
    }
    return d.toLocaleString();
}


//获取ip
export function getUserIP(onNewIP) {
    let MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    let pc = new MyPeerConnection({
        iceServers: []
    });
    let noop = () => {};
    let localIPs = {};
    let ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
    let iterateIP = (ip) => {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    };
    pc.createDataChannel('');
    pc.createOffer().then((sdp) => {
        sdp.sdp.split('\n').forEach(function (line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });
        pc.setLocalDescription(sdp, noop, noop);
    }).catch((reason) => {});
    pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}