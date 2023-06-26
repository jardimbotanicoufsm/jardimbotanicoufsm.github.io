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
	data() {
		return {
			categorias: {
				Edificações: { color: 'red', items: [] },
				Coleções: { color: 'green', items: [] },
				Atrativos: { color: 'orange', items: [] },
				Trilha: { color: 'grey', items: [] },
			}
		};
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
			const spreadsheetId = '1-3t23mTmuvJaVK6NAN-ivBr9fbE8NGZ6RNMQPwvd_oc';
			const apiKey = 'AIzaSyA_LT1DlQ_iArm1fGqxIK-YpjAOUSoZgZo';

			const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/pontos?key=${apiKey}`;

			api.get(url)
				.then((response) => {
					const rows = response.data.values;

					this.createPoints(map, rows[0], rows.slice(1));
				})
				.catch((error) => {
					this.$q.notify({
						color: 'negative',
						position: 'bottom',
						message: `Impossível carregar dados: ${error.message}`,
						icon: 'report_problem'
					});
				})
		},

		createPoints(map, header, data) {
			data.forEach(row => {
				const pontoTuristico = {};
				row.forEach((value, index) => {
					pontoTuristico[header[index]] = value;
				});

				if (pontoTuristico.id == null || pontoTuristico.latitude == null || pontoTuristico.longitude == null)
					return;

				this.categorias[pontoTuristico.categoria].items.push(pontoTuristico);
			});

			this.displayMarkers(map, this.categorias.Atrativos);
			this.displayMarkers(map, this.categorias.Coleções);
			this.displayMarkers(map, this.categorias.Edificações);
		},

		displayMarkers(map, pontosTuristicos) {
			pontosTuristicos.items.forEach(pontoTuristico => {

				var icon = new L.Icon({
					iconUrl: `assets/img/marker-icon-2x-${pontosTuristicos.color}.png`,
					shadowUrl: 'assets/img/marker-shadow.png',
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41]
				});

				const marker = L.marker([pontoTuristico.latitude, pontoTuristico.longitude], {
					title: pontoTuristico.nome,
					icon: icon
				});

				let img = '';
				if (pontoTuristico.links != null) {
					img = `< br > <img src="${pontoTuristico.links}" width="100%">`;
				}
				marker
					.bindPopup(
						`<b>${pontoTuristico.nome}</b><br>${pontoTuristico.descricao}${img}`
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
