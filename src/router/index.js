import Vue from 'vue';
import Router from 'vue-router';
import Gmap from '@/components/home/Gmap';
import Signup from '@/components/auth/Signup';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Gmap',
      component: Gmap,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
    },
  ],
});
