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

	<q-page-sticky position="bottom-left" :offset="[20, 20]" v-if="hikingTrailId == null && collectionItemId == null">
		<q-btn fab icon="ion-walk" color="grey" @click="this.$router.push('/hikingTrails');" />
	</q-page-sticky>
	<q-page-sticky position="bottom-left" :offset="[20, 20]" v-else>
		<q-btn fab icon="ion-arrow-round-back" color="grey" @click="this.$router.push({ name: 'Home' });" />
	</q-page-sticky>
</template>

<script>
import * as L from 'leaflet';

import 'leaflet.locatecontrol';
import 'leaflet.locatecontrol/dist/L.Control.Locate.css';

import { defineComponent } from 'vue';
import { useArraysStore } from 'stores/arrays';

export default defineComponent({
	name: 'LeafletMap',
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
			hikingTrailId: this.$route.params.hikingTrailId,
			collectionItemId: this.$route.params.collectionItemId,
		};
	},

	mounted() {
		this.createMap();

		this.initiateMarkers();
		this.initiateHikingTrail();
	},

	methods: {

		async initiateMarkers() {
			try {

				await this.arrays.loadCollection();
				this.arrays.collection.filter(colItem => colItem.latitude != null && colItem.longitude != null).forEach(colItem => {
					colItem.marker = this.createMarker(this.categories['Acervo'].color, colItem.latitude, colItem.longitude, colItem.nome, 'Outros nomes: ' + colItem.outros_nomes + '<br>' + 'Classificação: ' + colItem.classificacao + '<br>' + 'Origem: ' + colItem.origem, colItem.links);
				});

				// If we are not in a collection item page, load the points of interest
				if (this.collectionItemId == null) {
					await this.arrays.loadPointsOfInterest();
					this.arrays.pointsOfInterest.forEach(poi => {
						poi.marker = this.createMarker(this.categories[poi.categoria].color, poi.latitude, poi.longitude, poi.nome, poi.descricao, poi.links);
					});
				}

				this.filterMarkers(null);
			} catch (error) {
				this.handleReadError(error, 3);
			}
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
				zoom: 17,
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
			// If we are in a collection item page, do not display the points of interest
			if (this.collectionItemId != null)
				return;

			this.arrays.pointsOfInterest
				.filter(poi => poi.marker != null && poi.categoria == category)
				.forEach(poi => poi.marker.addTo(this.map));
		},

		displayCollectionMarkers() {
			let collection = this.arrays.collection;

			// If we are in a collection item page, filter the collection to show only the item
			if (this.collectionItemId != null)
				collection = collection.filter(colItem => colItem.id === this.collectionItemId);

			collection
				.filter(colItem => colItem.marker != null)
				.forEach(colItem => colItem.marker.addTo(this.map));

			// If we are in a collection item page, center the map on the item
			if (this.collectionItemId != null)
				this.map.setView([collection[0].latitude, collection[0].longitude], 19);
		},

		async initiateHikingTrail() {
			if (this.hikingTrailId == null)
				return;
			try {
				await this.arrays.loadHikingTrails();
				await this.arrays.loadHikingTrailPoints(this.hikingTrailId);

				var hikingTrail = this.arrays.hikingTrails.find(hikingTrail => hikingTrail.id === this.hikingTrailId);

				if (hikingTrail != null && hikingTrail.points != null && hikingTrail.points.length > 0) {
					var polyline = L.polyline(hikingTrail.points.map(point => [point.latitude, point.longitude]), { color: 'red' }).addTo(this.map);

					this.map.fitBounds(polyline.getBounds());
				}
			} catch (error) {
				this.handleReadError(error, 4);
			}
		},

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
