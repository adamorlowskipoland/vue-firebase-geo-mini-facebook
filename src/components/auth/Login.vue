<template>
  <div class="login container">
    <form @submit.prevent="login"
          class="card-panel">
      <h2 class="center deep-purple-text">Login</h2>
      <div class="field">
        <label for="email">Email:</label>
        <input type="email"
               name="email"
               id="email"
               v-model="email">
      </div>
      <div class="field">
        <label for="password">Password:</label>
        <input type="password"
               name="password"
               id="password"
               v-model="password">
      </div>
      <p v-if="feedback"
         class="red-text center">{{ feedback }}</p>
      <div class="field">
        <button class="btn deep-purple">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
  import firebase from 'firebase';

  export default {
    name: 'Login',
    data() {
      return {
        email: null,
        password: null,
        feedback: null,
      };
    },
    computed: {
      filledAllInputs() {
        return !!(this.email && this.password);
      },
    },
    methods: {
      login() {
        if (this.filledAllInputs) {
          firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            .then(({ user }) => {
              console.log(user);
              this.$router.push({ name: 'Gmap' });
            })
            .catch((err) => {
              this.feedback = err.message;
              throw new Error(err);
            });
          this.feedback = null;
        } else {
          this.feedback = 'Please fill both fields';
        }
      },
    },
  };
</script>

<style>
  .login {
    max-width: 400px;
    margin-top: 60px;
  }

  .login h2 {
    font-size: 2.4em;
  }

  .login .field {
    margin-bottom: 16px;
  }
</style>
