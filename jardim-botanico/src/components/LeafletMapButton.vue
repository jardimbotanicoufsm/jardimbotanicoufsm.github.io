<template>
  <q-btn class="leaflet-map-button" round :color="color" :icon="icon" :style="{ top: top, left: left }" />
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LeafletMapButton',
  props: {
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    top: {
      type: String,
      required: true,
    },
    left: {
      type: String,
      default: '10px',
    },
  },
});
</script>

<style scoped>
.leaflet-map-button {
  position: absolute;
  z-index: 1000;
}
</style>
