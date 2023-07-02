<template>
    <div class="q-pl-md q-pr-md">
        <h5>Trilhas</h5>
        <HikingTrailList></HikingTrailList>
    </div>
</template>
  
<script>
import { defineComponent } from 'vue'
import HikingTrailList from 'src/components/HikingTrailList.vue'

export default defineComponent({
    name: 'HikingTrailListPage',
    components: {
        HikingTrailList
    },
})
</script>