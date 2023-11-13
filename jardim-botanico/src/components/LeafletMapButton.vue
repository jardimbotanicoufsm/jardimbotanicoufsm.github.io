<template>
  <q-page-sticky :position="position" :offset="offset">
    <q-btn :class="active ? 'q-btn--push' : ''" fab :icon="icon" :color="color" @click="action">
      <q-tooltip>{{ tooltip }}</q-tooltip>
    </q-btn>
  </q-page-sticky>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LeafletMapButton',
  props: {
    position: {
      type: String,
      required: true,
    },
    offset: {
      type: Array,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    tooltip: {
      type: String,
      default: '',
    },
    action: {
      type: Function,
      default: () => { },
    },
  },
});
</script>