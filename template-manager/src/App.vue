<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <nav class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Template Manager
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              v-if="store.isAuthenticated"
              @click="logout"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
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