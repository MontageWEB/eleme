<template>
  <div class="order-container pay-success" v-if="isShow">
    <div class="success-wrapper">
      <div class="success">
        <span @click="toOrderDetail">完成</span>
      </div>
      <img class="icon_success" src="../../../static/images/icon/pay@success.png" alt="">
      <div>支付成功</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    toOrderDetail () {
      this.$router.go(0)
      this.$emit('on-close')
      this.$router.push({path: '/shops'})
    }
  }
}
</script>
<style scoped>
  .success-wrapper{
    background-color: #fff;
    padding-bottom:15px;
    text-align: center;
  }
  .success{
    padding-top:15px;
    padding-right:15px;
    text-align: right;
    color:#FFD120;
  }
  .success span{
    font-size:18px;
  }
  .icon_success{
    width:80px;
    margin-top:15px;
    margin-bottom:15px;
  }
</style>
