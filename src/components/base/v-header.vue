<template>
  <div>
    <div class="header">
      <img src="../../../static/images/icon/back@left-black.png" v-if="goBack" class="back" @click="$router.go(-1)">
      <img src="../../../static/images/icon/back@left-black.png" v-else class="back" @click="backClose">
      <span v-if="headerTitle">{{headerTitle}}</span>
      <slot name="deleteBtn"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: ['headerTitle', 'goBack'],
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    backClose () {
      this.$emit('on-close')
    }
  }
}
</script>
<style scoped>
</style>
