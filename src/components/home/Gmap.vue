<template>
  <div class="map">
    <div id="map"
         ref="map"
         class="google-map"></div>
  </div>
</template>

<script>
  export default {
    name: 'Gmap',
    data() {
      return {
        lat: 52,
        lng: -2,
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
      this.renderMap();
    },
  };
</script>
<style>
  .google-map {
    width: 100vh;
    height: 100vh;
    margin: 0 auto;
    background-color: #d3d3d3;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
</style>
