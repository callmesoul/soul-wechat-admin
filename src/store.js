import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    wechatId: localStorage.getItem('wechatId') || null
  },
  mutations: {
    'SETWECHATID' (state, { wechatId }) {
      localStorage.setItem('wechatId', wechatId)
      state.wechatId = wechatId
    }
  },
  actions: {

  }
})
