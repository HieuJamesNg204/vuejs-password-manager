<script setup>
import { useAppStore } from '@/stores/appStore';
import { usePasswordStore } from '@/stores/passwordStore';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Router and route
const router = useRouter();
const route = useRoute();

// Model state
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirmModal = ref(false);

// App Name
const app = ref({});

// New password form state
const newPassword = ref({
  username: '',
  password: '',
  note: '',
  appId: route.params.appId
});

// Edit password form state
const passwordToUpdate = ref(null);

// Password to delete
const passwordToDelete = ref(null);

// Stores
const passwordStore = usePasswordStore();
const appStore = useAppStore();

// For successful attempt to copy
const showCopySuccess = ref(false);

onMounted(async () => {
  app.value = await appStore.fetchAppById(route.params.appId);
  await passwordStore.fetchPasswords(route.params.appId);
  passwordStore.passwords.forEach((password) => {
    password.show = false;
  });
});

// Toggle password visibility
const togglePasswordVisibility = (password) => {
  password.show = !password.show;
};

// Add password method
const addPassword = async () => {
  await passwordStore.addPassword(newPassword.value);
  newPassword.value.username = '';
  newPassword.value.password = '';
  newPassword.value.note = '';
  showAddModal.value = false;
};

// Open edit modal
const openEditModal = (password) => {
  passwordToUpdate.value = { ...password };
  showEditModal.value = true;
};

// Edit password method
const editPassword = async () => {
  await passwordStore.updatePassword(passwordToUpdate.value.id, passwordToUpdate.value);
  passwordToUpdate.value = null;
  showEditModal.value = false;
};

// Show delete confirmation modal
const confirmDelete = (password) => {
  passwordToDelete.value = password;
  showDeleteConfirmModal.value = true;
};

// Delete password
const deletePassword = async () => {
  if (passwordToDelete.value) {
    await passwordStore.deletePassword(passwordToDelete.value.id);
    passwordToDelete.value = null;
    showDeleteConfirmModal.value = false;
  }
};

// Copy password
const copyToClipboard = async (password) => {
  try {
    await navigator.clipboard.writeText(password.password);
    showCopySuccess.value = true;

    // Hide the dialog after 3 seconds
    setTimeout(() => {
      showCopySuccess.value = false;
    }, 3000);
  } catch (err) {
    console.error('Failed to copy password: ', err);
  }
};
</script>

<template>
  <div class="pt-16 p-6 max-w-6xl mx-auto">
    <div class="flex justify-center">
      <button
        @click="router.back()"
        class="mr-2 w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-700 rounded-full shadow-md hover:bg-gray-400 transition transform hover:scale-105"
        title="Go back"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="2" 
          stroke="currentColor" 
          class="w-4 h-4"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Passwords for {{ app.name }}</h2>
    </div>

    <!-- Add Password Button -->
    <div class="mb-6">
      <button 
        @click="showAddModal = true" 
        class="px-4 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-500 transition transform hover:scale-105"
      >
        Add New Password
      </button>
    </div>

    <!-- Password Cards -->
    <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="(password, index) in passwordStore.passwords" 
        :key="index" 
        class="bg-white shadow-md rounded-lg p-4 flex flex-col space-y-4"
      >
        <!-- Username -->
        <div>
          <h3 class="text-sm font-medium text-gray-600">Username</h3>
          <p class="text-lg font-semibold text-gray-800">{{ password.username }}</p>
        </div>
        
        <!-- Password Field with Toggle -->
        <div>
          <h3 class="text-sm font-medium text-gray-600">Password</h3>
          <div class="flex items-center space-x-2">
            <input 
              :type="password.show ? 'text' : 'password'" 
              :value="password.password" 
              readonly 
              class="w-full border border-gray-300 rounded-md p-2"
            />
            <!-- Show/Hide button -->
            <button 
              @click="togglePasswordVisibility(password)" 
              class="px-2 py-1 bg-gray-300 text-gray-700 rounded-full shadow-md hover:bg-gray-400 transition transform hover:scale-105"
              :title="password.show ? 'Hide' : 'Show'"
            >
              <svg v-if="password.show" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke-width="2" 
                stroke="currentColor" 
                class="w-5 h-5"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
                <line x1="2" y1="2" x2="22" y2="22"></line>
              </svg>
              <svg 
                v-else 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke-width="2" 
                stroke="currentColor" 
                class="w-5 h-5"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <!-- Copy button -->
            <button 
              @click="copyToClipboard(password)" 
              class="px-2 py-1 bg-green-500 text-white rounded-full shadow-md hover:bg-green-400 transition transform hover:scale-105"
              title="Copy"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke-width="2" 
                stroke="currentColor" 
                class="w-5 h-5"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <rect x="3" y="3" width="13" height="13" rx="2" ry="2"></rect>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Notes -->
        <div>
          <h3 class="text-sm font-medium text-gray-600">Notes</h3>
          <p class="text-gray-700 whitespace-pre-wrap">{{ password.note || 'No notes available' }}</p>
        </div>
        
        <!-- Action Buttons -->
        <div class="mt-auto flex justify-between space-x-2">
          <button 
            @click="openEditModal(password)" 
            class="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-full shadow-md hover:bg-yellow-400 transition transform hover:scale-105"
          >
            Edit
          </button>
          <button 
            @click="confirmDelete(password)" 
            class="flex-1 px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-400 transition transform hover:scale-105"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Add Password Modal -->
    <transition name="fade">
      <div 
        v-if="showAddModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg w-96 p-6">
          <h3 class="text-lg font-bold mb-4">Add New Password</h3>
          <form @submit.prevent="addPassword">
            <div class="mb-4">
              <label for="username" class="block text-gray-700">Username</label>
              <input 
                id="username" 
                v-model="newPassword.username" 
                type="text" 
                placeholder="Username"
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
                required
              />
            </div>
            <div class="mb-4">
              <label for="password" class="block text-gray-700">Password</label>
              <input 
                id="password" 
                v-model="newPassword.password" 
                type="password" 
                placeholder="Password"
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
                required
              />
            </div>
            <div class="mb-4">
              <label for="note" class="block text-gray-700">Note</label>
              <textarea 
                id="note" 
                v-model="newPassword.note" 
                placeholder="Note (optional)"
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-2">
              <button 
                type="button" 
                @click="showAddModal = false" 
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

    <!-- Edit Password Modal -->
    <transition name="fade">
      <div 
        v-if="showEditModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg w-96 p-6">
          <h3 class="text-lg font-bold mb-4">Edit Password</h3>
          <form @submit.prevent="editPassword">
            <div class="mb-4">
              <label for="edit-username" class="block text-gray-700">Username</label>
              <input 
                id="edit-username" 
                v-model="passwordToUpdate.username" 
                type="text" 
                placeholder="Username"
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
                required
              />
            </div>
            <div class="mb-4">
              <label for="edit-password" class="block text-gray-700">Password</label>
              <input 
                id="edit-password" 
                v-model="passwordToUpdate.password" 
                type="password" 
                placeholder="Password"
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
                required
              />
            </div>
            <div class="mb-4">
              <label for="edit-note" class="block text-gray-700">Note</label>
              <textarea 
                id="edit-note" 
                v-model="passwordToUpdate.note" 
                placeholder="Note (optional)"
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
              ></textarea>
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
          <p class="mb-4">Do you really want to delete this password? This action cannot be undone.</p>
          <div class="flex justify-end space-x-2">
            <button 
              @click="showDeleteConfirmModal = false" 
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-full shadow-md hover:bg-gray-400 transition transform hover:scale-105"
            >
              Cancel
            </button>
            <button 
              @click="deletePassword" 
              class="px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-400 transition transform hover:scale-105"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Success dialogue -->
    <transition name="fade">
      <div 
        v-if="showCopySuccess" 
        class="fixed bottom-8 right-8 bg-white-500 text-black py-2 px-4 rounded-full shadow-lg flex items-center space-x-2"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="2" 
          stroke="currentColor" 
          class="w-6 h-6"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M5 13l4 4L19 7" 
          />
        </svg>
        <span>Password copied to clipboard!</span>
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