import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    preLoaderShown: false,
  },
  actions: {},
  mutations: {
    togglePreLoader(state) {
      state.preLoaderShown = !state.preLoaderShown;
    },
  },
  getters: {},
  modules: {},
});
export default store;
