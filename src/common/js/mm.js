export function isLogin () {
  return localStorage.getItem('userId') || false
}
export function isLocalUrl () {
  let url = location.href.split('#')[0] === 'http://xxx.com/' ? 'http://xxx.com/?#/pay/order-pay' : 'http://localhost:8086/?#/pay/order-pay'
  window.location.href = url
}
export function isLocalOpenid () {
  let openId = location.href.split('#')[0] === 'http://xxx.com/' ? localStorage.getItem('openId') : 'oN2itxLOq87GZpQ5hhdKMSATNP45'
  return openId
}
