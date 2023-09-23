<template>
    <q-list padding>
        <CollectionListItem v-for="collectionListItem in arrays.collection" v-bind="collectionListItem"
            v-bind:key="collectionListItem.nome" @collection-list-item-click="handleCollectionItemClick" />
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
    beforeMount() {
        this.arrays.loadCollection();
    },
    methods: {
        handleCollectionItemClick(collectionItemId) {
            this.$router.push({ name: 'CollectionItem', params: { hikingTrailId: null, collectionItemId: collectionItemId } });
        }

    }
})
</script>
  