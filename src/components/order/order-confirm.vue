<template>
  <div class="order-container order-confirm" v-if="isShow">
    <div class="header">
      <img src="../../../static/images/icon/back@left-black.png" class="back" @click="backBtn">
      提交订单
    </div>
    <div class="order-wrapper">
      <div class="con con-deliver">
        <div class="con-list" @click="toMyAddress">
          <div class="address">
            <div class="con-title">{{address.addressDetail}}</div>
            <div>
              <span class="user">{{address.name}}</span>
              <span class="mobile">{{address.mobile}}</span>
            </div>
          </div>
          <img src="../../../static/images/icon/back@right-gray.png" class="icon-arrows" alt="">
        </div>
      </div>
      <div class="con con-goods">
        <div class="con-list con-title">{{shopName}}</div>
        <ul class="goods-wrapper">
          <li class="con-list" v-for="item in selectFoods" v-bind:key="item.goodsId">
            <div class="label name">{{item.goodsName}}</div>
            <div class="list-right">
              <div class="count">*{{item.count}}</div>
              <div class="price">￥{{item.goodsPrice}}</div>
            </div>
          </li>
          <li class="con-list">
            <div class="label name">餐盒费</div>
            <div class="price">￥{{boxPrice.toFixed(2)}}</div>
          </li>
        </ul>
      </div>
      <div class="con con-pay">
        <div class="con-list">
          <span class="label">支付方式</span>
          <div class="info">微信</div>
        </div>
        <div class="con-list">
          <span class="label">备注</span>
          <div class="info remark" @click="toRemark">
            <span class="remark-value" v-if="remarkValue">{{remarkValue}}</span>
            <span class="remark-value" v-else>口味、要求请备注</span>
            <img src="../../../static/images/icon/back@right-gray.png" class="icon-arrows" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="shop-cart">
      <div class="price">￥{{totalPrice}}元</div>
      <div class="pay" @click="toPay">下订单</div>
    </div>
    <address-list :is-show="isShowAddressList" :is-page="false" @select-item="selectAddress" @on-close="closeAddressList"></address-list>
    <text-area :is-show="isRemark" :area-value="remarkValue" area-title="备注" @on-close="closeRemark" @value-event="remarkEvent"></text-area>
  </div>
</template>
<script>
import TextArea from '../base/text-area.vue'
import AddressList from '../address/address-list.vue'
import { Toast } from 'mint-ui'
export default {
  props: {
    selectFoods: {
      type: Array,
      default () {
        return [
          // { goodsPrice: 10, count: 1 }
        ]
      }
    },
    shopName: {
      type: String,
      default: ''
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShowAddressList: false,
      isPayOrder: false,
      isRemark: false,
      remarkValue: '',
      hasAddress: false,
      defaultAddress: {},
      address: {
        addressDetail: '收货地址',
        name: '请先选择收货地址',
        mobile: '',
        userAddressId: 0
      },
      orderInfo: {}
    }
  },
  created () {
    // this.getDefaultAddress()
  },
  computed: {
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.goodsPrice * food.count
      })
      return (total + this.boxPrice).toFixed(2)
    },
    boxPrice () {
      return this.$store.state.boxPrice / 100
    }
  },
  methods: {
    getDefaultAddress () {
      let defaultAddress = JSON.parse(localStorage.getItem('defaultAddress'))
      if (defaultAddress) {
        this.hasAddress = true
        this.address.addressDetail = defaultAddress.addressDetail
        this.address.name = defaultAddress.name
        this.address.mobile = defaultAddress.mobile
        this.address.userAddressId = defaultAddress.userAddressId
      }
      // console.log(defaultAddress)
    },
    backBtn () {
      this.$emit('on-close')
    },
    toPay () {
      if (!this.hasAddress) {
        Toast({
          message: '请选择收货地址',
          duration: 1000
        })
        return false
      }
      this.getOrderInfo()
    },
    closePay () {
      this.isPayOrder = false
    },
    closeRemark () {
      this.isRemark = false
    },
    toMyAddress () {
      this.isShowAddressList = true
    },
    toRemark () {
      this.isRemark = true
    },
    closeAddressList () {
      this.isShowAddressList = false
    },
    selectAddress (value) {
      this.hasAddress = true
      this.address = value
    },
    remarkEvent (value) {
      this.remarkValue = value
    },
    getOrderInfo () {
      let orderInfo = {}
      let shopGoods = []
      let selectFoods = this.selectFoods
      selectFoods.forEach((ele) => {
        let foodObj = {}
        foodObj.goodsId = ele.goodsId
        foodObj.quantity = ele.count
        shopGoods.push(foodObj)
      })
      orderInfo.shop_goods = shopGoods
      orderInfo.user_address_id = this.address.userAddressId
      orderInfo.pay_type = 3
      orderInfo.userId = localStorage.getItem('userId')
      orderInfo.shop_id = this.selectFoods[0].shopId
      orderInfo.order_note = this.remarkValue
      orderInfo.spbill_create_ip = '127.0.0.1'
      orderInfo.openId = localStorage.getItem('openId')
      localStorage.setItem('orderInfo', JSON.stringify(orderInfo))
      let payInfo = {}
      payInfo.totalPrice = this.totalPrice
      payInfo.shopName = this.shopName
      localStorage.setItem('payInfo', JSON.stringify(payInfo))
      window.location.href = 'http://m.xxuanfeng.com/?#/pay/order-pay'
    }
  },
  components: {
    AddressList,
    TextArea
  }
}
</script>
<style scoped>
  /*order-wrapper*/
  .order-wrapper{
    margin-top:44px;
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
    min-width: 65px;
  }
  .con-list .info{
    color: #666;
  }
  .remark{
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .remark-value{
    display: inline-block;
    width:100%;
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
  .goods-wrapper .con-list .name{
    width:68%;
  }
  .goods-wrapper .con-list .list-right{
    width:28%;
    display: flex;
    justify-content: space-between;
  }
</style>
