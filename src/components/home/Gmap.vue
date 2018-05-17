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
      addUserMarker(map) {
        db.collection('users')
          .get()
          .then((users) => {
            users.forEach((user) => {
              const data = user.data();
              if (data.geolocation) {
                // eslint-disable-next-line
                const marker = new google.maps.Marker({
                  position: {
                    lat: data.geolocation.lat,
                    lng: data.geolocation.lng,
                  },
                  map,
                });
                //  add click event to marker
                marker.addListener('click', () => {
                  this.$router.push({ name: 'ViewProfile', params: { id: user.id } });
                });
              }
            });
          });
      },
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
        this.addUserMarker(map);
      },
    },
    mounted() {
      // get current user
      const user = firebase.auth().currentUser;
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
                  },
                });
              });
            })
            .then(() => {
              this.renderMap();
            });
        }, (err) => {
          this.renderMap();
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
