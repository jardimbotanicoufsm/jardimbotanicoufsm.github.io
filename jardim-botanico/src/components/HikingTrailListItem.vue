<template>
    <q-item @click="$emit('hiking-trail-list-item-click', id)" clickable v-ripple>
        <q-item-section>
            <q-item-label>{{ nome }}</q-item-label>
            <q-item-label caption v-if="tempo != null">Tempo: {{ tempo }}</q-item-label>
            <q-item-label caption v-if="descricao != null">Descrição: {{ descricao }}</q-item-label>
        </q-item-section>
        <q-item-section side>
            <q-icon name="ion-eye" color="orange" />
        </q-item-section>
    </q-item>
    <q-separator spaced />
</template>
  
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'HikingTrailListItem',
    props: {
        id: {
            type: Number,
            required: true
        },
        nome: {
            type: String,
            required: true
        },
        tempo: {
            type: String,
            required: false
        },
        descricao: {
            type: String,
            required: false
        },
    }
})
</script>
  