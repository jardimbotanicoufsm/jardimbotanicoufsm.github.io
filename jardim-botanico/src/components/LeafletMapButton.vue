<template>
	<q-page-sticky :position="position" :offset="offset">
		<q-btn :push="active" round size="lg" :color="color" @click="action">
			<q-icon :name="icon" size="md" />
		</q-btn>
		<div v-if="label" class="label">
			<span>{{ label }}</span>
		</div>
	</q-page-sticky>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'LeafletMapButton',
	props: {
		position: {
			type: String,
			required: true,
		},
		offset: {
			type: Array,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		active: {
			type: Boolean,
			default: false,
		},
		label: {
			type: String,
			default: '',
		},
		action: {
			type: Function,
			default: () => { },
		},
	},
});
</script>
<style>
.label {
	text-align: center;
	margin-top: 5px;
	font-size: 10px;
	color: #616161;
}
</style>