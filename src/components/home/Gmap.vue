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
        mapOtions: {
          center: {
            lat: 52.229676,
            lng: 21.012229,
          },
          zoom: 6,
          minZoom: 3,
          maxZoom: 15,
          streetViewControl: false,
        },
      };
    },
    methods: {
      async addUsersMarker(map) {
        const users = await db.collection('users').get();
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
            marker.addListener('click', () => {
              this.$router.push({ name: 'ViewProfile', params: { id: user.id } });
            });
          }
        });
      },
      updateGeolocations({ latitude, longitude }) {
        this.mapOtions.center.lat = latitude;
        this.mapOtions.center.lng = longitude;
      },
      async updateUserDataBaseGeolocations() {
        const user = firebase.auth().currentUser;
        const snapshot = await db.collection('users')
          .where('user_id', '==', user.uid)
          .get();
        snapshot.forEach((doc) => {
          db.collection('users').doc(doc.id).update({
            geolocation: {
              lat: this.mapOtions.center.lat,
              lng: this.mapOtions.center.lng,
            },
          });
        });
      },
      async renderMap() {
        // eslint-disable-next-line
        const map = new google.maps.Map(this.$refs.map, this.mapOtions);
        await this.updateUserDataBaseGeolocations();
        this.addUsersMarker(map);
      },
    },
    mounted() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          this.updateGeolocations(coords);
          this.renderMap();
        }, (err) => {
          this.renderMap();
          throw new Error(err);
        }, { maximumAge: 60000, timeout: 3000 });
      } else {
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
