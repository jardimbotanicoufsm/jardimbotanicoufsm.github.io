<template>
    <q-list bordered separator>
        <CollectionListItem v-for="collectionListItem in arrays.collection" v-bind="collectionListItem"
            v-bind:key="collectionListItem.nome" />
    </q-list>
</template>
  
<script>
import { defineComponent } from 'vue';
import { useArraysStore } from 'stores/arrays';

import CollectionListItem from 'src/components/CollectionListItem.vue';

export default defineComponent({
    name: 'CollectionList',
    components: {
        CollectionListItem
    },
    data() {
        return {
            arrays: useArraysStore(),
        }
    },
})
</script>
  