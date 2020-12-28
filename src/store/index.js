import Vue from 'vue'
import Vuex from 'vuex'

import member from "../modules/member";
import media from "../modules/media";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    member:member,
    media:media
  },
})
