<template>
  <div class="order-container login" v-show="isShow">
    <v-header header-title="登录" @on-close="backClose"></v-header>
    <form class="mui-input-group">
      <div class="mui-input-row">
        <label @click="getCode" v-show="!isCode" class="get-code" v-bind:class="{ rightPhone: phoneErrors.status }">获取验证码</label>
        <label v-show="isCode">{{time}}秒后重发</label>
        <input type="text" class="mui-input-clear" placeholder="输入手机号" v-model="phone">
      </div>
      <div class="mui-input-row">
        <label> </label>
        <input type="text" class="mui-input-password" placeholder="输入验证码" v-model="pwd">
      </div>
      <div class="attention">
        温馨提示：未注册校蜜蜂账户的手机号，登录时将自动注册，且代表您已同意《用户服务协议》
      </div>
      <div class="mui-button-row">
        <button type="button" class="mui-btn mui-btn-primary btn-login" @click="onLogin">登录</button>
      </div>
      <p class="errorText">{{errorText}}</p>
      <p class="errorText">{{phoneErrors.errorText}}</p>
      <p class="errorText">{{pwdErrors.errorText}}</p>
    </form>
  </div>
</template>
<script>
import common from '../common/js/util.js'
import VHeader from './base/v-header.vue'
import { Toast } from 'mint-ui'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      headerTitle: '登录',
      phone: '',
      pwd: '',
      errorText: '',
      isCode: false,
      time: 60,
      rightPhone: false
    }
  },
  computed: {
    phoneErrors () {
      let errorText, status
      if (!/^\s*1\d{10}\s*$/.test(this.phone)) {
        status = false
        errorText = '请输入正确的手机号'
      } else {
        status = true
        errorText = ''
      }
      if (!this.phoneFlag) {
        errorText = ''
        this.phoneFlag = true
      }
      return {
        errorText,
        status
      }
    },
    pwdErrors () {
      let errorText, status
      if (!this.pwd) {
        status = false
        errorText = '请输入验证码'
      } else {
        status = true
        errorText = ''
      }
      if (!this.pwdFlag) {
        errorText = ''
        this.pwdFlag = true
      }
      return {
        errorText,
        status
      }
    }
  },
  methods: {
    backClose () {
      this.$emit('on-close')
    },
    getCode () {
      if (!this.phoneErrors.status) {
        Toast({
          message: '请输入手机号',
          duration: 1000
        })
        return false
      }
      this.doGetCode()
    },
    countDown () {
      let that = this
      if (this.time === 0) {
        this.time = 60
        this.isCode = false
      } else {
        this.time--
        setTimeout(function () {
          that.countDown()
        }, 1000)
      }
    },
    doGetCode () {
      let that = this
      this.axios.post(common.baseApi + '/user/sendRegisterVerificationCode', {
        mobile: this.phone
      })
        .then((res) => {
          if (res.data.status === 200) {
            Toast({
              message: '验证码已发送',
              duration: 1000
            })
            this.isCode = true
            that.countDown()
          } else {
            Toast({
              message: '发送验证码失败',
              duration: 1000
            })
          }
        }, (err) => {
          console.log(err)
        })
    },
    doLogin () {
      let that = this
      this.axios.post(common.baseApi + '/user/quickLogin', {
        identifier: this.phone,
        credential: this.pwd
      })
        .then((res) => {
          if (res.data.status === 200) {
            let userId = res.data.data.userId
            let userName = res.data.data.nickname
            let userPhone = that.phone
            this.errorText = ''
            localStorage.setItem('userId', userId)
            localStorage.setItem('userName', userName)
            localStorage.setItem('userPhone', userPhone)
            Toast({
              message: '登录成功',
              duration: 1000
            })
            setTimeout(() => {
              this.$emit('success-close')
              this.$emit('on-close')
            }, 1000)
          } else {
            Toast({
              message: '手机号或验证码错误',
              duration: 1000
            })
          }
        }, (err) => {
          console.log(err)
          this.errorText = err.message
        })
    },
    onLogin () {
      if (!this.phoneErrors.status || !this.pwdErrors.status) {
        this.errorText = '手机号或验证码不正确'
      } else {
        this.errorText = ''
        this.doLogin()
      }
    }
  },
  components: {
    VHeader
  }
}
</script>
<style scoped>
  /*form*/
  .mui-input-group{
    margin-top:55px;
    padding-right:15px;
    padding-bottom:10px;
    font-size:16px;
  }
  .mui-input-group input{
    font-size:14px;
    color:#cacaca;
  }
  .mui-input-group:before, .mui-input-group:after{
    height:0;
  }

  /*input-group*/
  .mui-input-group .mui-input-row{
    height:44px;
  }

  .mui-input-group .mui-input-row:first-child{
    margin-bottom:20px;
  }

  /*label*/
  .mui-input-row label{
    text-align: right;
    width:40%;
    float:right;
  }

  .mui-input-row label ~ input, .mui-input-row label ~ select, .mui-input-row label ~ textarea{
    width:55%;
  }

  /*button*/
  .mui-input-group .mui-button-row{
    height:100%;
    margin-left: 15px;
  }

  input[type='submit'], .mui-btn-primary, .mui-btn-blue{
    border-color:#FBBD40;
    background-color: #FBBD40;
  }

  .btn-login{
    width:100%;
    color:#000;
    font-size:16px;
  }

  /*validate*/
  .errorText{
    margin-top: 15px;
    text-align:center;
    color: darkred;
  }

  .attention{
    padding:12px;
    color:#666;
    font-size:11px;
    line-height:16px;
  }
  .mui-input-group .mui-input-row:first-child{
    margin-bottom:0;
  }
  .get-code{
    color:#666;
  }
  .rightPhone{
    color:#000;
  }
</style>
