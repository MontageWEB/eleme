<template>
  <div class="container address-update" v-if="isShow">
    <v-header header-title="修改地址" @on-close="backClose">
      <img class="delete" src="../../../static/images/icon/delete@address.png" alt="" slot="deleteBtn" @click="toDelete">
    </v-header>
    <form class="mui-input-group">
      <div class="mui-input-row">
        <label>联系人</label>
        <input type="text" class="mui-input-clear" placeholder="姓名" v-model="updateData.name">
      </div>
      <div class="mui-input-row">
        <div class="sex">
          <v-radio :selections="sexList" :nowIndex="updateData.sex" @on-change="onSexChange($event)"></v-radio>
        </div>
      </div>
      <div class="mui-input-row">
        <label>电话</label>
        <input type="text" class="mui-input-clear" placeholder="手机号码" v-model="updateData.mobile">
      </div>
      <div class="mui-input-row address-wrapper">
        <label>地址</label>
        <div class="select-address" @click="toSelectAddress">
          <span>{{updateData.addressDetail}}</span>
          <img src="../../../static/images/icon/back@right-gray.png" alt="">
        </div>
      </div>
    </form>

    <address-select :is-show="isShowSelect" @on-close="closeSelect" @select-address="selectAddress"></address-select>
    <div class="submit">
      <button type="button" class="mui-btn mui-btn-primary submit-btn" @click="doAddAddress">确定</button>
    </div>
  </div>
</template>
<script>
import common from '../../common/js/util.js'
import { MessageBox, Toast } from 'mint-ui'
import VHeader from '../base/v-header.vue'
import AddressSelect from './address-select.vue'
import VRadio from '../base/radio.vue'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    updateData: {
      type: Object,
      default () {
        return {}
      }
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
      ],
      nowIndex: 1
    }
  },
  updated () {
    // this.nowIndex = this.updateData.sex - 1
  },
  methods: {
    toDelete () {
      MessageBox.confirm('确认删除？').then(action => {
        if (action === 'confirm') {
          this.doDelete()
        }
      })
    },
    doDelete () {
      this.axios.post(common.baseApi + '/user/deleteUserAddress', {
        userAddressId: this.updateData.userAddressId
      })
        .then((res) => {
          if (res.data.status === 200) {
            Toast({
              message: '删除成功',
              duration: 1000
            })
            setTimeout(() => this.$emit('on-close'), 1000)
          }
        }, (err) => {
          console.log(err)
        })
    },
    backClose () {
      this.$emit('on-close')
    },
    closeSelect () {
      this.isShowSelect = false
    },
    toSelectAddress () {
      this.isShowSelect = true
    },
    selectAddress (value) {
      this.updateData.addressDetail = value.addressDetail
      this.updateData.buildingId = value.buildingId
    },
    onSexChange (val) {
      this.updateData.sex = val.value
      // this.nowIndex = val.value
      console.log(this.updateData.sex)
    },
    doAddAddress () {
      let para = {
        userId: localStorage.getItem('userId'),
        name: this.updateData.name,
        sex: this.updateData.sex,
        mobile: this.updateData.mobile,
        buildingId: this.updateData.buildingId,
        addressDetail: this.updateData.addressDetail,
        isDefault: this.updateData.isDefault,
        userAddressId: this.updateData.userAddressId
      }
      this.axios.post(common.baseApi + '/user/updateUserAddress', para)
        .then((res) => {
          if (res.data.status === 200) {
            Toast({
              message: '修改成功',
              duration: 1000
            })
            this.$emit('on-close')
          } else {
            Toast({
              message: '请求错误',
              duration: 1000
            })
          }
        }, (err) => {
          console.log(err)
        })
    }
  },
  components: {
    VHeader,
    AddressSelect,
    VRadio
  }
}
</script>
<style scoped>
  .header .delete{
    float:right;
    margin-top:12px;
    margin-right:15px;
    height:20px;
  }
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
