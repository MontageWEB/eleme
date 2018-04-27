<template>
  <div class="container address-con" v-if="isShow">
    <div class="address-content">
      <div class="header">
        <img src="../../../static/images/icon/back@left-black.png" class="back" @click="backBtn">
        收货地址
      </div>
      <div class="list-wrapper">
        <ul>
          <li class="address-list" v-for="(item,index) in addressList" v-bind:key="index" @click="selectItem(item)">
            <div class="info">
              <div class="address">{{item.addressDetail}}</div>
              <div>
                <span>{{item.name}}</span>
                <span>{{item.mobile}}</span>
              </div>
            </div>
            <img src="../../../static/images/icon/icon_edit.png" alt="" class="icon_edit" @click.stop.prevent="toUpdate(item)">
          </li>
        </ul>
      </div>
      <div class="add-address" @click="toAdd">
        <img src="../../../static/images/icon/address_add.png" alt="">
        <span>添加新地址</span>
      </div>
    </div>
    <address-add :is-show="isShowAdd" @on-close="closeAdd"></address-add>
    <address-update :is-show="isShowUpdate" :updateData="updateData" @on-close="closeUpdate"></address-update>
  </div>
</template>
<script>
import common from '../../common/js/util.js'
import AddressUpdate from './address-update.vue'
import AddressAdd from './address-add.vue'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    isPage: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      addressList: [],
      isShowUpdate: false,
      isShowAdd: false,
      updateData: {}
    }
  },
  created () {
    this.loadUserAddress()
  },
  methods: {
    loadUserAddress () {
      this.axios.post(common.baseApi + '/user/getUserAddress', {
        userId: localStorage.getItem('userId')
      })
        .then((res) => {
          if (res.data.status === 200) {
            this.addressList = res.data.data
          }
        }, (err) => {
          console.log(err)
        })
    },
    backBtn () {
      this.$emit('on-close')
    },
    closeUpdate () {
      this.loadUserAddress()
      this.isShowUpdate = false
    },
    closeAdd () {
      this.loadUserAddress()
      this.isShowAdd = false
    },
    toAdd () {
      this.isShowAdd = true
    },
    toUpdate (item) {
      this.updateData = item
      this.isShowUpdate = true
      // console.log(this.updateData)
    },
    selectItem (item) {
      if (!this.isPage) {
        // localStorage.setItem('defaultAddress', JSON.stringify(item))
        this.$emit('select-item', item)
        this.$emit('on-close')
      }
    }
  },
  components: {
    AddressUpdate,
    AddressAdd
  }
}
</script>
<style scoped>
  .address-con{
    z-index:50;
    position:fixed;
    left:0;
    top:0;
    bottom:55px;
    width:100%;
  }
  .address-content{
    height: 100%;
    overflow: auto;
  }
  .list-wrapper{
    margin-top:43px;
    background-color: #fff;
    font-size:13px;
    color:#666;
  }
  .address-list{
    margin-left:10px;
    padding:15px 15px 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #F4F3F4;
  }
  .address-list:last-child{
    margin-bottom:50px;
  }
  .address-list .info{
    width:85%;
  }
  .address-list .address{
    font-size:15px;
    color:#000;
    font-weight: bold;
    line-height: 18px;
  }
  .address-list .icon_edit{
    width:20px;
    height:20px;
  }
  .add-address{
    position: fixed;
    bottom:0;
    left:0;
    width:100%;
    height:52px;
    line-height: 52px;
    background-color: #FFD120;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .add-address img{
    width:20px;
    height:20px;
    margin-right:3px;
    margin-top:15px;
  }
</style>
