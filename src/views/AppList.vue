<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'vue-router';

// Router
const router = useRouter();

// Modal state
const showModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirmModal = ref(false);  // For delete confirmation modal

// New app form state
const newApp = ref({
  name: '',
  url: '',
});

// Edit app form state
const selectedApp = ref(null);

// App to delete (used by the confirmation modal)
const appToDelete = ref(null);

// Search query
const searchQuery = ref('');

// Store
const appStore = useAppStore();

onMounted(() => {
  appStore.fetchApps(searchQuery.value);
});

// Add app method
const addApp = async () => {
  await appStore.addApp(newApp.value);
  newApp.value.name = '';
  newApp.value.url = '';
  showModal.value = false;
};

// Open edit modal
const openEditModal = (app) => {
  selectedApp.value = { ...app };
  showEditModal.value = true;
};

// Edit app method
const editApp = async () => {
  await appStore.updateApp(selectedApp.value.id, selectedApp.value);
  selectedApp.value = null;
  showEditModal.value = false;
};

// Show delete confirmation modal
const confirmDelete = (app) => {
  appToDelete.value = app;
  showDeleteConfirmModal.value = true;
};

// Delete app
const deleteApp = async () => {
  if (appToDelete.value) {
    await appStore.deleteApp(appToDelete.value.id);
    appToDelete.value = null; // Reset after deletion
    showDeleteConfirmModal.value = false;
  }
};

// Close delete confirmation modal
const cancelDelete = () => {
  appToDelete.value = null;
  showDeleteConfirmModal.value = false;
};

// Redirect to passwords page
const viewPasswords = (appId) => {
  router.push(`/app/${appId}/passwords`);
};

// Watch for changes in searchQuery
watch(searchQuery, (newQuery) => {
  appStore.fetchApps(newQuery);
});
</script>

<template>
  <div class="pt-16 p-6 max-w-6xl mx-auto">
    <!-- App List -->
    <div>
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Apps</h2>
      <div class="flex justify-center mb-6">
        <!-- Search Input -->
        <div class="relative flex items-center w-full max-w-md">
          <!-- Magnifying Glass Icon -->
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke-width="2" 
            stroke="currentColor" 
            class="absolute left-3 w-5 h-5 text-gray-400 transition-all duration-300 group-focus-within:text-blue-500"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35"
            />
          </svg>

          <!-- Input Field -->
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search apps..." 
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 hover:ring-2 hover:ring-blue-200"
          />
        </div>
      </div>

      <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-200 text-gray-700">
          <tr>
            <th class="text-left py-2 px-4">Name</th>
            <th class="text-left py-2 px-4">URL</th>
            <th class="text-left py-2 px-4">Actions</th>
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
            <td class="py-2 px-4">
              <button 
                @click="viewPasswords(app.id)" 
                class="mr-1 px-3 py-1 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-400 transition transform hover:scale-105"
              >
                View Passwords
              </button>
              <button 
                @click="openEditModal(app)" 
                class="mr-1 px-3 py-1 bg-yellow-500 text-white rounded-full shadow-md hover:bg-yellow-400 transition transform hover:scale-105"
              >
                Edit
              </button>
              <button 
                @click="confirmDelete(app)" 
                class="px-3 py-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-400 transition transform hover:scale-105"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add App Button -->
    <div class="mt-6">
      <button 
        @click="showModal = true" 
        class="px-4 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-500 transition transform hover:scale-105"
      >
        Add New App
      </button>
    </div>

    <!-- Add App Modal -->
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
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-full shadow-md hover:bg-gray-400 transition transform hover:scale-105"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-500 transition transform hover:scale-105"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Edit App Modal -->
    <transition name="fade">
      <div 
        v-if="showEditModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg w-96 p-6">
          <h3 class="text-lg font-bold mb-4">Edit App</h3>
          <form @submit.prevent="editApp">
            <div class="mb-4">
              <label for="edit-name" class="block text-gray-700">Name</label>
              <input 
                id="edit-name" 
                v-model="selectedApp.name" 
                type="text" 
                placeholder="App Name"
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
                required
              />
            </div>
            <div class="mb-4">
              <label for="edit-url" class="block text-gray-700">URL</label>
              <input 
                id="edit-url" 
                v-model="selectedApp.url" 
                type="url" 
                placeholder="App URL"
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
                required
              />
            </div>
            <div class="flex justify-end space-x-2">
              <button 
                type="button" 
                @click="showEditModal = false" 
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-full shadow-md hover:bg-gray-400 transition transform hover:scale-105"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-500 transition transform hover:scale-105"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition name="fade">
      <div 
        v-if="showDeleteConfirmModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg w-96 p-6">
          <h3 class="text-lg font-bold mb-4">Are you sure?</h3>
          <p class="mb-4">Do you really want to delete this app? This action cannot be undone.</p>
          <div class="flex justify-end space-x-2">
            <button 
              @click="cancelDelete" 
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-full shadow-md hover:bg-gray-400 transition transform hover:scale-105"
            >
              Cancel
            </button>
            <button 
              @click="deleteApp" 
              class="px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-400 transition transform hover:scale-105"
            >
              Delete
            </button>
          </div>
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