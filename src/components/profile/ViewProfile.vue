<template>
  <div class="view-profile container">
    <div v-if="profile"
         class="card">
      <h2 class="deep-purple-text center">{{ profile.alias }}'s Wall</h2>
      <ul class="comments collection">
        <li v-for="(comment, index) in comments" :key="index">
          <div class="deep-purple-text">{{ comment.from }}</div>
          <div class="grey-text text-darken-2">{{ comment.content }}</div>
        </li>
      </ul>
      <form @submit.prevent="addComment">
        <div class="field">
          <label for="comment">Add a comment</label>
          <input type="text"
                 name="comment"
                 id="comment"
                 v-model="newComment">
          <p v-if="feedback"
             class="red-text center">{{ feedback }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import db from '@/firebase/init';
  import firebase from 'firebase';

  export default {
    name: 'ViewProfile',
    data() {
      return {
        users: null,
        profile: null,
        newComment: null,
        feedback: null,
        user: null,
        comments: [],
      };
    },
    methods: {
      async addComment() {
        if (this.newComment) {
          this.feedback = null;
          try {
            await db.collection('comments')
              .add({
                to: this.$route.params.id,
                from: this.user.alias,
                content: this.newComment,
                time: Date.now(),
              });
            this.newComment = null;
            // eslint-disable-next-line
          }
          catch (err) {
            this.feedback = err.message;
            throw new Error(err);
          }
          this.newComment = null;
        } else {
          this.feedback = 'Enter a comment';
        }
      },
      async setCurrentUser(ref) {
        try {
          const snapshot = await ref.where('user_id', '==', firebase.auth().currentUser.uid).get();
          snapshot.forEach((doc) => {
            this.user = doc.data();
            this.user.id = doc.id;
          });
          // eslint-disable-next-line
        }
        catch (err) {
          throw new Error(err);
        }
      },
      async setProfileData(ref) {
        const user = await ref.doc(this.$route.params.id).get();
        this.profile = user.data();
      },
      displayComments() {
        this.comments = [];
        db.collection('comments')
          .orderBy('time')
          .where('to', '==', this.$route.params.id)
          .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(({ type, doc }) => {
              if (type === 'added') {
                this.comments.unshift({
                  from: doc.data().from,
                  content: doc.data().content,
                  time: doc.data().time,
                });
              }
            });
          });
      },
    },
    beforeRouteUpdate(to, from, next) {
      this.$route.params.id = to.params.id;
      this.setProfileData(this.users);
      this.displayComments();
      next();
    },
    created() {
      const ref = db.collection('users');
      this.users = ref;
      this.setCurrentUser(ref);
      this.setProfileData(ref);
      this.displayComments();
    },
  };
</script>

<style>
  .view-profile .card {
    padding: 20px;
    margin-top: 60px;
  }

  .view-profile h2 {
    font-size: 2em;
    margin-top: 0;
  }

  .view-profile li {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
</style>
