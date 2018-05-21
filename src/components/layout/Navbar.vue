<template>
  <div class="navbar">
    <nav class="deep-purple darken-1">
      <div class="container">
        <router-link :to="{ name: 'Gmap' }"
                     class="brand-logo left">GeoNinjas!
        </router-link>
        <ul class="right">
          <li v-if="!user">
            <router-link :to="{ name: 'Signup' }">SignUp!</router-link>
          </li>
          <li v-if="!user">
            <router-link :to="{ name: 'Login' }">Login</router-link>
          </li>
          <li v-if="user"><a @click.prevent="goToProfile">{{ user.email }}</a></li>
          <li v-if="user"><a @click="logout">Logout</a></li>
        </ul>
      </div>
    </nav>
  </div>
</template>
<script>
  import firebase from 'firebase';
  import db from '@/firebase/init';

  export default {
    name: 'Navbar',
    data() {
      return {
        user: null,
      };
    },
    methods: {
      async logout() {
        const user = firebase.auth().currentUser;
        if (user) {
          await firebase.auth().signOut();
          this.$router.push({ name: 'Login' });
        }
      },
      async goToProfile() {
        const users = await db.collection('users').where('user_id', '==', this.user.uid).get();
        users.forEach((user) => {
          this.$router.push({ name: 'ViewProfile', params: { id: user.id } });
        });
      },
    },
    created() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.user = user;
        } else {
          this.user = null;
        }
      });
    },
  };
</script>
