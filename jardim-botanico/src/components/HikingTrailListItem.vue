<template>
    <q-item @click="$emit('hiking-trail-list-item-click', pontos)" clickable v-ripple>
        <q-item-section>
            <q-item-label>{{ nome }}</q-item-label>
            <q-item-label caption>Tempo: {{ tempo }}</q-item-label>
            <q-item-label caption>Descrição: {{ descricao }}</q-item-label>
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
            required: true
        },

        pontos: {
            type: Array,
            required: true
        },

        descricao: {
            type: String,
            required: false
        },

        imagens: {
            type: Array,
            required: false
        },
    }
})
</script>
  