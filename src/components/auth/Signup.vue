<template>
  <div class="signup container">
    <form @submit.prevent="signup"
          class="card-panel">
      <h2 class="center deep-purple-text">Signup</h2>
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
      <div class="field">
        <label for="alias">Alias:</label>
        <input type="text"
               name="alias"
               id="alias"
               v-model="alias">
      </div>
      <p v-if="feedback"
         class="red-text center">{{ feedback }}</p>
      <div class="field center">
        <button class="btn deep-purple">Signup</button>
      </div>
    </form>
  </div>
</template>

<script>
  import slugify from 'slugify';
  import firebase from 'firebase/app';
  import 'firebase/functions';
  import 'firebase/auth';
  import db from '@/firebase/init';
  import { mapMutations } from 'vuex';

  export default {
    name: 'Signup',
    data() {
      return {
        email: null,
        password: null,
        alias: null,
        feedback: null,
        slug: null,
      };
    },
    computed: {
      filledAllInputs() {
        return !!(this.alias && this.email && this.password);
      },
    },
    methods: {
      ...mapMutations([
        'togglePreLoader',
      ]),
      signup() {
        this.togglePreLoader();
        if (this.filledAllInputs) {
          this.slug = slugify(this.alias, {
            replacement: '-',
            remove: /[$*_+~.()'"!\-:@]/g,
            lower: true,
          });
          this.verifyAlias(this.slug);
        } else {
          this.feedback = 'You must fill all fields';
          this.togglePreLoader();
        }
      },
      async verifyAlias(alias) {
        try {
          const checkAlias = await firebase.functions().httpsCallable('checkAlias');
          const { data } = await checkAlias({ slug: this.slug });
          if (!data.unique) {
            this.feedback = 'Alias alredy taken';
          } else {
            this.feedback = 'Signing in...';
            const { user } = await firebase.auth()
              .createUserWithEmailAndPassword(this.email, this.password);
            await db.collection('users')
              .doc(alias)
              .set({
                alias: this.alias,
                geolocation: null,
                user_id: user.uid,
              });
            this.$router.push({ name: 'Gmap' });
          }
          // eslint-disable-next-line
        }
        catch (err) {
          this.feedback = err.message;
          throw new Error(err);
          // eslint-disable-next-line
        }
        finally {
          this.togglePreLoader();
        }
      },
    },
  };
</script>

<style>
  .signup {
    max-width: 400px;
    margin-top: 60px;
  }

  .signup h2 {
    font-size: 2.4em;
  }

  .signup .field {
    margin-bottom: 16px;
  }
</style>
