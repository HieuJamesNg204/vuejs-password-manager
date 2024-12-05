import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/apps';

export const useAppStore = defineStore('appStore', {
  state: () => ({
    apps: []
  }),
  actions: {
    async fetchApps(searchQuery) {
      try {
        const { data } = await axios.get(searchQuery ? `${API_URL}?name=${searchQuery}` : API_URL);
        this.apps = data;
      } catch (error) {
        alert('There was an unexpected error fetching apps');
      }
    },

    async addApp(newApp) {
      try {
        const { data } = await axios.post(API_URL, newApp);
        this.apps.push(data);
      } catch (error) {
        alert('There was an unexpected error adding the app');
      }
    },

    async updateApp(id, updated) {
      try {
        const { data } = await axios.put(`${API_URL}/${id}`, updated);
        const index = this.apps.findIndex(app => app.id === id);
        if (index !== -1) {
          this.apps[index] = data;
        }
      } catch (error) {
        alert('There was an unexpected error adding the app');
      }
    },

    async deleteApp(id) {
      try {
        const { data } = await axios.delete(`${API_URL}/${id}`);
        this.apps = this.apps.filter(app => app.id !== id);
      } catch (error) {
        alert('There was an unexpected error deleting the app');
      }
    },

    async fetchAppById(id) {
      try {
        const { data } = await axios.get(`${API_URL}/${id}`);
        return data; // Return the fetched app
      } catch (error) {
        alert('There was an unexpected error fetching the app by ID');
        return null; // Handle the error gracefully
      }
    }
  }
});