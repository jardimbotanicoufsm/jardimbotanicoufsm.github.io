<template>
	<div id="map"></div>

	<q-page-sticky position="top-right" :offset="[20, 20]">
		<q-btn fab icon="ion-leaf" color="green" @click="handleClick2()" />
	</q-page-sticky>
	<q-page-sticky position="top-right" :offset="[20, 90]">
		<q-btn fab icon="ion-home" color="red" @click="handleClick2()" />
	</q-page-sticky>
	<q-page-sticky position="top-right" :offset="[20, 160]">
		<q-btn fab icon="ion-flower" color="orange" @click="handleClick2()" />
	</q-page-sticky>

	<q-page-sticky position="bottom-left" :offset="[20, 20]">
		<q-btn fab icon="ion-walk" color="grey" @click="handleClick2()" />
	</q-page-sticky>
	<q-page-sticky position="bottom-right" :offset="[20, 20]">
		<q-btn fab icon="ion-camera" color="grey" @click="handleClick2()" />
	</q-page-sticky>
</template>

<script>
import * as L from 'leaflet';
import { defineComponent } from 'vue';
import { api } from 'boot/axios'

export default defineComponent({
	mounted() {
		var map = this.createMap();
		this.readSpreadsheet(map);
	},
	methods: {


		createMap() {

			var map = L.map("map", {
				center: [-29.7194, -53.7295],
				zoom: 17,
				zoomControl: false
			});

			L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
			}).addTo(map);

			return map;

		},

		async readSpreadsheet(map) {
			const spreadsheetId = '1-3t23mTmuvJaVK6NAN-ivBr9fbE8NGZ6RNMQPwvd_oc'; // Replace with the actual spreadsheet ID
			const apiKey = 'AIzaSyA_LT1DlQ_iArm1fGqxIK-YpjAOUSoZgZo'; // Replace with your API key

			const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/pontos?key=${apiKey}`;

			api.get(url)
				.then((response) => {
					const rows = response.data.values;
					if (rows.length === 0) {
						return;
					}

					const header = rows[0];
					const data = rows.slice(1);
					this.createPins(map, header, data);

				})
				.catch(() => {
					this.$q.notify({
						color: 'negative',
						position: 'bottom',
						message: 'Impossível carregar dados',
						icon: 'report_problem'
					});
				})
		},

		createPins(map, header, data) {
			data.forEach(row => {
				const ponto_turistico = {};
				row.forEach((value, index) => {
					ponto_turistico[header[index]] = value;
				});

				if (ponto_turistico.id == null || ponto_turistico.latitude == null || ponto_turistico.longitude == null)
					return;

				const marker = L.marker([ponto_turistico.latitude, ponto_turistico.longitude], {
					title: ponto_turistico.nome
				});

				let img = '';
				if (ponto_turistico.links != null) {
					img = `<br><img src="${ponto_turistico.links}" width="100%">`;
				}
				marker
					.bindPopup(
						`<b>${ponto_turistico.nome}</b><br>${ponto_turistico.descricao}${img}`
					)
					.openPopup();

				marker.addTo(map);
			});
		},

		handleClick2() {
			alert('Button 2 clicked');
		},

	},
});
</script>

<style>
#map {
	height: calc(100vh - 100px);
	width: 100%;
	z-index: 0;
}
</style>
