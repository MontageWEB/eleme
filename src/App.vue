<template>
  <div>
    <img src="../static/images/icon/logo@m.png" alt="" style="display:none">
    <transition name="router-fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <nav class="mui-bar mui-bar-tab">
      <router-link class="mui-tab-item" to="/shops">
        <span class="mui-icon icon-shops"></span>
        <span class="mui-tab-label">食堂</span>
      </router-link>
      <router-link class="mui-tab-item" to="/my">
        <span class="mui-icon icon-my"></span>
        <span class="mui-tab-label">我的</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
import common from './common/js/util.js'
import { Toast } from 'mint-ui'
import wx from 'weixin-js-sdk'
export default {
  data () {
    return {
      getCodeUrl: '',
      imgUrl: ''
    }
  },
  created () {
    this.formatPath()
    let codeFlag = localStorage.getItem('codeFlag')
    if (!codeFlag) {
      this.doOauth()
    }
  },
  mounted () {
    if (localStorage.getItem('codeFlag')) {
      this.getOpenId()
    }
    this.getWxConfig()
  },
  methods: {
    doOauth () {
      localStorage.setItem('codeFlag', true)
      window.location.href = ''
    },
    formatPath () {
      let config = {}
      config.url = window.location.href
      if (!config.url.match(/\?/)) {
        location.replace(window.location.href.split('#')[0] + '?' + window.location.hash)
        return false
      }
    },
    getOpenId () {
      let code = window.location.href.split('=')[1]
      this.axios.post(common.baseApi + '/WenXin/getOpenId', {'code': code})
        .then((res) => {
          if (res.data.status === 200) {
            let openId = res.data.data.openid
            localStorage.setItem('openId', openId)
            this.$router.push('/shops')
          } else {
            console.log(res.data)
            /*Toast({
              message: 'openId请求失败',
              duration: 1000
            })*/
          }
        }, (err) => {
          console.log(err)
          /*Toast({
            message: 'http请求openId失败',
            duration: 1000
          })*/
        })
    },
    getWxConfig () {
      let that = this
      this.axios.post(common.baseApi + '/WenXin/getSignature', {
        SignatureUrl: location.href.split('#')[0]
      })
        .then((res) => {
          if (res.data.status === 200) {
            that.wxConfig(res.data.data)
            wx.ready(() => {
              that.wxMenuShareApp()
              that.wxMenuShareTime()
            })
          } else {
            Toast({
              message: 'getWxConfig请求失败',
              duration: 1000
            })
          }
        }, (err) => {
          console.log(err)
          Toast({
            message: 'getWxConfig服务请求失败',
            duration: 1000
          })
        })
    },
    wxConfig (data) {
      wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.noncestr,
        signature: data.signature,
        jsApiList: [
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'chooseWXPay'
        ]
      })
    },
    wxMenuShareApp () {
      wx.onMenuShareAppMessage({
        title: '校蜜蜂', // 分享标题
        desc: '校蜜蜂 - 校园外卖点餐平台', // 分享描述
        link: 'http://xxx.com/', // 分享链接
        imgUrl: this.imgUrl,
        type: '',
        dataUrl: '',
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
        }
      })
    },
    wxMenuShareTime () {
      wx.onMenuShareTimeline({
        title: '校蜜蜂 - 校园外卖点餐平台',
        link: 'http://xxx.com/', // 分享链接
        imgUrl: this.imgUrl,
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
        }
      })
    }
  }
}
</script>

<style scoped>
  .mui-bar-tab{
    background:#fff;
  }
  .mui-bar{
    box-shadow:none;
  }
  .router-link-active{
    color:#FABD40;
  }
  .mui-icon.icon-shops, .mui-icon.icon-my{
    display:inline-block;
    background: url('../static/images/icon/tab_shops@default.png') no-repeat;
    background-size:24px 24px;
  }
  .mui-icon.icon-my{
    background-image: url('../static/images/icon/tab_my@default.png');
  }
  .router-link-active .icon-shops{
    background-image: url('../static/images/icon/tab_shops@selected.png');
  }
  .router-link-active .icon-my{
    background-image: url('../static/images/icon/tab_my@selected.png');
  }
</style>
