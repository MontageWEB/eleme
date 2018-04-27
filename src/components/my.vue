<template>
  <div class="my">
    <div class="header">
      我的
    </div>
    <div class="info">
      <div class="user-avatar" @click="test">
        <img src="../../static/images/icon/icon_user@selected.png" alt="">
      </div>
      <div>{{userPhone}}</div>
    </div>
    <div class="link-wrapper">
      <div class="link-list" @click="toMyOrders">
        <div class="list-left">
          <img src="../../static/images/icon/my_icon_order.png" alt="" class="list-icon">
          <span>我的订单</span>
        </div>
        <img src="../../static/images/icon/back@right-gray.png" alt="">
      </div>
      <div class="link-list" @click="toMyAddress">
        <div class="list-left">
          <img src="../../static/images/icon/my_icon_location.png" alt="" class="list-icon">
          <span>收货地址</span>
        </div>
        <img src="../../static/images/icon/back@right-gray.png" alt="">
      </div>
      <a class="link-list" href="https://www.pgyer.com/xiaoxuanfeng">
        <div class="list-left">
          <img src="../../static/images/icon/logo@s.png" alt="" class="list-icon">
          <span>下载校蜜蜂</span>
        </div>
        <img src="../../static/images/icon/back@right-gray.png" alt="">
      </a>
    </div>

    <div class="logout" v-if="isLogout" @click="doLogOut">
      <span>退出登录</span>
    </div>

    <address-list :is-show="isShowAddressList" @on-close="closeAddressList"></address-list>
    <login :is-show="isShowLogin" @on-close="closeLogin" @success-close="successClose"></login>
  </div>
</template>
<script>
import { MessageBox, Toast } from 'mint-ui'
import AddressList from './address/address-list.vue'
import Login from './login.vue'
import { isLogin } from '../common/js/mm.js'
export default {
  data () {
    return {
      isShowAddressList: false,
      isShowLogin: false,
      userPhone: localStorage.getItem('userPhone') || '游客',
      isLogout: localStorage.getItem('userId') || false
    }
  },
  methods: {
    test () {
      console.log(this.$children)
    },
    toMyAddress () {
      let value = isLogin()
      if (!value) {
        this.isShowLogin = true
      } else {
        this.isShowAddressList = true
      }
    },
    toMyOrders () {
      let value = isLogin()
      if (!value) {
        this.isShowLogin = true
      } else {
        this.$router.push({path: '/orders'})
      }
    },
    closeAddressList () {
      this.isShowAddressList = false
    },
    closeLogin () {
      this.isShowLogin = false
    },
    successClose () {
      this.isShowLogin = false
      location.reload()
    },
    doLogOut () {
      MessageBox.confirm('确认退出？').then(action => {
        if (action === 'confirm') {
          localStorage.clear()
          Toast({
            message: '退出成功',
            duration: 1000
          })
          location.reload()
        }
      })
    }
  },
  components: {
    AddressList,
    Login
  }
}
</script>
<style scoped>
  .header{
    background-color: #FFD120;
    height:50px;
    text-align: center;
    color:#fff;
    font-size:20px;
    font-weight: bold;
    padding-top:10px;
  }
  .info{
    background-color: #FFD120;
    height:110px;
    color:#fff;
    padding:15px;
    font-size:16px;
    font-weight: bold;
    display: flex;
    align-items: center;
  }
  .user-avatar{
    width:56px;
    height:56px;
    background-color: #EEE;
    border-radius: 50%;
    text-align: center;
    margin-right:15px;
  }
  .link-wrapper{
    margin-top:15px;
    background-color: #fff;
  }
  .link-list{
    font-size:17px;
    line-height:44px;
    width:100%;
    border-bottom: 1px solid #F4F3F4;
    padding-left:15px;
    padding-right:15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .link-list .list-left{
    display: flex;
    align-items: center;
  }
  .link-list img{
    height:19px;
  }
  .link-list .list-icon{
    margin-right:12px;
  }
  .link-list:last-child .list-icon{
    margin-right:15px;
  }
  .logout{
    background-color: #fff;
    margin-top:30px;
    text-align: center;
    color:#FFD120;
    font-size:16px;
    line-height:44px;
  }
</style>
