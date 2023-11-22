<template>
	<div id="map"></div>
	<!-- Add filters -->
	<LeafletMapButton position="top-right" :offset="[20, 20]" icon="img:icons/collectionItem.svg" color="green"
		:active="activeFilter == categories.Acervo.name" tooltip="Acervo"
		:action="function () { filterMarkers('Acervo') }" />
	<LeafletMapButton position="top-right" :offset="[20, 90]" icon="img:icons/utility.svg" color="red"
		:active="activeFilter == categories.Utilidade.name" tooltip="Utilidades"
		:action="function () { filterMarkers('Utilidade') }" />
	<LeafletMapButton position="top-right" :offset="[20, 160]" icon="img:icons/attraction.svg" color="orange"
		:active="activeFilter == categories.Atrativo.name" tooltip="Atrativos"
		:action="function () { filterMarkers('Atrativo') }" />
	<!-- Remove filters -->
	<LeafletMapButton v-if="activeFilter != null" position="top-right" :offset="[20, 230]" icon="ion-close" color="grey"
		tooltip="Limpar filtros" :action="function () { filterMarkers(null) }" />

	<!-- Hiking trails -->
	<LeafletMapButton v-if="hikingTrailId == null && collectionItemId == null" position="bottom-left" :offset="[20, 20]"
		icon="img:icons/hikingTrail.svg" color="grey" tooltip="Trilhas"
		:action="function () { redirect('/hikingTrails') }" />
	<LeafletMapButton v-else position="bottom-left" :offset="[20, 20]" icon="ion-arrow-round-back" color="grey"
		tooltip="Voltar" :action="function () { redirect('/hikingTrails') }" />

	<ImageGallery v-show="false" ref="galleries" v-for="colItem in arrays.collectionWithImages" :key="colItem.id"
		:id="'colItem' + colItem.id" :images="colItem.links" />
	<ImageGallery v-show="false" ref="galleries" v-for="poi in arrays.pointsOfInterestWithImages" :key="poi.id"
		:id="'poi' + poi.id" :images="poi.links" />
</template>

<script>
import * as L from 'leaflet';

import 'leaflet.locatecontrol';
import 'leaflet.locatecontrol/dist/L.Control.Locate.css';

import ImageGallery from 'src/components/ImageGallery.vue';
import LeafletMapButton from 'src/components/LeafletMapButton.vue';

import { defineComponent } from 'vue';
import { useArraysStore } from 'stores/arrays';

export default defineComponent({
	name: 'LeafletMap',
	components: {
		ImageGallery,
		LeafletMapButton,
	},

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
					colItem.marker = this.createMarker(colItem.id, 'colItem', this.categories['Acervo'].color, colItem.latitude, colItem.longitude, colItem.nome, 'Outros nomes: ' + colItem.outros_nomes + '<br>' + 'Classificação: ' + colItem.classificacao + '<br>' + 'Origem: ' + colItem.origem, colItem.links);
				});

				// If we are not in a collection item page, load the points of interest
				if (this.collectionItemId == null) {
					await this.arrays.loadPointsOfInterest();
					this.arrays.pointsOfInterest.forEach(poi => {
						poi.marker = this.createMarker(poi.id, 'poi', this.categories[poi.categoria].color, poi.latitude, poi.longitude, poi.nome, poi.descricao, poi.links);
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
				icon: 'report_problem',
				actions: [
					{ icon: 'close', color: 'white', round: true }
				]
			});
			console.error(error);
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

		createMarker(id, type, color, latitude, longitude, name, description, links) {
			const icon = new L.Icon({ iconUrl: `assets/img/marker-icon-2x-${color}.png`, shadowUrl: 'assets/img/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
			const marker = L.marker([latitude, longitude], { title: name, icon: icon });

			const popupContent = document.createElement('div');

			if (name != null) {
				let nameElement = document.createElement('b');
				nameElement.innerHTML = name;
				popupContent.appendChild(nameElement);
				popupContent.appendChild(document.createElement('br'));
			}
			if (description != null) {
				let descriptionElement = document.createElement('span');
				descriptionElement.innerHTML = description;
				popupContent.appendChild(descriptionElement);
				popupContent.appendChild(document.createElement('br'));
			}

			for (let i = 0; i < this.$refs.galleries.length; i++) {
				if (this.$refs.galleries[i].$el.id === type + id) {
					const galleryElement = this.$refs.galleries[i].$el;
					galleryElement.style.display = 'block';

					popupContent.appendChild(galleryElement);
					break;
				}
			}

			marker.bindPopup(popupContent, { maxWidth: "auto", maxHeight: "auto", className: "leaflet-popup" }).openPopup();

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

		redirect(to) {
			this.$router.push(to);
		}
	},
});
</script>

<style>
#map {
	height: calc(100vh - 110px);
	width: 100%;
	z-index: 0;
}
</style>
