// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import mintui from 'mint-ui'
import 'mint-ui/lib/style.min.css'
import '../static/mui/css/mui.min.css'
import '../static/css/main.css'
import Vuex from 'vuex'
import store from './vuex/store'
Vue.use(mintui)
Vue.use(Vuex)
Vue.config.productionTip = false
Vue.prototype.axios = axios

Vue.filter('currency', function (value) {
  return (value / 100).toFixed(2)
})

Vue.filter('formatDate', function (oldDate) {
  let date = new Date(Date.parse(new Date(oldDate)))
  let Y = date.getFullYear() + '-'
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
  return Y + M + D
})

Vue.filter('dateDiff', function (dateTimeStamp) {
  let minute = 1000 * 60
  let hour = minute * 60
  let day = hour * 24
  let halfamonth = day * 15
  let month = day * 30
  let result
  let now = new Date().getTime()
  let diffValue = now - dateTimeStamp
  if (diffValue < 0) {
    //alert("若日期不符则弹出窗口告之");
  }
  let monthC = diffValue / month
  let halfamonthC = diffValue / halfamonth
  let weekC = diffValue / (7 * day)
  let dayC = diffValue / day
  let hourC = diffValue / hour
  let minC = diffValue / minute
  if (monthC >= 1) {
    result = parseInt(monthC) + '个月前'
  } else if (halfamonthC >= 1) {
    result = '半个月前'
  } else if (weekC >= 1) {
    result = parseInt(weekC) + '周前'
  } else if (dayC >= 1) {
    result = parseInt(dayC) + '天前'
  } else if (hourC >= 1) {
    result = parseInt(hourC) + '小时前'
  } else if (minC >= 1) {
    result = parseInt(minC) + '分钟前'
  } else result = '刚刚'
  return result
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
