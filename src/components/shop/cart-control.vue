<template>
  <div class="cart-control">
    <div class="con cart-decrease" v-show="food.count>0" @click="decreaseCart">
      <span class="inner icon icon-decrease"></span>
    </div>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="con cart-add" @click="addCart">
      <span class="icon icon-add"></span>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  props: {
    food: {
      type: Object
    },
    category: {
      type: Object
    }
  },
  created () {
    // console.log(this.food)
  },
  methods: {
    addCart () {
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      this.category.count++
    },
    decreaseCart () {
      this.food.count--
      this.category.count--
    }
  }
}
</script>
<style scoped>
  .cart-control{
    display: flex;
  }
  .cart-control .icon{
    display: inline-block;
    width:22px;
    height:22px;
    background-size:22px 22px;
    background-repeat:no-repeat;
  }
  .cart-count{
    margin:0 14px;
  }
  .icon-decrease{
    background:url('../../../static/images/icon/cart@decs.png');
  }
  .icon-add{
    background:url('../../../static/images/icon/cart@add.png');
  }
</style>
