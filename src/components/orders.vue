<template>
  <div class="container orders">
    <v-header header-title="提交订单" goBack="true"></v-header>
    <div class="orders-wrapper">
      <ul v-if="orders.length">
        <router-link tag="li" class="item" v-for="item in orders" v-bind:key="item.order_id" v-if="item.status===2 || item.status===3 || item.status===4 || item.status===5" v-bind="{to:'/order/' + item.order_id}">
          <img class="cover" :src="item.shop_img" alt="">
          <div class="con">
            <div class="top">
              <div class="left">
                <div>
                  <div class="name">{{item.shop_name}}</div>
                  <div class="time">{{item.create_time | dateDiff(item.create_time)}}</div>
                </div>
              </div>
              <div class="status" v-if="item.status===4 || item.status===5">订单已完成</div>
              <div class="status" v-if="item.status===2 || item.status===3">订单配送中</div>
            </div>
            <div class="middle">
              <div class="order-name">{{item.shop_pos}}</div>
              <div class="price">￥{{item.total_price | currency(item.total_price)}}</div>
            </div>
            <div class="bottom">
              <mt-button type="default" class="btn btn-color" v-if="item.status===2 || item.status===3">查看订单</mt-button>
              <mt-button type="default" class="btn btn-color" v-if="item.status===4 || item.status===5">再来一单</mt-button>
            </div>
          </div>
        </router-link>
      </ul>
      <div class="empty-tip" v-else>没有数据</div>
    </div>
  </div>
</template>
<script>
import common from '../common/js/util.js'
import { isLogin } from '../common/js/mm.js'
import VHeader from './base/v-header.vue'
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      orders: []
    }
  },
  created () {
    let value = isLogin()
    console.log(value)
    if (!value) {
      this.$router.push('./')
      return false
    }
    this.loadOrders()
  },
  methods: {
    payAgain () {
      Toast({
        message: 'payAgain',
        duration: 1000
      })
      //@click.stop.prevent="payAgain"
    },
    backBtn () {
      this.$router.go(-1)
    },
    loadOrders () {
      this.axios.post(common.baseApi + '/order/listOrder', {
        user_id: localStorage.getItem('userId')
      })
        .then((res) => {
          if (res.data.status === 200) {
            this.orders = res.data.data.list
            if (this.orders.length === 0) {
              Toast({
                message: '没有数据',
                duration: 1000
              })
            }
          } else {
            Toast({
              message: '请求错误',
              duration: 1000
            })
          }
        }, (err) => {
          console.log(err)
        })
    }
  },
  components: {
    VHeader
  }
}
</script>
<style scoped>
  .orders-wrapper{
    background-color: #fff;
    margin-top:43px;
    padding-left:15px;
  }
  .item{
    padding:15px 15px 15px 0;
    border-bottom: 1px solid #F5F6F5;
    display: flex;
  }
  .cover{
    flex: 0 0 48px;
    width:48px;
    height:48px;
    margin-right:10px;
  }
  .con{
    flex:1;
  }
  .top{
    display: flex;
    justify-content: space-between;
  }
  .name{
    font-size:16px;
    font-weight: bold;
  }
  .time{
    font-size: 11px;
    color:#999;
  }
  .status{
    font-size: 13px;
    color:#333;
  }
  .middle{
    color:#666;
    display: flex;
    justify-content: space-between;
  }
  .order-name{
    width:50%;
    height:20px;
    overflow: hidden;
  }
  .bottom{
    text-align: right;
    margin-top: 25px;
  }
  .bottom .btn{
    width:73px;
    height:28px;
    line-height:28px;
    font-size:13px;
    background-color: #fff;
    margin-left:10px;
    z-index:0;
  }
  .btn-color{
    color:#fbbd40;
    border-color:#fbbd40;
  }
</style>
