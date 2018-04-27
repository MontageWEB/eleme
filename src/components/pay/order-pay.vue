<!--采用此版本-->
<template>
  <div class="order-container order-pay">
    <div class="header">
      <img src="../../../static/images/icon/back@left-black.png" class="back" @click="backClose">
      <span>在线支付</span>
    </div>
    <div class="pay-time">
      <div>支付剩余时间</div>
      <div class="time" v-if="hasTime">{{minute}}:{{second}}</div>
      <div class="no-time" v-else>支付超时，请重新支付</div>
    </div>
    <div class="con-list pay-info">
      <span class="label name">{{payInfo.shopName}}</span>
      <span class="price">￥{{payInfo.totalPrice}}</span>
    </div>
    <div class="title">
      支付方式
    </div>
    <div class="con-list pay-way">
      <div>
        <img src="../../../static/images/icon/pay@weixin.png" class= "pay-icon-logo" alt="">
        <span class="label">微信</span>
      </div>
      <img src="../../../static/images/icon/pay_selected.png" class= "pay-icon-status" alt="">
    </div>
    <div class="btn-wrapper">
      <mt-button type="default" class="pay-btn" @click="toPay" v-show="hasTime">确认支付￥{{payInfo.totalPrice}}</mt-button>
    </div>
    <pay-success :is-show="isShowSuccess" @on-close="closeSuccess"></pay-success>
  </div>
</template>
<script>
import common from '../../common/js/util.js'
import { isLogin } from '../../common/js/mm.js'
import wx from 'weixin-js-sdk'
import PaySuccess from '../order/pay-success.vue'
import { MessageBox, Toast } from 'mint-ui'
export default {
  computed: {
    second () {
      return this.num(this.seconds)
    },
    minute () {
      return this.num(this.minutes)
    }
  },
  data () {
    return {
      isShowSuccess: false,
      hasTime: true,
      minutes: 15,
      seconds: 0,
      payInfo: {}
    }
  },
  created () {
    let value = isLogin()
    if (!value) {
      this.$router.push('./')
      return false
    }
    this.add()
    this.payInfo = JSON.parse(localStorage.getItem('payInfo'))
  },
  methods: {
    refresh () {
      location.reload()
    },
    backClose () {
      MessageBox.confirm('返回需要重新下单').then(action => {
        if (action === 'confirm') {
          this.$router.go(-1)
        }
      })
    },
    toPay () {
      this.doPay()
      /*MessageBox.confirm('确定支付？').then(action => {
        if (action === 'confirm') {
        }
      })*/
    },
    doPay () {
      this.getOrderPay()
    },
    wxpayConfig () {
      let that = this
      this.axios.post(common.baseApi + '/WenXin/getSignature', {
        SignatureUrl: location.href.split('#')[0]
      })
        .then((res) => {
          if (res.data.status === 200) {
            let data = res.data.data
            wx.config({
              debug: true,
              appId: data.appId,
              timestamp: data.timestamp,
              nonceStr: data.noncestr,
              signature: data.signature,
              jsApiList: ['chooseWXPay']
            })
            // that.getOrderPay()
            that.getPayTest()
          } else {
            Toast({
              message: '请求失败',
              duration: 1000
            })
          }
        }, (err) => {
          console.log(err)
          Toast({
            message: '请求wxpayConfig服务失败',
            duration: 1000
          })
        })
    },
    setWxpayInfo (data) {
      let that = this
      wx.chooseWXPay({
        debug: true,
        appId: data.appId,
        timestamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success (res) {
          if (res.errMsg === 'chooseWXPay:ok') {
            Toast({
              message: '支付成功',
              duration: 1000
            })
            that.isShowSuccess = true
          } else {
            Toast({
              message: '支付失败',
              duration: 1000
            })
          }
        },
        cancel () {
          Toast({
            message: '支付取消',
            duration: 1000
          })
        },
        error (res) {
          console.log(res)
          Toast({
            message: '支付请求失败',
            duration: 1000
          })
        }
      })
    },
    getOrderPay () {
      let para = JSON.parse(localStorage.getItem('orderInfo'))
      let that = this
      this.axios.post(common.baseApi + '/order/insertOrder', para)
        .then((res) => {
          if (res.data.status === 200) {
            let wxSdk = res.data.data
            wx.ready(() => {
              that.setWxpayInfo(wxSdk)
            })
          } else {
            console.log('下单失败')
            /*Toast({
              message: '下单失败',
              duration: 1000
            })*/
          }
        }, (err) => {
          console.log(err)
          Toast({
            message: '下单请求失败',
            duration: 1000
          })
        })
    },
    closeSuccess () {
      this.isShowSuccess = false
    },
    num (n) {
      return n < 10 ? '0' + n : '' + n
    },
    add () {
      let _this = this
      let time = window.setInterval(function () {
        if (_this.seconds === 0 && _this.minutes !== 0) {
          _this.seconds = 59
          _this.minutes -= 1
        } else if (_this.minutes === 0 && _this.seconds === 0) {
          _this.seconds = 0
          window.clearInterval(time)
          _this.hasTime = false
        } else {
          _this.seconds -= 1
        }
      }, 1000)
    }
  },
  watch: {
    second: {
      handler (newVal) {
        this.num(newVal)
      }
    },
    minute: {
      handler (newVal) {
        this.num(newVal)
      }
    }
  },
  components: {
    PaySuccess
  }
}
</script>
<style scoped>
  .order-pay{
    z-index: 31;
    font-size:16px;
  }
  .pay-time{
    background-color: #fff;
    padding-top: 70px;
    padding-bottom: 30px;
    text-align: center;
    color:#999;
  }
  .pay-time .time{
    margin-top:20px;
    font-size: 28px;
    font-weight: bold;
    color:#000;
  }
  .pay-time .no-time{
    color:red;
  }
  .con-list{
    background-color: #fff;
    padding:20px 15px;
  }
  .pay-info{
    border-top:1px solid #ddd;
    display: flex;
    justify-content: space-between;
  }
  .pay-info .price{
    color:red;
  }
  .title{
    color:#999;
    padding:10px;
  }
  .pay-way{
    display: flex;
    justify-content: space-between;
  }
  .pay-way img{
    height:24px;
  }
  .pay-way img.pay-icon-logo{
    margin-right:20px;
  }
  .btn-wrapper{
    margin:30px 10px;
  }
  .btn-wrapper .pay-btn{
    background-color: #FFD120;
    color:#000;
    border-radius: 0;
    width:100%;
    font-size:18px;
    font-weight: bold;
  }
</style>
