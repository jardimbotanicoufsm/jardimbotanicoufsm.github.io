<template>
	<q-layout view="lHh Lpr lFf">

		<q-header elevated>
			<q-toolbar>
				<q-avatar>
					<img src="assets/img/jbsm-negative-180x180.png">
				</q-avatar>
				<q-toolbar-title>
					<text class="myriad-pro-regular">Jardim Botânico</text> <text class="zapf-humnst-regular">UFSM</text>
				</q-toolbar-title>
				<q-btn @click="refreshPage" flat round color="white" icon="ion-refresh" />
			</q-toolbar>
		</q-header>

		<q-footer elevated>
			<q-tabs switch-indicator>
				<q-route-tab name="acervo" exact to="/collection">
					<q-icon name="img:assets/icons/collectionItem.svg" size="md" />
				</q-route-tab>
				<q-route-tab name="map" exact to="/">
					<q-icon name="img:assets/icons/map.svg" size="md" />
				</q-route-tab>
				<q-route-tab name="about" exact to="/about">
					<q-icon name="img:assets/icons/about.svg" size="md" />
				</q-route-tab>
			</q-tabs>
		</q-footer>

		<q-page-container>
			<router-view :key="$route.fullPath" />
		</q-page-container>
	</q-layout>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'MainLayout',
	methods: {
		refreshPage() {
			location.reload(true);
		},
	},
})
</script>

<style>
.q-header {
	height: 50px
}

.q-footer {
	height: 60px
}
</style>

