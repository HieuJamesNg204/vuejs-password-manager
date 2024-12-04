<script setup>
import { ref, onMounted } from 'vue';
import { useAppStore } from '@/stores/appStore';

// Modal state
const showModal = ref(false);

// New app form state
const newApp = ref({
  name: '',
  url: '',
});

const appStore = useAppStore();

onMounted(() => {
  appStore.fetchApps();
});

const addApp = async () => {
  await appStore.addApp(newApp.value);
  newApp.value.name = '';
  newApp.value.url = '';
  showModal.value = false;
};
</script>

<template>
  <div class="pt-16 p-6 max-w-6xl mx-auto">
    <!-- App List -->
    <div>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Apps</h2>
      <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-200 text-gray-700">
          <tr>
            <th class="text-left py-2 px-4">Name</th>
            <th class="text-left py-2 px-4">URL</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(app, index) in appStore.apps" 
            :key="index" 
            class="border-t hover:bg-gray-50"
          >
            <td class="py-2 px-4">{{ app.name }}</td>
            <td class="py-2 px-4">
              <a :href="app.url" target="_blank" class="text-blue-600 hover:underline">
                {{ app.url }}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add App Button -->
    <div class="mt-6">
      <button 
        @click="showModal = true" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Add New App
      </button>
    </div>

    <!-- Modal -->
    <transition name="fade">
      <div 
        v-if="showModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg w-96 p-6">
          <h3 class="text-lg font-bold mb-4">Add New App</h3>
          <form @submit.prevent="addApp">
            <div class="mb-4">
              <label for="name" class="block text-gray-700">Name</label>
              <input 
                id="name" 
                v-model="newApp.name" 
                type="text" 
                placeholder="App Name"
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
                required
              />
            </div>
            <div class="mb-4">
              <label for="url" class="block text-gray-700">URL</label>
              <input 
                id="url" 
                v-model="newApp.url" 
                type="url" 
                placeholder="App URL"
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
                required
              />
            </div>
            <div class="flex justify-end space-x-2">
              <button 
                type="button" 
                @click="showModal = false" 
                class="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>