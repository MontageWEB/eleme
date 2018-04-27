<template>
  <div class="header">
    <div class="background">
      <img class="shop-background" :src="seller.shopImg" alt="">
    </div>
    <div class="search">
      <img src="../../../static/images/icon/back@left-white.png" class="back" @click="backBtn">
    </div>
    <div class="content-wrapper">
      <img class="shop-avatar" :src="seller.shopImg" alt="" @click="toShowImg(seller.shopImg)">
      <div class="shop-name">{{seller.shopName}}</div>
    </div>
    <transition name="fade">
      <div class="img-container" v-if="showImg" @click="showImg = false">
        <img :src="seller.shopImg">
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: ['seller'],
  data () {
    return {
      showImg: false
    }
  },
  created () {
  },
  methods: {
    backBtn () {
      this.$router.push({ path: '/shops' })
    },
    toShowImg (img) {
      this.showImg = true
    }
  }
}
</script>
<style scoped>
  .header{
    position:relative;
    color: #fff;
    background: rgba(7,17,27,0.5);
    overflow: hidden;
  }
  .content-wrapper{
    padding: 18px 10px;
  }
  .shop-avatar{
    display: inline-block;
    width:50px;
    height:50px;
    border-radius: 3px;
  }
  .shop-name{
    display: inline-block;
    font-size:19px;
    font-weight: bold;
    margin-left:10px;
    line-height:50px;
  }
  .background{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    z-index:-1;
    filter: blur(10px);
  }
  .shop-background{
    width:100%;
    height:100%;
  }
  /*search*/
  .search{
    height:35px;
    width:100%;
  }
  .back{
    float: left;
    width:10px;
    margin-top:13px;
    margin-left:16px;
  }

  /*img-container*/
  .img-container{
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background-color: rgba(0,0,0,.5);
    z-index: 100;
  }
  .img-container img{
    width:100%;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
</style>
