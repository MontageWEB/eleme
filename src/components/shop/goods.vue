<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" v-bind:key="item.categoryId" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index)">
          <span class="menu-text">{{item.categoryName}}</span>
          <!--<span class="category-num" v-show="goods[index].count>0">{{goods[index].count}}</span>-->
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" v-bind:key="item.categoryId" class="food-list food-list-hook">
          <p class="category-title">
            <span class="name">{{item.categoryName}}</span>
            <span class="desc">{{item.categoryInfo}}</span>
          </p>
          <ul>
            <li v-for="food in item.goods" v-bind:key="food.goodsId" class="food-item">
              <img class="goods-img" :src="food.goodsImg">
              <div class="goods-content">
                <p class="name">{{food.goodsName}}</p>
                <p class="desc">{{food.goodsInfo}}</p>
                <div class="price">
                  <span class="now">￥{{food.goodsPrice}}</span>
                </div>
                <div class="cart-control-wrapper">
                  <cart-control :food="food" :category="item"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shop-cart :min-price="seller.minPrice" :selectFoods="selectFoods" :shop-name="shopName" :shop-id="shopId"></shop-cart>
  </div>
</template>
<script>
import common from '../../common/js/util.js'
import BScroll from 'better-scroll'
import { Toast } from 'mint-ui'
import ShopCart from '../shop/shop-cart.vue'
import CartControl from '../shop/cart-control.vue'
export default {
  data () {
    return {
      seller: {},
      shopId: 0,
      goods: [],
      listHeight: [],
      scrollY: 0,
      isOrder: false,
      shopName: ''
    }
  },
  created () {
    this.shopId = this.$route.params.shopId
    this.loadShopData()
    this.loadGoods()
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.goods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  methods: {
    loadShopData () {
      this.axios.post(common.baseApi + '/shop/getShop', {
        shopId: this.shopId
      })
        .then((res) => {
          if (res.data.status === 200) {
            this.seller = res.data.data
            this.shopName = res.data.data.shopName
          }
        }, (err) => {
          console.log(err)
        })
    },
    loadGoods () {
      let that = this
      this.axios.post(common.baseApi + '/shop/getGoods', {
        shopId: this.shopId
      })
        .then((res) => {
          if (res.data.status === 200) {
            res.data.data.forEach((good) => {
              good.count = 0
              good.goods.forEach((food) => {
                food.goodsPrice = (food.goodsPrice / 100).toFixed(2)
              })
            })
            this.goods = res.data.data
            // console.log(this.goods)
            that.$nextTick(() => {
              that.initScroll()
              that.calculateHeight()
            })
          } else {
            Toast({
              message: res.data.msg,
              duration: 1000
            })
          }
        }, (err) => {
          console.log(err)
        })
    },
    initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      })
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    calculateHeight () {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    selectMenu (index) {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300)
    }
  },
  components: {
    ShopCart,
    CartControl
  }
}
</script>
<style scoped>
  .goods{
    display: flex;
    position: absolute;
    top:162px;
    bottom:47px;
    width:100%;
    overflow: hidden;
    background-color: #fff;
  }
  /*menu-wrapper*/
  .menu-wrapper{
    flex: 0 0 80px;
    width:80px;
    background: #F5F5F5;
  }
  .menu-item{
    position:relative;
    display: table;
    width:80px;
    line-height:14px;
    padding:15px 15px;
    overflow: hidden;
    color:#999;
    text-align: center;
  }
  .menu-item.current{
    color:#000;
    background:#fff;
    /*z-index:10;*/
  }
  .menu-text{
    display: table-cell;
    width:50px;
    font-size:12px;
    vertical-align: middle;
  }
  /*foods-wrapper*/
  .foods-wrapper{
    flex:1;
  }
  .food-list{
    /*padding-bottom:500px;*/
    padding-bottom:80px;
  }
  .category-title{
    margin-left:12px;
    height:36px;
    line-height:36px;
    color:#000;
    border-bottom: 1px solid #EFEFEF;
    overflow:hidden;
  }
  .category-title .desc{
    color:#5F5F5F;
    font-size:12px;
    margin-left:4px;
  }
  .food-item{
    display: flex;
    margin:15px 12px;
    position: relative;
  }
  .goods-img{
    flex: 0 0 95px;
    width:95px;
    height:95px;
    margin-right:10px;
    border-radius: 4px;
  }
  .goods-content{
    flex:1;
  }
  .goods-content .name{
    margin: 2px 0 8px 0;
    height:18px;
    line-height:18px;
    overflow: hidden;
    color:#333;
    font-size:15px;
    font-weight: bold;
  }
  .goods-content .desc{
    height:14px;
    line-height:14px;
    overflow: hidden;
    font-size:10px;
    color:#999;
  }
  .goods-content .price{
    line-height:24px;
    color:#fb4444;
    position: absolute;
    bottom:0;
    left:102px;
  }
  .goods-content .price .now{
    font-size:16px;
    font-weight: bold;
  }
  /*cart-control-wrapper*/
  .cart-control-wrapper{
    position:absolute;
    right:0;
    bottom:3px;
  }
  .category-num{
    position:absolute;
    right:0;
    top:0;
    width:20px;
    height:20px;
    line-height:20px;
    background-color: #FFD120;
    border-radius: 50%;
    color:#000;
    text-align: center;
  }
</style>
