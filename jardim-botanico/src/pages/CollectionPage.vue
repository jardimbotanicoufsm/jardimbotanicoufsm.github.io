<template>
    <div class="q-pl-md q-pr-md">
        <CollectionList></CollectionList>
    </div>
</template>
  
<script>
import { defineComponent } from 'vue'
import CollectionList from 'src/components/CollectionList.vue'

export default defineComponent({
    name: 'CollectionPage',
    components: {
        CollectionList
    },
    setup() {
        return {
        }
    }
})
</script>