<template>
  <div class="address-select">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="item in canteens" v-bind:key="item.filterId" class="menu-item"
            :class="{'current':currentIndex===item.filterId}" @click="selectMenu(item.filterId)">
          <span class="menu-text">{{item.filterName}}</span>
        </li>
      </ul>
    </div>
    <div class="con-wrapper">
      <!--<p class="category-title">
        <span class="name">{{universityName}}</span>
      </p>-->
      <div class="con-list">
        <ul>
          <router-link v-for="item in shops" v-bind="{to:'/shop/'+item.shopId}" v-bind:key="item.shopId">
            <li class="shop-list">
              <img class="shop-img" :src="item.shopImg">
              <div class="shop-content">
                <p class="name">{{item.shopName}}</p>
                <p class="desc">{{item.shopPos}}</p>
              </div>
            </li>
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import common from '../../common/js/util.js'
import BScroll from 'better-scroll'
import { Toast } from 'mint-ui'
export default {
  props: {
    schoolId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      canteens: [],
      shops: [],
      currentIndex: 0
    }
  },
  created () {
    this.loadCanteen()
  },
  computed: {
  },
  methods: {
    loadCanteen () {
      this.axios.post(common.baseApi + '/address/getFilterBySchoolId', {
        refSchoolId: this.schoolId
      })
        .then((res) => {
          if (res.data.status === 200) {
            this.canteens = res.data.data
            if (this.canteens.length === 0) {
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
    },
    loadShops (filterId) {
      let that = this
      this.axios.post(common.baseApi + '/shop/listShop', {
        schoolId: this.schoolId,
        filterId: filterId,
        type: 1
      })
        .then((res) => {
          if (res.data.status === 200) {
            that.shops = res.data.data.list
            if (res.data.data.list.length === 0) {
              Toast({
                message: '没有数据',
                duration: 1000
              })
            }
          }
        }, (err) => {
          console.log(err)
        })
    },
    initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
    },
    selectMenu (filterId) {
      this.currentIndex = filterId
      this.loadShops(filterId)
    }
  }
}
</script>
<style scoped>
  .address-select{
    display: flex;
    position: absolute;
    top:44px;
    bottom:44px;
    width:100%;
    overflow: hidden;
    background-color: #fff;
    z-index: 10;
  }
  .header{
    border-bottom: 1px solid #F5F5F5;
  }
  /*menu-wrapper*/
  .menu-wrapper{
    flex: 0 0 80px;
    width:80px;
    background: #F5F5F5;
  }
  .menu-item{
    display: table;
    width:80px;
    line-height:14px;
    padding:15px;
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
  /*con-wrapper*/
  .con-wrapper{
    flex:1;
  }
  .category-title{
    margin-left:12px;
    height:36px;
    line-height:36px;
    color:#000;
    border-bottom: 1px solid #EFEFEF;
    overflow:hidden;
  }
  .shop-list{
    display: flex;
    border-bottom:1px solid #E8E8E8;
    padding:15px 10px;
    background-color: #fff;
  }
  .shop-img{
    width:65px;
    height:65px;
    margin-right:10px;
    border-radius: 5px;
  }
  .shop-content{
    height:65px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .shop-content .name{
    font-size:16px;
    font-weight: bold;
    color:#333;
    height:24px;
    overflow: hidden;
  }
  .shop-content .desc{
    font-size:11px;
    color:#666;
    height:20px;
    overflow: hidden;
  }
</style>
