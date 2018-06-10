// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';
import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

let app = null;

// wait for firebase auth before creating the app
firebase.auth().onAuthStateChanged(() => {
  // init app if not already created
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      store,
      components: { App },
      template: '<App/>',
    });
  }
});
