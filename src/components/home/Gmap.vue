<template>
  <div class="map">
    <div id="map"
         ref="map"
         class="google-map"></div>
  </div>
</template>

<script>
  import firebase from 'firebase';
  import db from '@/firebase/init';

  export default {
    name: 'Gmap',
    data() {
      return {
        // Warsaw
        // lat: 52.229676,
        // lng: 21.012229,
        // London
        lat: 52.229676,
        lng: -2.012229,
      };
    },
    methods: {
      renderMap() {
        // eslint-disable-next-line
        const map = new google.maps.Map(this.$refs.map, {
          center: {
            lat: this.lat,
            lng: this.lng,
          },
          zoom: 6,
          minZoom: 3,
          maxZoom: 15,
          streetViewControl: false,
        });
      },
    },
    mounted() {
      // get current user
      const user = firebase.auth().currentUser;
      if (user) {
        console.log(user);
      }
      // get user geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          this.lat = coords.latitude;
          this.lng = coords.longitude;
          // find the user record and then update goecoords
          db.collection('users').where('user_id', '==', user.uid)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                db.collection('users').doc(doc.id).update({
                  geolocation: {
                    lat: coords.latitude,
                    lng: coords.longitude,
                  }
                });
              });
            })
            .then(() => {
              this.renderMap();
            });
        }, (err) => {
          this.renderMap();
          console.log(err);
          throw new Error(err);
        }, { maximumAge: 60000, timeout: 6000 });
      } else {
        //  position center by default values
        this.renderMap();
      }
    },
  };
</script>
<style>
  .google-map {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background-color: #d3d3d3;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
</style>
