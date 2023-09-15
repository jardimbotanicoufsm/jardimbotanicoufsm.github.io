<template>
	<q-page class="flex flex-center">
		<LeafletMap></LeafletMap>
	</q-page>
</template>

<script>
import { defineComponent } from 'vue'
import LeafletMap from 'src/components/LeafletMap.vue';

export default defineComponent({
	name: 'IndexPage',
	components: {
		LeafletMap
	},
})
</script>
