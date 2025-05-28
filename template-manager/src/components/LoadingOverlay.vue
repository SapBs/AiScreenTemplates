<template>
  <div v-if="isLoading" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center transform transition-all">
      <div class="relative">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent"></div>
        <div class="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-secondary-500 border-t-transparent opacity-30"></div>
      </div>
      <p class="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Loading...'
  }
})
</script> 