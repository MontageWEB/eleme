<template>
  <div class="order-container order">
    <div class="w">
      <div class="header">
        <img src="../../static/images/icon/back@left-black.png" class="back" @click="backBtn">
        订单详情
      </div>
      <div class="order-status">
        <div class="status" v-if="status==4 || status==5">订单已完成</div>
        <div class="status" v-if="status==2 || status==3">商品配送中</div>
      </div>
      <div class="order-wrapper">
        <div class="con con-goods">
          <div class="con-list con-title">{{shopName}}</div>
          <ul class="goods-wrapper">
            <li class="con-list" v-for="(item, index) in orderData" v-bind:key="index">
              <div class="label name">{{item.goods_name}}</div>
              <div class="count">*{{item.quantity}}</div>
              <div class="price">￥{{item.goods_price | currency(item.goods_price)}}</div>
            </li>
            <li class="con-list">
              <div class="label name">餐盒费</div>
              <div class="price">￥{{packing_price | currency(packing_price)}}</div>
            </li>
            <li class="con-list">
              <a :href="'tel:' + shopPhone" class="label contact">联系商家</a>
              <div class="totalPrice">实付￥{{total_price | currency(total_price)}}</div>
            </li>
          </ul>
        </div>
        <div class="con con-deliver">
          <div class="con-list con-title">配送信息</div>
          <div class="con-list">
            <div class="address">
              <div class="con-title">收货地址</div>
              <div class="address-right">
                <div>{{addressStr}}</div>
                <div>
                  <span class="user">{{receiver_name}}</span>
                  <span class="mobile">{{receiver_mobile}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="con con-pay">
          <div class="con-list con-title">订单信息</div>
          <div class="con-list">
            <span class="label">订单号</span>
            <div class="info">{{orderId}}</div>
          </div>
          <div class="con-list">
            <span class="label">支付方式</span>
            <div class="info">微信</div>
          </div>
          <div class="con-list">
            <span class="label">下单时间</span>
            <div class="info">{{create_time | formatDate(create_time)}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import common from '../common/js/util.js'
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      orderId: 0,
      shopId: 0,
      status: 0,
      orderData: [],
      shopName: '订单信息',
      shopPhone: '',
      totalPrice: 0,
      total_price: 0,
      orderInfo: {},
      receiver_name: '',
      receiver_mobile: '',
      packing_price: '',
      addressStr: '',
      create_time: 0
    }
  },
  created () {
    this.orderId = this.$route.params.orderId
    this.loadOrder()
    this.loadOrderInfo()
  },
  methods: {
    backBtn () {
      this.$router.go(-1)
    },
    loadOrderInfo () {
      this.axios.post(common.baseApi + '/order/listOrder', {
        user_id: localStorage.getItem('userId'),
        order_id: this.orderId
      })
        .then((res) => {
          if (res.data.status === 200) {
            this.orderInfo = res.data.data.list[0]
            this.shopName = this.orderInfo.shop_name
            this.shopPhone = this.orderInfo.shop_phone
            this.status = this.orderInfo.status
            this.addressStr = this.orderInfo.addressStr
            this.receiver_name = this.orderInfo.receiver_name
            this.receiver_mobile = this.orderInfo.receiver_mobile
            this.total_price = this.orderInfo.total_price
            this.packing_price = this.orderInfo.packing_price
            this.create_time = this.orderInfo.create_time
          } else {
            Toast({
              message: '请求错误',
              duration: 1000
            })
          }
        }, (err) => {
          console.log(err)
        })
    },
    loadOrder () {
      this.axios.post(common.baseApi + '/order/getOrderItemByOrderId?order_id=' + this.orderId, {
        order_id: this.orderId
      })
        .then((res) => {
          if (res.data.status === 200) {
            this.orderData = res.data.data
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
  }
}
</script>
<style scoped>
  .order-status{
    background-color: #fff;
    margin-top:43px;
    text-align: center;
    padding:17px;
  }
  .order-status .status{
    font-size:18px;
    font-weight: bold;
    color:#333;
  }
  /*order-wrapper*/
  .order-wrapper{
    margin-bottom:44px;
    padding:10px;
  }
  .con{
    background-color: #fff;
    border-radius: 5px;
    margin-bottom:10px;
    padding-left:30px;
  }
  .con-list{
    min-height:50px;
    border-bottom: 1px solid #F4F3F4;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right:10px;
  }
  .con-list:last-child{
    border:none;
  }
  .icon-arrows{
    height:14px;
    margin-left:10px;
  }
  .con-list .con-title,.con-list.con-title{
    font-size:15px;
    font-weight: bold;
  }
  .con-list .label{
    color: #333;
  }
  .con-list .info{
    color: #666;
  }
  .con-list .remark{
    display: flex;
    align-items: center;
  }
  .con-deliver .address{
    padding-top:8px;
    padding-bottom:8px;
  }
  .con-deliver .address span{
    display: inline-block;
    color:#333;
    margin-top:5px;
  }
  .con-deliver .address .user {
    margin-right:30px;
  }
  /*shop-cart*/
  .shop-cart{
    position: fixed;
    left:0;
    bottom:0;
    z-index:30;
    width:100%;
    height:47px;
    line-height: 47px;
    display: flex;
    justify-content: space-between;
    background: #595959;
    font-size: 20px;
    font-weight: bold;
  }
  .shop-cart .price{
    color:#fff;
    margin-left:10px;
  }
  .shop-cart .pay{
    padding:0 30px;
    background-color: #FFD120;
  }
  .order-pay{
    z-index: 31;
  }

  /*order 覆盖*/
  .con-list .contact{
    padding-left:30px;
    background:url('../../static/images/icon/icon_phone.png');
    background-size:20px 20px;
    background-repeat:no-repeat;
    color: #FFD120;
  }
  .con-list .totalPrice{
    font-size:17px;
    font-weight: bold;
  }
  .address{
    display: flex;
    justify-content: space-between;
  }
  .address .address-right{
    text-align: right;
    width:70%;
  }
  .con-deliver .address .user{
    margin-right:5px;
  }
</style>
