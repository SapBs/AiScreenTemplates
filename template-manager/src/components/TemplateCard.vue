<template>
  <div class="border rounded p-4 shadow hover:shadow-lg transition">
    <img
      :src="template.preview_image"
      alt=""
      class="mb-2 w-full object-cover h-48"
    />

    <h2 class="text-lg font-semibold mb-2">{{ template.name }}</h2>

    <p v-if="template.description" class="mb-2 text-gray-700">
      {{ template.description }}
    </p>

    <div class="mb-2 flex flex-wrap gap-2">
      <span
        v-for="tag in template.tags"
        :key="tag"
        class="bg-gray-200 text-sm px-2 py-1 rounded"
      >
        {{ tag }}
      </span>
    </div>

    <div class="flex justify-between mt-2">
      <button
        @click="$emit('delete', template.id)"
        class="bg-red-500 text-white px-2 py-1 rounded"
      >
        Delete
      </button>
      <button
        @click="$emit('edit', template.id)"
        class="bg-green-500 text-white px-2 py-1 rounded"
      >
        Edit
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  template: Object,
});
</script>
