<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <nav class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Template Manager</h1>
          </div>
          <div class="flex items-center">
            <button
              v-if="store.isAuthenticated"
              @click="logout"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <LoadingOverlay 
      :is-loading="store.isLoading" 
      :message="store.error || 'Loading...'"
    />
  </div>
</template>

<script setup>
import { useMainStore } from './store';
import LoadingOverlay from './components/LoadingOverlay.vue';

const store = useMainStore();

const logout = () => {
  store.authToken = '';
  store.isAuthenticated = false;
  localStorage.removeItem('token');
};
</script>

<style>
[v-cloak] {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


</style>