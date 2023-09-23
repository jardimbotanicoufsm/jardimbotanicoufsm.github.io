<template>
    <q-list padding>
        <HikingTrailListItem v-for="hikingTrailListItem in arrays.hikingTrails" v-bind="hikingTrailListItem"
            v-bind:key="hikingTrailListItem.nome" @hiking-trail-list-item-click="handleHikingTrailClick" />
    </q-list>
</template>
  
<script>
import { defineComponent } from 'vue'
import { useArraysStore } from 'stores/arrays';

import HikingTrailListItem from 'src/components/HikingTrailListItem.vue'

export default defineComponent({
    name: 'HikingTrailList',
    components: {
        HikingTrailListItem
    },
    data() {
        return {
            arrays: useArraysStore(),
        }
    },
    beforeMount() {
        this.arrays.loadHikingTrails();
    },
    methods: {
        handleHikingTrailClick(hikingTrailId) {
            this.$router.push({ name: 'HikingTrail', params: { hikingTrailId: hikingTrailId, collectionItemId: null } });
        }

    }
})
</script>
  