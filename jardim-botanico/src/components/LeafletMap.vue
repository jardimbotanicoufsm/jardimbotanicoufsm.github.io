<template>
	<div id="map"></div>

	<q-page-sticky position="top-right" :offset="[20, 20]">
		<q-btn :class="activeFilter == categories.Acervo.name ? 'q-btn--push' : ''" fab icon="ion-leaf" color="green"
			@click="filterMarkers('Acervo')">
			<q-tooltip>Acervo</q-tooltip>
		</q-btn>
	</q-page-sticky>
	<q-page-sticky position="top-right" :offset="[20, 90]">
		<q-btn :class="activeFilter == categories.Utilidade.name ? 'q-btn--push' : ''" fab icon="ion-home" color="red"
			@click="filterMarkers('Utilidade')">
			<q-tooltip>Utilidades</q-tooltip>
		</q-btn>
	</q-page-sticky>
	<q-page-sticky position="top-right" :offset="[20, 160]">
		<q-btn :class="activeFilter == categories.Atrativo.name ? 'q-btn--push' : ''" fab icon="ion-flower" color="orange"
			@click="filterMarkers('Atrativo')">
			<q-tooltip>Atrativos</q-tooltip>
		</q-btn>
	</q-page-sticky>
	<!--Unselect filter-->
	<q-page-sticky position="top-right" :offset="[20, 230]" v-if="activeFilter != null">
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
import { useArraysStore } from 'stores/arrays';

export default defineComponent({

	data() {
		return {
			activeFilter: null,
			map: null,
			categories: {
				Utilidade: { name: 'Utilidade', color: 'red' },
				Atrativo: { name: 'Atrativo', color: 'orange' },
				Acervo: { name: 'Acervo', color: 'green' },
			},
			arrays: useArraysStore(),
		};
	},

	mounted() {
		const hikingTrailPointsParam = this.$route.params.hikingTrailPoints;
		if (hikingTrailPointsParam) {
			this.hikingTrailPoints = JSON.parse(hikingTrailPointsParam);
		}
		this.createMap();

		this.initiateMarkers();
	},

	methods: {

		async initiateMarkers() {
			try {
				await this.arrays.loadPointsOfInterest();
				await this.arrays.loadCollection();
			} catch (error) {
				this.handleReadError(error, 3);
			}

			this.arrays.pointsOfInterest.forEach(poi => {
				poi.marker = this.createMarker(this.categories[poi.categoria].color,
					poi.latitude,
					poi.longitude,
					poi.nome,
					poi.descricao,
					poi.links
				);
			});
			this.arrays.collection.filter(colItem => colItem.latitude != null && colItem.longitude != null).forEach(colItem => {
				colItem.marker = this.createMarker(this.categories['Acervo'].color,
					colItem.latitude,
					colItem.longitude,
					colItem.nome,
					'Outros nomes: ' + colItem.outros_nomes + '<br>' + 'Classificação: ' + colItem.classificacao + '<br>' + 'Origem: ' + colItem.origem,
					colItem.links
				);
			});

			this.filterMarkers(null);
		},

		handleReadError(error, code) {
			this.$q.notify({
				color: 'negative',
				position: 'bottom',
				message: `Impossível carregar dados (${code}): ${error.message}`,
				icon: 'report_problem'
			});
		},

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

		createMarker(color, latitude, longitude, name, description, links) {
			const icon = new L.Icon({ iconUrl: `assets/img/marker-icon-2x-${color}.png`, shadowUrl: 'assets/img/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
			const marker = L.marker([latitude, longitude], { title: name, icon: icon });

			let htmlName = '';
			if (name != null) {
				htmlName = `<b>${name}</b><br>`;
			}
			let htmlDescription = '';
			if (description != null) {
				htmlDescription = `${description}<br>`;
			}
			let htmlImg = '';
			if (links != null) {
				links.forEach(link => {
					htmlImg += `<img src="${link}" width="100%">`;
				});
			}

			marker.bindPopup(`${htmlName}${htmlDescription}${htmlImg}`).openPopup();

			return marker;
		},

		displayPoiMarkers(category) {
			this.arrays.pointsOfInterest
				.filter(poi => poi.marker != null && poi.categoria == category)
				.forEach(poi => poi.marker.addTo(this.map));
		},

		displayCollectionMarkers() {
			this.arrays.collection
				.filter(colItem => colItem.marker != null)
				.forEach(colItem => colItem.marker.addTo(this.map));
		},
		/*
				displayHikingTrailMarkers() {
					this.hideMarkers();
		
					this.points.filter(point => this.hikingTrailPoints.includes(point.id)).forEach(point => {
						if (point.marker !== null) {
							point.marker.addTo(this.map);
						}
					});
		
					var trackCoordinates = this.hikingTrailPoints
						.map(pointId => this.points.find(point => point.id === pointId))
						.filter(point => point !== undefined)
						.map(point => [point.latitude, point.longitude]);
		
					var polyline = L.polyline(trackCoordinates, { color: 'red' }).addTo(this.map);
					this.map.fitBounds(polyline.getBounds());
				},
		*/

		filterMarkers(category) {
			this.activeFilter = category;
			this.hideMarkers();
			if (category != null) {
				if (category === 'Acervo') {
					this.displayCollectionMarkers();
				} else {
					this.displayPoiMarkers(category);
				}
			} else {
				this.displayPoiMarkers('Atrativo');
				this.displayPoiMarkers('Utilidade');
				this.displayCollectionMarkers();
			}
		},

		hideMarkers() {
			this.arrays.pointsOfInterest
				.filter(colItem => colItem.marker != null)
				.forEach(poi => poi.marker.remove());
			this.arrays.collection
				.filter(colItem => colItem.marker != null)
				.forEach(colItem => colItem.marker.remove());
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
