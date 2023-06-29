<template>
    <q-item>
        <q-item-section>
            <q-item-label>{{ nome }}</q-item-label>
            <q-item-label caption>Outros nomes: {{ outrosnomes }}</q-item-label>
            <q-item-label caption>Classificação: {{ classificacao }}</q-item-label>
            <q-item-label caption>Origem: {{ origem }}</q-item-label>
        </q-item-section>
    </q-item>
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
            required: true
        },

        origem: {
            type: String,
            required: true
        },

        outrosnomes: {
            type: String,
            required: false
        },
    }
})
</script>
  