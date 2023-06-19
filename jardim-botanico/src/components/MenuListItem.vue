<template>
  <q-item :to="link" exact clickable v-ripple>
    <q-item-section avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>{{ title }}</q-item-section>
  </q-item>
  <q-separator spaced />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MenuListItem',
  props: {
    title: {
      type: String,
      required: true
    },

    icon: {
      type: String,
      required: true
    },

    link: {
      type: String,
      required: true
    },
  }
})
</script>
