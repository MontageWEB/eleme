import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    boxPrice: ''
  },
  mutations: {
    newBoxPrice (state, msg) {
      state.boxPrice = msg
    }
  }
})
export default store
