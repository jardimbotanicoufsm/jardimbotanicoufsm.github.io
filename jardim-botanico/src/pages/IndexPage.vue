<template>
  <q-page class="flex flex-center">
    <!--
    TODO:
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    >
    -->
    <LeafletMap></LeafletMap>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import LeafletMap from 'components/LeafletMap.vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    LeafletMap
  },
})
</script>
