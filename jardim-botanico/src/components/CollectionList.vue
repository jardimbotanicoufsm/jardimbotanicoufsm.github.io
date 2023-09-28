<template>
    <q-input v-model="searchQuery" label="Pesquisar" type="search" debounce="500" dense rounded bottom-slots clearable>
        <template v-slot:append>
            <q-icon name="ion-search" />
        </template>
    </q-input>
    <q-list padding>
        <CollectionListItem v-for="collectionListItem in resultQuery" v-bind="collectionListItem"
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
            searchQuery: null,
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
    },
    computed: {
        resultQuery() {
            if (this.searchQuery) {
                return this.arrays.collection.filter(colItem => {
                    return this.searchQuery
                        .toLowerCase()
                        .split(" ")
                        .every(v => colItem.nome.toLowerCase().includes(v) || colItem.outros_nomes.toLowerCase().includes(v) || colItem.classificacao.toLowerCase().includes(v) || colItem.classificacao.toLowerCase().includes(v));
                });
            } else {
                return this.arrays.collection;
            }
        }
    }
})
</script>
  