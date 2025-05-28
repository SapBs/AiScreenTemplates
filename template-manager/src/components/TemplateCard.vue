<template>
  <div class="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
    <div class="relative aspect-video overflow-hidden">
      <img
        :src="template.preview_image"
        :alt="template.name"
        class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

    <div class="p-4">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ template.name }}</h2>

      <p v-if="template.description" class="mb-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
        {{ template.description }}
      </p>

      <div class="mb-4 flex flex-wrap gap-2">
        <span
          v-for="tag in template.tags"
          :key="tag"
          class="px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full"
        >
          {{ tag }}
        </span>
      </div>

      <div class="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
        <button
          @click="$emit('delete', template.id)"
          class="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
        >
          Delete
        </button>
        <button
          @click="$emit('edit', template.id)"
          class="px-3 py-1.5 text-sm font-medium text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  template: Object,
});
</script>
