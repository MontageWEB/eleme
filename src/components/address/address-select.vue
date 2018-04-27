<template>
  <div class="container address-select" v-show="isShow">
    <div class="header">
      <img src="../../../static/images/icon/back@left-black.png" class="back" @click="backBtn">
      选择地址
    </div>
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="item in schools" v-bind:key="item.schoolId" class="menu-item"
            :class="{'current':currentIndex===item.schoolId}" @click="selectMenu(item.schoolId)">
          <span class="menu-text">{{item.universityName}}{{item.schoolName}}</span>
        </li>
      </ul>
    </div>
    <div class="con-wrapper">
      <p class="category-title">
        <span class="name">{{universityName}}</span>
      </p>
      <div class="con-list">
        <ul>
          <li v-for="item in buildings" v-bind:key="item.buildingId">
            <mt-button type="default" class="list-item" @click="selectAddress(item)">{{item.buildingName}}</mt-button>
          </li>
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
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      schools: [],
      buildings: [],
      currentIndex: 0
    }
  },
  created () {
    this.loadSchools()
  },
  computed: {
    universityName () {
      let schoolName = ''
      this.schools.forEach((school) => {
        if (school.schoolId === this.currentIndex) {
          schoolName = school.universityName + school.schoolName
        }
      })
      return schoolName
    }
  },
  methods: {
    backBtn () {
      this.$emit('on-close')
    },
    loadSchools () {
      let that = this
      this.axios.post(common.baseApi + '/address/listSchool', {
      })
        .then((res) => {
          if (res.data.status === 200) {
            this.schools = res.data.data
            this.currentIndex = res.data.data[0].schoolId
            that.loadBuildingsBySchool(this.currentIndex)
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
    loadBuildingsBySchool (schoolId) {
      this.axios.post(common.baseApi + '/address/getBuildingBySchoolId', {
        schoolId: schoolId
      })
        .then((res) => {
          if (res.data.status === 200) {
            this.buildings = res.data.data
            if (this.buildings.length === 0) {
              Toast({
                message: '没有学校数据',
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
    initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
    },
    selectMenu (schoolId) {
      this.currentIndex = schoolId
      this.loadBuildingsBySchool(schoolId)
    },
    selectAddress (item) {
      let addressObj = {}
      addressObj.schoolId = item.schoolId
      addressObj.universityName = this.universityName
      addressObj.addressDetail = this.universityName + item.buildingName
      addressObj.buildingId = item.buildingId
      localStorage.setItem('defaultSchool', JSON.stringify(addressObj))
      this.$emit('select-address', addressObj)
      this.$emit('on-close')
    }
  }
}
</script>
<style scoped>
  .address-select{
    display: flex;
    position: absolute;
    top:44px;
    bottom:0;
    width:100%;
    overflow: hidden;
    background-color: #fff;
    z-index: 40;
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
  .con-list{
    margin-left:12px;
  }
  .con-list ul{
    margin-top:20px;
    display: flex;
    flex-wrap: wrap;
  }
  .list-item{
    width:80px;
    height:42px;
    line-height:42px;
    border: 1px solid #C5C5C5;
    border-radius: 5px;
    margin-right:10px;
    margin-bottom:10px;
    text-align: center;
    overflow: hidden;
    background-color: #fff;
    font-size:14px;
    color:#000;
    padding:0;
  }
</style>
