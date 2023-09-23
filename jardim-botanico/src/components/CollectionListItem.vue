<template>
    <q-item v-if="latitude != null && longitude != null" @click="$emit('collection-list-item-click', id)" clickable
        v-ripple>
        <q-item-section>
            <q-item-label>{{ nome }}</q-item-label>
            <q-item-label caption>Outros nomes: {{ outros_nomes }}</q-item-label>
            <q-item-label caption>Classificação: {{ classificacao }}</q-item-label>
            <q-item-label caption>Origem: {{ origem }}</q-item-label>
        </q-item-section>
        <q-item-section side>
            <q-icon name="ion-locate" color="green" />
        </q-item-section>
    </q-item>
    <q-item v-else>
        <q-item-section>
            <q-item-label>{{ nome }}</q-item-label>
            <q-item-label caption>Outros nomes: {{ outros_nomes }}</q-item-label>
            <q-item-label caption>Classificação: {{ classificacao }}</q-item-label>
            <q-item-label caption>Origem: {{ origem }}</q-item-label>
        </q-item-section>
    </q-item>
    <q-separator spaced />
</template>
  
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'CollectionListItem',
    props: {
        id: {
            type: Number,
            required: true
        },

        nome: {
            type: String,
            required: true
        },

        classificacao: {
            type: String,
            required: false
        },

        outros_nomes: {
            type: String,
            required: false
        },

        origem: {
            type: String,
            required: false
        },

        latitude: {
            type: String,
            required: false
        },

        longitude: {
            type: String,
            required: false
        },
    }
})
</script>
  