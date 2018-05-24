<template>
  <div class="map">
    <div id="map"
         ref="map"
         class="google-map"></div>
  </div>
</template>

<script>
  import firebase from 'firebase/app';
  import db from '@/firebase/init';

  export default {
    name: 'Gmap',
    data() {
      return {
        map: null,
        users: [],
        user: null,
        bounds: null,
        markers: [],
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
      async setUpUser() {
        this.user = await firebase.auth().currentUser;
      },
      async setUpUsers() {
        this.users = await db.collection('users').get();
      },
      updateGeolocations({ latitude, longitude }) {
        this.mapOtions.center.lat = latitude;
        this.mapOtions.center.lng = longitude;
      },
      async updateUserDataBaseGeolocations() {
        console.log(this.mapOtions.center);
        const snapshot = await db.collection('users')
          .where('user_id', '==', this.user.uid)
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
      addUsersMarker() {
        this.users.forEach((user) => {
          const data = user.data();
          if (data.geolocation) {
            const marker = this.createMarker(data.geolocation);
            marker.addListener('click', () => {
              this.$router.push({ name: 'ViewProfile', params: { id: user.id } });
            });
            this.markers.push(marker);
          }
        });
      },
      createMarker({ lat, lng }) {
        // eslint-disable-next-line
        return new google.maps.Marker({
          position: {
            lat,
            lng,
          },
        });
      },
      async updateMarkers() {
        this.bounds = await this.map.getBounds();
        const geolocation = {};
        this.markers.forEach((marker) => {
          geolocation.lat = marker.position.lat();
          geolocation.lng = marker.position.lng();
          if (this.userInViewPort(geolocation)) {
            marker.setMap(this.map);
          } else {
            marker.setMap(null);
          }
        });
      },
      userInViewPort(geolocation) {
        return this.bounds.contains(geolocation);
      },
      async renderMap() {
        // eslint-disable-next-line
        this.map = new google.maps.Map(this.$refs.map, this.mapOtions);
        this.bounds = await this.map.getBounds();
        await this.updateUserDataBaseGeolocations();
        await this.setUpUsers();
        await this.addUsersMarker();
        this.updateMarkers();
        // eslint-disable-next-line
        google.maps.event.addListener(this.map, 'bounds_changed', this.updateMarkers);
      },
    },
    mounted() {
      this.setUpUser();
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
