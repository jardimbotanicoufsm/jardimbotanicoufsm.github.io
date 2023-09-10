import { defineStore } from 'pinia';

export const useArraysStore = defineStore('arrays', {
  state: () => ({
    pointsOfInterest: [],
    collection: [],
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
  }
})
