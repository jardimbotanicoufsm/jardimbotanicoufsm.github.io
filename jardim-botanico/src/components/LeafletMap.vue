<template>
  <div id="map"></div>

  <q-page-sticky position="top-right" :offset="[20, 20]">
    <q-btn fab icon="ion-leaf" color="green" @click="handleClick2()" />
  </q-page-sticky>
  <q-page-sticky position="top-right" :offset="[20, 90]">
    <q-btn fab icon="ion-home" color="red" @click="handleClick2()" />
  </q-page-sticky>
  <q-page-sticky position="top-right" :offset="[20, 160]">
    <q-btn fab icon="ion-flower" color="orange" @click="handleClick2()" />
  </q-page-sticky>

  <q-page-sticky position="bottom-left" :offset="[20, 20]">
    <q-btn fab icon="ion-walk" color="grey" @click="handleClick2()" />
  </q-page-sticky>
  <q-page-sticky position="bottom-right" :offset="[20, 20]">
    <q-btn fab icon="ion-camera" color="grey" @click="handleClick2()" />
  </q-page-sticky>
</template>

<script>
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { defineComponent } from 'vue';

export default defineComponent({
  mounted() {
    this.createMap();
  },
  methods: {
    createMap() {
      var map = L.map("map", {
        center: [-29.7194, -53.7295],
        zoom: 17,
        zoomControl: false
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
      }).addTo(map);
    },

    handleClick2() {
      alert('Button 2 clicked');
    },

  },
});
</script>

<style>
#map {
  height: calc(100vh - 50px);
  width: 100%;
  z-index: -1;
}
</style>
