<template>
  <div class="order-container order-pay" v-if="isShow">
    <div class="header">
      <img src="../../../static/images/icon/back@left-black.png" class="back" @click="backBtn">
      在线支付
    </div>
    <div class="pay-time">
      <div>支付剩余时间</div>
      <div class="time" v-if="hasTime">{{minute}}:{{second}}</div>
      <div class="no-time" v-else>支付超时，请重新支付</div>
    </div>
    <div class="con-list pay-info">
      <span class="label name">{{shopName}}</span>
      <span class="price">￥{{price}}</span>
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
      <mt-button type="default" class="pay-btn" @click="toPay" v-show="hasTime">确认支付￥{{price}}</mt-button>
    </div>
    <pay-success :is-show="isShowSuccess" @on-close="closeSuccess"></pay-success>
  </div>
</template>
<script>
import common from '../../common/js/util.js'
import wx from 'weixin-js-sdk'
import PaySuccess from './pay-success.vue'
import { MessageBox, Toast } from 'mint-ui'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    shopName: {
      type: String,
      default: ''
    },
    price: {
      type: String,
      default: ''
    },
    orderInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
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
      seconds: 0
    }
  },
  created () {
    this.add()
  },
  methods: {
    backBtn () {
      this.$emit('on-close')
    },
    toPay () {
      MessageBox.confirm('确定支付？').then(action => {
        if (action === 'confirm') {
          this.getOrderId()
          // console.log(this.orderInfo)
        }
      })
    },
    doPay (orderId) {
      let that = this
      this.axios.post(common.baseApi + '/order/wxpay')
        .then((res) => {
          if (res.data.status === 200) {
            that.setWxpayInfo(res.data.data)
          } else {
            Toast({
              message: '请求失败',
              duration: 1000
            })
          }
        }, (err) => {
          console.log(err)
        })
    },
    setWxpayInfo (data) {
      wx.chooseWXPay({
        appId: data.appId,
        timestamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success (res) {
          if (res.errMsg === 'chooseWXPay:ok') {
            this.getOrderId()
            // window.alert('支付成功')
            Toast({
              message: '支付成功',
              duration: 1000
            })
            this.isShowSuccess = true
            // window.location.reload()
          } else {
            window.alert(' 支付失败')
            // window.location.reload()
          }
        },
        cancel () {
          window.alert('支付取消')
          // window.location.reload()
        },
        error (res) {
          window.alert('支付失败')
          // window.location.reload()
        }
      })
    },
    getOrderId () {
      let para = this.orderInfo
      this.axios.post(common.baseApi + '/order/insertOrder', para)
        .then((res) => {
          if (res.data.status === 200) {
            console.log(res)
            // let orderId = res.data.orderId
            // this.doPay(orderId)
          } else {
            Toast({
              message: '下单失败',
              duration: 1000
            })
          }
        }, (err) => {
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
