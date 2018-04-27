<template>
  <div class="container address-add" v-show="isShow">
    <div class="header">
      <img src="../../../static/images/icon/back@left-black.png" class="back" @click="backBtn">
      添加地址
    </div>
    <form class="mui-input-group">
      <div class="mui-input-row">
        <label>联系人</label>
        <input type="text" class="mui-input-clear" placeholder="姓名" v-model="contact">
      </div>
      <div class="mui-input-row">
        <div class="sex">
          <v-radio :selections="sexList" @on-change="onSexChange($event)"></v-radio>
        </div>
      </div>
      <div class="mui-input-row">
        <label>电话</label>
        <input type="text" class="mui-input-clear" placeholder="手机号码" v-model="phone">
      </div>
      <div class="mui-input-row address-wrapper">
        <label>地址</label>
        <div class="select-address" @click="toSelectAddress">
          <span>{{addressDetail}}</span>
          <img src="../../../static/images/icon/back@right-gray.png" alt="">
        </div>
      </div>
    </form>

    <address-select :is-show="isShowSelect" @on-close="closeSelect" @select-address="selectAddress"></address-select>
    <div class="submit">
      <button type="button" class="mui-btn mui-btn-primary submit-btn" @click="tapAddAddress">确定</button>
    </div>
  </div>
</template>
<script>
import common from '../../common/js/util.js'
import { Toast } from 'mint-ui'
import AddressSelect from './address-select.vue'
import VRadio from '../base/radio.vue'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      contact: '',
      phone: '',
      errorText: '',
      isShowSelect: false,
      addressDetail: '点击选择地址',
      buildingId: 0,
      sex: 1,
      sexList: [
        {
          label: '先生',
          value: 1
        },
        {
          label: '女士',
          value: 2
        }
      ]
    }
  },
  methods: {
    backBtn () {
      this.$emit('on-close')
    },
    closeSelect () {
      this.isShowSelect = false
    },
    toSelectAddress () {
      this.isShowSelect = true
    },
    selectAddress (value) {
      this.addressDetail = value.addressDetail
      this.buildingId = value.buildingId
    },
    onSexChange (val) {
      this.sex = val.value
    },
    doAddAddress () {
      let para = {
        userId: localStorage.getItem('userId'),
        name: this.contact,
        sex: this.sex,
        mobile: this.phone,
        buildingId: this.buildingId,
        addressDetail: this.addressDetail,
        isDefault: 0
      }
      this.axios.post(common.baseApi + '/user/addUserAddress', para)
        .then((res) => {
          if (res.data.status === 200) {
            Toast({
              message: '新增成功',
              duration: 1000
            })
            this.$emit('on-close')
            this.contact = ''
            this.phone = ''
            this.buildingId = ''
            this.addressDetail = '点击选择地址'
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
    tapAddAddress () {
      if (!this.contact) {
        Toast({
          message: '请填写联系人',
          duration: 1000
        })
        return false
      }
      if (!this.phone || !/^\s*1\d{10}\s*$/.test(this.phone)) {
        Toast({
          message: '请填写正确的手机号码',
          duration: 1000
        })
        return false
      }
      if (!this.buildingId) {
        Toast({
          message: '请选择收货地址',
          duration: 1000
        })
        return false
      }
      this.doAddAddress()
    }
  },
  components: {
    AddressSelect,
    VRadio
  }
}
</script>
<style scoped>
  /*form*/
  .mui-input-group{
    margin-top:55px;
    font-size:15px;
  }
  .mui-input-group input{
    font-size:15px;
    color:#ccc;
    height: 48px;
  }
  input::-webkit-input-placeholder{
    color: #ccc;
  }
  .mui-input-group:before, .mui-input-group:after{
    height:0;
  }

  /*input-group*/
  .mui-input-group .mui-input-row{
    height:48px;
  }

  /*label*/
  .mui-input-row label{
    width:88px;
    padding: 0 15px;
    line-height: 48px;
  }

  .mui-input-row label ~ input, .mui-input-row label ~ select, .mui-input-row label ~ textarea{
    width:75%;
  }

  .mui-input-row .sex{
    line-height: 44px;
    margin-left:99px;
  }

  /*button*/
  .mui-input-group .mui-button-row{
    height:100%;
    margin-left: 15px;
    padding-top: 19px;
  }

  input[type='submit'], .mui-btn-primary, .mui-btn-blue{
    border-color:#FBBD40;
    background-color: #FBBD40;
  }

  .submit{
    padding:120px 15px 0;
  }

  .submit-btn{
    width:100%;
    color:#000;
    font-size:16px;
    height:44px;
    box-sizing:border-box;
  }

  /*validate*/
  .errorText{
    margin-top: 15px;
    text-align:center;
    color: darkred;
  }
  .select-address{
    height:100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right:15px;
    color:#ccc;
  }
  .select-address span{
    margin-left:10px;
  }
  .select-address img{
    height:15px;
  }
</style>
