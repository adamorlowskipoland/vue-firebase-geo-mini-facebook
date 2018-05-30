<template>
  <div class='map'>
    <div id='map'
         ref='map'
         class='google-map'></div>
  </div>
</template>

<script>
  import firebase from 'firebase/app';
  import db from '@/firebase/init';
  import { mapMutations } from 'vuex';

  const icons = require.context('@/assets/', false, /\.png$|\.jpg$/);

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
          styles:
            [{ stylers: [{ saturation: -100 }, { gamma: 1 }] }, {
              elementType: 'labels.text.stroke',
              stylers: [{ visibility: 'off' }],
            }],
        },
      };
    },
    methods: {
      ...mapMutations([
        'togglePreLoader',
      ]),
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
            // marker.setLabel(data.alias);
            marker.addListener('click', () => {
              this.map.panTo(marker.getPosition());
              const content = `<div><p>${data.alias}</p><p>dbl click flag to Go to profile</p></div>`;
              // eslint-disable-next-line
              const tooltip = new google.maps.InfoWindow({
                content,
                maxWidth: 200,
              });
              tooltip.open(this.map, marker);
            });
            marker.addListener('dblclick', () => {
              this.$router.push({ name: 'ViewProfile', params: { id: user.id } });
            });
            this.markers.push(marker);
          }
        });
      },
      createMarker({ lat, lng }) {
        // eslint-disable-next-line
        return new google.maps.Marker({
          // eslint-disable-next-line
          animation: google.maps.Animation.DROP,
          position: {
            lat,
            lng,
          },
          icon: this.loadImg('ninja.png'),
          // icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        });
      },
      loadImg(path) {
        return path ? icons(`./${path}`) : 0;
      },
      async updateMarkers() {
        this.bounds = await this.map.getBounds();
        this.markers.forEach((marker) => {
          if (this.userInViewPort(marker) && marker.visible) {
            if (!marker.map) {
              marker.setMap(this.map);
            }
          } else if (this.userInViewPort(marker)) {
            marker.setVisible(true);
            marker.setMap(this.map);
          } else {
            marker.setVisible(false);
            marker.setMap(null);
          }
        });
      },
      userInViewPort(marker) {
        return this.bounds.contains(marker.getPosition());
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
        google.maps.event.addListener(this.map, 'idle', this.updateMarkers);
        this.togglePreLoader();
      },
    },
    mounted() {
      this.togglePreLoader();
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
