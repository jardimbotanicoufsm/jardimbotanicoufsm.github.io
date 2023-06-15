<template>
  <div id="map"></div>
</template>

<script>
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  mounted() {
    this.$nextTick(() => {
      this.createMap();
    });
  },
  methods: {
    createMap() {
      const map = L.map('map').setView([51.505, -0.09], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Add other map-related code here, such as markers, popups, etc.
    },
  },
};
</script>

<style>
#map {
  height: 100vh;
  width: 100%;
}
</style>
