<template>
	<div id="map"></div>

	<q-page-sticky position="top-right" :offset="[20, 20]" v-if="this.hikingTrailPoints.length === 0">
		<q-btn :class="activeFilter == categorias.Coleções ? 'q-btn--push' : ''" fab icon="ion-leaf" color="green"
			@click="filterMarkers('Coleções')">
			<q-tooltip>Coleções</q-tooltip>
		</q-btn>
	</q-page-sticky>
	<q-page-sticky position="top-right" :offset="[20, 90]" v-if="this.hikingTrailPoints.length === 0">
		<q-btn :class="activeFilter == categorias.Edificações ? 'q-btn--push' : ''" fab icon="ion-home" color="red"
			@click="filterMarkers('Edificações')">
			<q-tooltip>Edificações</q-tooltip>
		</q-btn>
	</q-page-sticky>
	<q-page-sticky position="top-right" :offset="[20, 160]" v-if="this.hikingTrailPoints.length === 0">
		<q-btn :class="activeFilter == categorias.Atrativos ? 'q-btn--push' : ''" fab icon="ion-flower" color="orange"
			@click="filterMarkers('Atrativos')">
			<q-tooltip>Atrativos</q-tooltip>
		</q-btn>
	</q-page-sticky>
	<q-page-sticky position="top-right" :offset="[20, 230]"
		v-if="this.hikingTrailPoints.length === 0 && activeFilter != null">
		<q-btn fab icon="ion-close" color="grey" @click="filterMarkers(null)">
			<q-tooltip>Limpar filtros</q-tooltip>
		</q-btn>
	</q-page-sticky>

	<q-page-sticky position="bottom-left" :offset="[20, 20]">
		<q-btn fab icon="ion-walk" color="grey" @click="this.$router.push('/hikingTrails');" />
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
				Edificações: { color: 'red' },
				Coleções: { color: 'green' },
				Atrativos: { color: 'orange' },
				Trilha: { color: 'grey' },
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
					if (this.hikingTrailPoints.length === 0) {
						this.displayMarkers('Atrativos');
						this.displayMarkers('Coleções');
						this.displayMarkers('Edificações');
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
				const point = {};
				row.forEach((value, index) => {
					point[header[index]] = value;
				});

				if (point.id == null || point.latitude == null || point.longitude == null)
					return;

				point.id = parseInt(point.id);
				point.marker = this.createMarker(point);

				this.pontos.push(point);
			});
		},

		createMarker(point) {
			if (point.categoria == 'Trilha')
				return null;

			var icon = new L.Icon({
				iconUrl: `assets/img/marker-icon-2x-${this.categorias[point.categoria].color}.png`,
				shadowUrl: 'assets/img/marker-shadow.png',
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34],
				shadowSize: [41, 41]
			});

			const marker = L.marker([point.latitude, point.longitude], {
				title: point.nome,
				icon: icon
			});

			let img = '';
			if (point.links != null) {
				img = `<br> <img src="${point.links}" width="100%">`;
			}

			marker.bindPopup(`<b>${point.nome}</b><br>${point.descricao}${img}`).openPopup();

			return marker;
		},

		displayMarkers(category) {
			this.pontos.filter(ponto => ponto.categoria === category).forEach(ponto => {
				ponto.marker.addTo(this.map);
			});
		},

		displayHikingTrailMarkers() {
			this.hideMarkers();

			this.pontos.filter(ponto => this.hikingTrailPoints.includes(ponto.id)).forEach(ponto => {
				if (ponto.marker !== null) {
					ponto.marker.addTo(this.map);
				}
			});

			var trackCoordinates = this.pontos.filter(ponto => this.hikingTrailPoints.includes(ponto.id)).map(function (point) {
				return [point.latitude, point.longitude];
			});
			var polyline = L.polyline(trackCoordinates, { color: 'red' }).addTo(this.map);
			this.map.fitBounds(polyline.getBounds());
		},

		filterMarkers(category) {
			this.activeFilter = category;
			this.hideMarkers();
			if (category != null) {
				this.displayMarkers(category);
			} else {
				this.displayMarkers('Atrativos');
				this.displayMarkers('Coleções');
				this.displayMarkers('Edificações');
			}
		},

		hideMarkers() {
			this.pontos.forEach(ponto => {
				ponto.marker.remove();
			});
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
