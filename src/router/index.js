import Vue from 'vue';
import Router from 'vue-router';
import Gmap from '@/components/home/Gmap';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Gmap',
      component: Gmap,
    },
  ],
});
