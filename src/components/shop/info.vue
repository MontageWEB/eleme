<template>
  <div class="shop-info">
    <div class="con info">
      <div>商家信息</div>
      <img class="shop-img" :src="seller.shopImg" alt="">
    </div>
    <div class="con shop-detail">
      <div class="item">
        <span class="name">商家名称</span>
        <span class="desc">{{seller.shopName}}</span>
      </div>
      <div class="item">
        <span class="address">商家地址</span>
        <span class="desc">{{seller.shopPos}}</span>
      </div>
      <div class="item">
        <span class="phone">商家电话</span>
        <span class="desc">{{seller.shopPhone}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import common from '../../common/js/util.js'
export default {
  data () {
    return {
      seller: {},
      shopId: 0
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
          }
        }, (err) => {
          console.log(err)
        })
    }
  }
}
</script>
<style scoped>
  .shop-info{
    font-size:15px;
  }
  .shop-info .con{
    background-color: #fff;
    padding-left:15px;
  }
  .info{
    font-weight: bold;
    padding-top:18px;
    padding-bottom:12px;
  }
  .shop-img{
    width:76px;
    height:76px;
    margin:15px 0 12px;
  }
  .shop-detail{
    margin-top:15px;
    padding-right:15px;
  }
  .item{
    min-height:44px;
    border-bottom: 1px solid #F5F6F5;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .item .desc{
    width:70%;
    text-align: right;
    font-size: 13px;
    color:#5D5D5D;
  }
</style>
