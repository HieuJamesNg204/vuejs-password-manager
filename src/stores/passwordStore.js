import axios from "axios";
import { defineStore } from "pinia";

const API_URL = 'http://localhost:8080/api/passwords';

export const usePasswordStore = defineStore('passwordStore', {
  state: () => ({
    passwords: []
  }),
  actions: {
    async fetchPasswords(appId) {
      try {
        const { data } = await axios.get(`${API_URL}/app/${appId}`);
        this.passwords = data;
      } catch (error) {
        console.log(error);
        alert('There was an unexpected error fetching passwords: ');
      }
    },

    async addPassword(newPassword) {
      try {
        const { data } = await axios.post(API_URL, newPassword);
        this.passwords.push(data);
      } catch (error) {
        console.log(error);
        alert('There was an unexpected error adding the password');
      }
    },

    async updatePassword(id, updated) {
      try {
        const { data } = await axios.put(`${API_URL}/${id}`, updated);
        const index = this.passwords.findIndex(password => password.id === id);
        if (index !== -1) {
          this.passwords[index] = data;
        }
      } catch (error) {
        alert('There was an unexpected error updating the password');
      }
    },

    async deletePassword(id) {
      try {
        const { data } = await axios.delete(`${API_URL}/${id}`);
        this.passwords = this.passwords.filter(password => password.id !== id);
      } catch (error) {
        alert('There was an unexpected error deleting the password');
      }
    }
  }
});