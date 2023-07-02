<template>
	<div id="map"></div>

	<q-page-sticky position="top-right" :offset="[20, 20]">
		<q-btn :class="activeFilter == categorias.Coleções ? 'q-btn--push' : ''" fab icon="ion-leaf" color="green"
			@click="filterMarkers(this.categorias.Coleções)">
			<q-tooltip>Coleções</q-tooltip>
		</q-btn>
	</q-page-sticky>
	<q-page-sticky position="top-right" :offset="[20, 90]">
		<q-btn :class="activeFilter == categorias.Edificações ? 'q-btn--push' : ''" fab icon="ion-home" color="red"
			@click="filterMarkers(this.categorias.Edificações)">
			<q-tooltip>Edificações</q-tooltip>
		</q-btn>
	</q-page-sticky>
	<q-page-sticky position="top-right" :offset="[20, 160]">
		<q-btn :class="activeFilter == categorias.Atrativos ? 'q-btn--push' : ''" fab icon="ion-flower" color="orange"
			@click="filterMarkers(this.categorias.Atrativos)">
			<q-tooltip>Atrativos</q-tooltip>
		</q-btn>
	</q-page-sticky>
	<q-page-sticky position="top-right" :offset="[20, 230]" v-if="activeFilter != null">
		<q-btn fab icon="ion-close" color="grey" @click="filterMarkers(null)">
			<q-tooltip>Limpar filtros</q-tooltip>
		</q-btn>
	</q-page-sticky>

	<q-page-sticky position="bottom-left" :offset="[20, 20]">
		<q-btn fab icon="ion-walk" color="grey" @click="handleHikingTrailsClick()" />
	</q-page-sticky>
	<q-page-sticky position="bottom-right" :offset="[20, 20]">
		<q-btn fab icon="ion-camera" color="grey" @click="handleClick()" />
	</q-page-sticky>
</template>

<script>
import * as L from 'leaflet';

import 'leaflet.locatecontrol';
import 'leaflet.locatecontrol/dist/L.Control.Locate.css';

import { defineComponent } from 'vue';
import { api } from 'boot/axios'

export default defineComponent({
	mounted() {
		const hikingTrailPointsParam = this.$route.params.hikingTrailPoints;
		if (hikingTrailPointsParam) {
			this.hikingTrailPoints = JSON.parse(hikingTrailPointsParam);
		}
		this.createMap();
		this.readSpreadsheet();
	},

	data() {
		return {
			activeFilter: null,
			map: null,
			hikingTrailPoints: [],
			pontos: [],
			categorias: {
				Edificações: { color: 'red', markers: [] },
				Coleções: { color: 'green', markers: [] },
				Atrativos: { color: 'orange', markers: [] },
				Trilha: { color: 'grey', markers: [] },
			}
		};
	},

	methods: {

		createMap() {
			var map = L.map("map", {
				center: [-29.7194, -53.7295],
				zoom: 17
			});

			L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
			}).addTo(map);

			L.control.locate({
				locateOptions: {
					enableHighAccuracy: true
				}
			}).addTo(map);

			this.map = map;
		},

		readSpreadsheet() {
			// SpreadsheetId of altered copy
			const spreadsheetId = '1SELKTKPVt44lT-Go6mOJ9L43viJ2GXC9aco19VEf2A4';

			// Original spreadsheetId
			//const spreadsheetId = '1-3t23mTmuvJaVK6NAN-ivBr9fbE8NGZ6RNMQPwvd_oc';

			const apiKey = 'AIzaSyA_LT1DlQ_iArm1fGqxIK-YpjAOUSoZgZo';

			const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/pontos?key=${apiKey}`;
			api.get(url)
				.then((response) => {
					const rows = response.data.values;

					this.createPoints(rows[0], rows.slice(1));
					this.createMarkers();
					if (this.hikingTrailPoints.length === 0) {
						this.displayMarkers(this.categorias.Atrativos);
						this.displayMarkers(this.categorias.Coleções);
						this.displayMarkers(this.categorias.Edificações);
					} else {
						this.displayHikingTrailMarkers();
					}
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

		createPoints(header, data) {
			data.forEach(row => {
				const pontoTuristico = {};
				row.forEach((value, index) => {
					pontoTuristico[header[index]] = value;
				});

				if (pontoTuristico.id == null || pontoTuristico.latitude == null || pontoTuristico.longitude == null)
					return;

				pontoTuristico.id = parseInt(pontoTuristico.id);

				this.pontos.push(pontoTuristico);
			});
		},

		createMarkers() {
			this.pontos.forEach(ponto => {
				if (ponto.categoria == 'Trilha')
					return;

				var icon = new L.Icon({
					iconUrl: `assets/img/marker-icon-2x-${this.categorias[ponto.categoria].color}.png`,
					shadowUrl: 'assets/img/marker-shadow.png',
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41]
				});

				const marker = L.marker([ponto.latitude, ponto.longitude], {
					title: ponto.nome,
					icon: icon
				});

				let img = '';
				if (ponto.links != null) {
					img = `<br> <img src="${ponto.links}" width="100%">`;
				}
				marker.bindPopup(`<b>${ponto.nome}</b><br>${ponto.descricao}${img}`).openPopup();

				this.categorias[ponto.categoria].markers.push(marker);
			});
		},

		displayMarkers(category) {
			category.markers.forEach(marker => {
				marker.addTo(this.map);
			});
		},

		displayHikingTrailMarkers() {
			this.hideMarkers();

			this.pontos.filter(ponto => this.hikingTrailPoints.includes(ponto.id)).forEach(ponto => {
				var icon = new L.Icon({
					iconUrl: `assets/img/marker-icon-2x-${this.categorias[ponto.categoria].color}.png`,
					shadowUrl: 'assets/img/marker-shadow.png',
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41]
				});

				const marker = L.marker([ponto.latitude, ponto.longitude], {
					title: ponto.nome,
					icon: icon
				});

				let img = '';
				if (ponto.links != null) {
					img = `<br> <img src="${ponto.links}" width="100%">`;
				}
				marker.bindPopup(`<b>${ponto.nome}</b><br>${ponto.descricao}${img}`).openPopup();

				this.categorias.Trilha.markers.push(marker);
			});

			var trackCoordinates = this.pontos.filter(ponto => this.hikingTrailPoints.includes(ponto.id)).map(function (point) {
				return [point.latitude, point.longitude];
			});

			var polyline = L.polyline(trackCoordinates, { color: 'red' }).addTo(this.map);

			// zoom the map to the polyline
			this.map.fitBounds(polyline.getBounds());

			this.displayMarkers(this.categorias.Trilha);
		},

		filterMarkers(category) {
			this.activeFilter = category;
			this.hideMarkers();
			if (category != null) {
				this.displayMarkers(category);
			} else {
				this.displayMarkers(this.categorias.Atrativos);
				this.displayMarkers(this.categorias.Coleções);
				this.displayMarkers(this.categorias.Edificações);
			}
		},

		hideMarkers() {
			this.categorias.Atrativos.markers.forEach(marker => {
				marker.remove();
			});
			this.categorias.Coleções.markers.forEach(marker => {
				marker.remove();
			});
			this.categorias.Edificações.markers.forEach(marker => {
				marker.remove();
			});
			this.categorias.Trilha.markers.forEach(marker => {
				marker.remove();
			});
		},

		handleClick() {
			alert('Button 2 clicked');
		},

		handleHikingTrailsClick() {
			this.$router.push('/hikingTrails');
		}
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
