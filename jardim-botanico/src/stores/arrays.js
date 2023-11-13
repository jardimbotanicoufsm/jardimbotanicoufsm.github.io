import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useArraysStore = defineStore('arrays', {
	state: () => ({
		pointsOfInterest: [],
		pointsOfInterestLoaded: false,
		collection: [],
		collectionLoaded: false,
		hikingTrails: [],
		hikingTrailsLoaded: false,
	}),

	getters: {
		pointsOfInterestWithImages() {
			return this.pointsOfInterest.filter(poi => poi.links != null && poi.links.length > 0);
		},
		collectionWithImages() {
			return this.collection.filter(colItem => colItem.links != null && colItem.links.length > 0);
		}
	},

	actions: {
		addToPointsOfInterest(item) {
			this.pointsOfInterest.push(item);
		},

		addToCollection(item) {
			this.collection.push(item);
		},

		addToHikingTrails(item) {
			this.hikingTrails.push(item);
		},

		async loadPointsOfInterest() {
			if (this.pointsOfInterestLoaded === true)
				return;

			const pointsOfInterest = await this.readSheet('pontos_interesse');
			this.handlePointOfInterestSpreadsheetData(pointsOfInterest);
			this.pointsOfInterestLoaded = true;
		},

		async loadCollection() {
			if (this.collectionLoaded === true)
				return;

			const collection = await this.readSheet('acervo');
			this.handleCollectionSpreadsheetData(collection);
			this.collectionLoaded = true;
		},

		async loadHikingTrails() {
			if (this.hikingTrailsLoaded === true)
				return;

			const hikingTrails = await this.readSheet('trilhas');
			this.handleHikingTrailsSpreadsheetData(hikingTrails);
			this.hikingTrailsLoaded = true;
		},

		async loadHikingTrailPoints(hikingTraildId) {
			if (hikingTraildId == null)
				return;

			var hikingTrail = this.hikingTrails.find(hikingTrail => hikingTrail.id === hikingTraildId);

			if (hikingTrail == null || hikingTrail.pointsLoaded === true)
				return;

			const hikingTrailPoints = await this.readSheet('pontos_trilha');
			this.handleHikingTrailPointsSpreadsheetData(hikingTrail, hikingTrailPoints);
			hikingTrail.pointsLoaded = true;
		},

		async readSheet(sheetName) {
			const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.VUE_APP_SPREADSHEET_ID}/values/${sheetName}?key=${process.env.VUE_APP_API_KEY}`;
			const response = await api.get(url);

			if (response.data && response.data.values) {
				return response.data.values;
			} else {
				return [];
			}
		},

		handlePointOfInterestSpreadsheetData(data) {
			const header = data[0];
			const body = data.slice(1);

			body.forEach(row => {
				const poi = {};
				row.forEach((value, index) => {
					poi[header[index]] = value;
				});
				if (poi.id == null || poi.categoria == null || poi.nome == null || poi.latitude == null || poi.longitude == null)
					return;

				poi.links = this.handleLinks(poi.generic_links, poi.drive_links);

				this.addToPointsOfInterest(poi);
			});
		},

		handleCollectionSpreadsheetData(data) {
			const header = data[0];
			const body = data.slice(1);

			body.forEach(row => {
				const colItem = {};
				row.forEach((value, index) => {
					colItem[header[index]] = value;
				});
				if (colItem.id == null || colItem.nome == null)
					return;

				colItem.links = this.handleLinks(colItem.generic_links, colItem.drive_links);

				this.addToCollection(colItem);
			});
		},

		handleHikingTrailsSpreadsheetData(data) {
			const header = data[0];
			const body = data.slice(1);

			body.forEach(row => {
				const hikingTrail = {};
				row.forEach((value, index) => {
					hikingTrail[header[index]] = value;
				});
				if (hikingTrail.id == null || hikingTrail.nome == null)
					return;

				hikingTrail.pointsLoaded = false;
				hikingTrail.points = [];

				this.addToHikingTrails(hikingTrail);
			});
		},

		handleHikingTrailPointsSpreadsheetData(hikingTrail, data) {
			const header = data[0];
			const body = data.slice(1);

			body.forEach(row => {
				const hikingTrailPoint = {};
				row.forEach((value, index) => {
					hikingTrailPoint[header[index]] = value;
				});
				if ([hikingTrailPoint.trilha_id, hikingTrailPoint.latitude, hikingTrailPoint.longitude, hikingTrailPoint.ordem].some(value => value == null))
					return;
				if (hikingTrailPoint.trilha_id != hikingTrail.id)
					return;

				hikingTrail.points.push(hikingTrailPoint);
			});
			hikingTrail.points.sort((a, b) => a.ordem - b.ordem);
		},

		handleLinks(generic_links, drive_links) {
			if (generic_links == null && drive_links == null)
				return null;

			let links = [];
			if (generic_links != null) {
				// let link = generic_links.split(';')[0];
				// link = link.trim();
				// if (link != null && link != '')
				// 	links.push(link);

				generic_links.split(';').forEach(link => {
					link = link.trim();
					if (link == null || link == '')
						return;
					links.push(link);
				});
			}
			if (drive_links != null) {
				// let link = drive_links.split(';')[0];
				// link = link.trim();
				// if (link != null || link != '') {
				// 	link = 'https://lh3.googleusercontent.com/d/' + link.split('/')[5];
				// 	links.push(link);
				// }

				drive_links.split(';').forEach(link => {
					link = link.trim();
					if (link == null || link == '')
						return;
					link = 'https://lh3.googleusercontent.com/d/' + link.split('/')[5];
					links.push(link);
				});
			}
			return links;
		},

	}
})
