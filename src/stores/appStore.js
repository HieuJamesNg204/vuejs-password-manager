import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/apps';

export const useAppStore = defineStore('appStore', {
  state: () => ({
    apps: [],
  }),
  actions: {
    async fetchApps() {
      try {
        const { data } = await axios.get(API_URL);
        this.apps = data;
      } catch (error) {
        alert('There was an unexpected error fetching the apps');
      }
    },
    async addApp(newApp) {
      try {
        const { data } = await axios.post(API_URL, newApp);
        this.apps.push(data); // Assuming the API returns the new app with an ID
      } catch (error) {
        alert('There was an unexpected error adding the app');
      }
    },
  },
});