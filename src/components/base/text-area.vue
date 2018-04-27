<template>
  <div class="order-container text-area" v-if="isShow">
    <div class="header">
      <img src="../../../static/images/icon/back@left-black.png" class="back" @click="backBtn">
      {{areaTitle}}
    </div>
    <div class="text-wrapper">
      <textarea name="" class="area" v-model="areaInput" :placeholder="'请输入'+ areaTitle +'内容（可不填）'"></textarea>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    areaTitle: {
      type: String,
      default: ''
    },
    areaValue: {
      type: String,
      default: ''
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      areaInput: ''
    }
  },
  created () {
  },
  methods: {
    backBtn () {
      this.$emit('on-close')
      this.$emit('value-event', this.areaInput)
    }
  }
}
</script>
<style scoped>
  .text-wrapper{
    background-color: #fff;
    margin-top:55px;
    padding:15px;
  }
  .area{
    height:38px;
    line-height:20px;
    border:none;
  }
</style>
