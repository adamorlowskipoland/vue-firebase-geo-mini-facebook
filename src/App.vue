<template>
  <div id="app">
    <navbar/>
    <pre-loader v-if="preLoaderShown"/>
    <router-view/>
  </div>
</template>

<script>
  import Navbar from '@/components/layout/Navbar';
  import PreLoader from '@/components/layout/PreLoader';
  import { mapState } from 'vuex';

  export default {
    name: 'App',
    components: {
      Navbar,
      PreLoader,
    },
    computed: {
      ...mapState([
        'preLoaderShown',
      ]),
    },
  };
</script>

<style>
  body {
    background-color: #ddd;
  }
</style>
