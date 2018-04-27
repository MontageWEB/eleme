<template>
  <div class="shops">
    <div class="header" @click="changeAddress">
      <img class="icon-location" src="../../static/images/icon/icon_location.png" alt="">
      <span>{{locationName}}></span>
    </div>

    <div class="address-select">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="item in canteens" v-bind:key="item.filterId" class="menu-item"
              :class="{'current':currentIndex===item.filterId}" @click="selectMenu(item.filterId)">
            <span class="menu-text">{{item.filterName}}</span>
          </li>
        </ul>
      </div>
      <div class="con-wrapper" ref="conWrapper">
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

    <address-school :is-show="isShowSelect" @on-close="closeSelect" @select-school="selectSchool"></address-school>

    <!--<goods-canteen :school-id="schoolId"></goods-canteen>-->

  </div>
</template>
<script>
import common from '../common/js/util.js'
import addressSchool from './address/address-school.vue'
import goodsCanteen from './shop/goods-canteen.vue'
import { Toast } from 'mint-ui'
import BScroll from 'better-scroll'
export default {
  data () {
    return {
      shops: [],
      isShowSelect: false,
      locationName: '请选择学校',
      schoolId: 0,
      filterId: 0,
      defaultSchoolId: 0,
      defaultSchoolName: '',
      canteens: [],
      currentIndex: 0
    }
  },
  created () {
    let defaultSchool = JSON.parse(localStorage.getItem('defaultSchool'))
    if (!defaultSchool) {
      this.isShowSelect = true
    } else {
      this.schoolId = defaultSchool.schoolId
      this.locationName = defaultSchool.universityName + defaultSchool.schoolName
      this.loadCanteen()
    }
  },
  methods: {
    changeAddress () {
      this.isShowSelect = true
    },
    closeSelect () {
      this.isShowSelect = false
    },
    selectSchool (value) {
      // console.log(value)
      this.schoolId = value.schoolId
      this.locationName = value.universityName + value.schoolName
      // this.loadShops()
      this.loadCanteen()
    },
    loadCanteen () {
      let that = this
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
            this.currentIndex = res.data.data[0].filterId
            this.loadShops(this.currentIndex)
            that.$nextTick(() => {
              that.initScroll()
            })
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
            that.$nextTick(() => {
              that.initScroll()
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
      this.conWrapper = new BScroll(this.$refs.conWrapper, {
        click: true
      })
    },
    selectMenu (filterId) {
      this.currentIndex = filterId
      this.loadShops(filterId)
    }
  },
  components: {
    addressSchool,
    goodsCanteen
  }
}
</script>
<style scoped>
  /*header*/
  .header{
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:44px;
    line-height:44px;
    overflow: hidden;
    color:#000;
    font-size:19px;
    font-weight: bold;
    background-color: #fff;
    text-align: center;
    border-bottom:1px solid #bbb;
  }
  .header .icon-location{
    height: 22px;
    margin-top:10px;
  }

  /*address-select*/
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
