import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { useGoogleApiStore } from 'stores/googleApi';

export const useArraysStore = defineStore('arrays', {
  state: () => ({
    pointsOfInterest: [],
    pointsOfInterestLoaded: false,
    collection: [],
    collectionLoaded: false,
    googleApi: useGoogleApiStore(),
  }),

  getters: {
  },

  actions: {
    addToPointsOfInterest(item) {
      this.pointsOfInterest.push(item);
    },

    addToCollection(item) {
      this.collection.push(item);
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

    async readSheet(sheetName) {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.googleApi.spreadsheetId}/values/${sheetName}?key=${this.googleApi.apiKey}`;
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

        poi.id = parseInt(poi.id);
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

        colItem.id = parseInt(colItem.id);
        colItem.links = this.handleLinks(colItem.generic_links, colItem.drive_links);

        this.addToCollection(colItem);
      });
    },

    handleLinks(generic_links, drive_links) {
      if (generic_links == null && drive_links == null)
        return null;

      let links = [];
      if (generic_links != null) {
        generic_links.split(';').forEach(link => {
          links.push(link);
        });
      }
      if (drive_links != null) {
        drive_links.split(';').forEach(link => {
          let driveId = link.split('/')[5];
          links.push('https://lh3.googleusercontent.com/d/' + driveId);
        });
      }
      return links;
    },

  }
})
