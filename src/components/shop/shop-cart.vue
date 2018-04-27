<template>
  <div class="shopcart">
    <div class="content" @click="toggeList">
      <div class="content-left">
        <div class="logo-wrapper">
          <img src="../../../static/images/icon/shop_cart.png" class="icon-shopping_cart" alt="">
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price">￥{{totalPrice}}元</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
    </div>
    <transition name="toggle-cart">
      <div class="shop-cart-list" v-show="listShow" transition="fold">
        <div class="list-header">
          <p class="title">已选套餐</p>
          <div class="empty" @click="empty">
            <img src="../../../static/images/icon/icon_delete.png" alt="">
            <span>清空</span>
          </div>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food-content-list" v-for="food in selectFoods" v-bind:key="food.goodsId">
              <div class="name">
                <span class="goodsName">{{food.goodsName}}</span>
                <span class="goodsInfo">{{food.goodsInfo}}</span>
              </div>
              <div class="price">
                <span>￥{{(food.goodsPrice*food.count).toFixed(2)}}</span>
              </div>
              <div class="cart-control-wrapper">
                <cart-control :food="food"></cart-control>
              </div>
            </li>
          </ul>
        </div>
        <div class="list-footer">商品如需分开打包请备注！</div>
      </div>
    </transition>
    <login :is-show="isShowLogin" @on-close="closeLogin"></login>
    <order-confirm :is-show="isShowOrder" :selectFoods="selectFoods" :shop-name="shopName" @on-close="closeOrder"></order-confirm>
  </div>
</template>
<script>
import common from '../../common/js/util.js'
import CartControl from './cart-control.vue'
import BScroll from 'better-scroll'
import OrderConfirm from '../order/order-confirm.vue'
import Login from '../login.vue'
import { isLogin } from '../../common/js/mm.js'
export default {
  props: {
    minPrice: {
      type: Number,
      default: 0.1
    },
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
    }
  },
  data () {
    return {
      fold: true,
      isShowOrder: false,
      isShowLogin: false
    }
  },
  computed: {
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.goodsPrice * food.count
      })
      return total.toFixed(2)
    },
    totalCount () {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = (this.minPrice - this.totalPrice).toFixed(2)
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    payClass () {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    },
    listShow () {
      if (!this.totalCount) {
        this.fold = true
        return false
      }
      let show = !this.fold
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      }
      return show
    }
  },
  methods: {
    toggeList () {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
    },
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    pay () {
      if (this.totalPrice < this.minPrice) {
        return false
      }
      let value = isLogin()
      if (!value) {
        this.isShowLogin = true
      }
      if (value) {
        this.getBoxPrice()
        this.isShowOrder = true
      }
    },
    closeOrder () {
      this.isShowOrder = false
    },
    closeLogin () {
      this.isShowLogin = false
    },
    getBoxPrice () {
      this.axios.post(common.baseApi + '/meals/getMealsFeeByTotalMoney', {
        maxFee: this.totalPrice * 100
      })
        .then((res) => {
          if (res.data.status === 200) {
            this.$store.commit('newBoxPrice', res.data.data)
          } else {
            console.log('请求失败')
          }
        }, (err) => {
          console.log(err)
        })
    }
  },
  components: {
    CartControl,
    OrderConfirm,
    Login
  }
}
</script>
<style scoped>
  .shopcart{
    position: fixed;
    left:0;
    bottom:0;
    z-index:21;
    width:100%;
    height:47px;
  }
  .content{
    display: flex;
    background: #595959;
    font-size:0;
  }
  .content-left{
    flex: 1;
  }
  .logo-wrapper{
    display:inline-block;
    position:relative;
    bottom:13px;
    left:15px;
    width:47px;
    height:47px;
    box-sizing: border-box;
  }
  .logo-wrapper .icon-shopping_cart{
    width:47px;
    height:47px;
  }
  .logo-wrapper .num{
    position:absolute;
    top:-10px;
    right:0;
    font-size:10px;
    font-weight: bold;
    width:25px;
    height:25px;
    line-height: 25px;
    background: #FB4040;
    color:#fff;
    text-align: center;
    border-radius: 50%;
  }
  .content-left .price{
    display:inline-block;
    vertical-align: top;
    margin:3px 12px 0 22px;
    font-size:20px;
    font-weight: bold;
    color:#fff;
  }
  .content-right{
    flex: 0 0 150px;
    width:150px;
  }
  .content-right .pay{
    height:47px;
    line-height: 47px;
    text-align: center;
    font-size:18px;
    font-weight: bold;
    background:#6A6A6A;
    color:#B5B5B5;
  }
  .content-right .pay.enough{
    background:#FBBD40;
    color:#000;
  }
  /*shop-cart-list*/
  .shop-cart-list{
    position: absolute;
    left:0;
    bottom:50px;
    z-index: -1;
    width:100%;
  }
  .shop-cart-list.fold-transition{
    transition: all 0.5s;
    transform: translate3d(0,-100%,0);
  }
  .shop-cart-list.fold-enter,.shop-cart-list.fold-leave{
    transform: translate3d(0,0,0);
  }
  .list-header{
    height:40px;
    line-height:40px;
    padding:0 15px;
    background: #ECECEE;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #eee;
    font-size:16px;
    color:#595959;
  }
  .list-header .empty{
    display: flex;
    align-items: center;
    font-size:13px;
  }
  .list-header .empty img{
    width:12px;
    height:12px;
    margin-right:5px;
  }
  .list-content{
    max-height:230px;
    overflow: hidden;
    background: #f8f8f8;
  }
  .food-content-list{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-top:1px solid #eee;
    border-bottom:1px solid #eee;
    background: #fff;
    margin-bottom:5px;
  }
  .food-content-list:last-child{
    margin-bottom:0;
  }
  .food-content-list .name{
    display: flex;
    flex-direction: column;
    width: 200px;
    margin-right:10px;
  }
  .food-content-list .name .goodsName{
    font-size:16px;
    height:22px;
    line-height:22px;
    overflow: hidden;
  }
  .food-content-list .name .goodsInfo{
    font-size:10px;
    color:#999;
    height:16px;
    line-height:16px;
    margin-top:3px;
    overflow: hidden;
  }
  .food-content-list .price{
    color:#fb4444;
    font-size:16px;
    font-weight: bold;
    margin-right:20px;
  }
  .list-footer{
    text-align: center;
    color:#666;
    font-size:12px;
    line-height:27px;
    background: #f8f8f8;
  }

  .toggle-cart-enter-active, .toggle-cart-leave-active {
    transition: all .3s ease-out;
  }
  .toggle-cart-enter, .toggle-cart-leave-active {
    transform: translateY(100%);
  }
</style>
