<template>
  <div class="chooser-component">
    <ul class="chooser-list">
      <li
        v-for="(item, index) in selections"
        v-bind:key="index"
        @click="chosenSelection(item)"
        :title="item.label"
        :class="{active:item.value === nowIndex}">
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    selections: {
      type: Array,
      default () {
        return [{
          label: 'default',
          value: 0
        }]
      }
    },
    nowIndex: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
    }
  },
  methods: {
    chosenSelection (item) {
      this.nowIndex = item.value
      this.$emit('on-change', item)
    }
  }
}
</script>

<style scoped>
  .chooser-component {
    position: relative;
    display: inline-block;
  }

  .chooser-list li {
    display: inline-block;
    border: 1px solid #e3e3e3;
    height: 25px;
    line-height: 25px;
    padding: 0 10px;
    margin-right: 5px;
    border-radius: 3px;
    text-align: center;
    cursor: pointer;
    color:#ccc;
  }

  .chooser-list li.active {
    border-color: #FFD120;
    background: #FFD120;
    color: #000;
  }
</style>
