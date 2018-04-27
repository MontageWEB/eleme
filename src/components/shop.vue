<template>
  <div class="shop">
    <shop-header :seller="seller"></shop-header>
    <div class="tab">
      <div class="tab-item">
        <router-link class="item-link" v-bind="{to:'/shop/'+shopId+'/goods'}">点菜</router-link>
      </div>
      <div class="tab-item">
        <router-link class="item-link" v-bind="{to:'/shop/'+shopId+'/info'}">商家</router-link>
      </div>
    </div>
    <transition name="router-fade" mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
import common from '../common/js/util.js'
import { Toast } from 'mint-ui'
import ShopHeader from './shop/shop-header.vue'
export default {
  data () {
    return {
      shopId: 0,
      seller: {}
    }
  },
  created () {
    this.shopId = this.$route.params.shopId
    this.loadShopData()
  },
  methods: {
    loadShopData () {
      this.axios.post(common.baseApi + '/shop/getShop', {
        shopId: this.shopId
      })
        .then((res) => {
          if (res.data.status === 200) {
            this.seller = res.data.data
          } else if (res.data.status === 201) {
            Toast({
              message: '没有数据',
              duration: 1000
            })
          } else {
            Toast({
              message: '请求失败',
              duration: 1000
            })
          }
        }, (err) => {
          console.log(err)
          Toast({
            message: '请求失败',
            duration: 1000
          })
        })
    }
  },
  components: {
    ShopHeader
  }
}
</script>
<style scoped>
  .shop{
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    background: #F5F5F5;
    z-index: 20;
  }
  .tab{
    display: flex;
    width: 100%;
    height: 40px;
    line-height:40px;
    border-bottom:1px solid #EEE;
  }
  .tab-item{
    flex:1;
    text-align: center;
  }
  .item-link{
    display:block;
    font-weight:bold;
    color:#666;
  }
  .router-link-active{
    color: #FBBD40;
  }
</style>
