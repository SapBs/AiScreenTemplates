<template>
  <div class="border rounded p-4 shadow hover:shadow-lg transition">
    <img
      :src="template.preview_image"
      alt=""
      class="w-full h-48 object-cover mb-2"
    />
    <h2 class="text-lg font-semibold mb-2">{{ template.name }}</h2>
    <div class="flex justify-between">
      <button
        @click="$emit('delete', template.id)"
        class="bg-red-500 text-black px-2 py-1 rounded"
      >
        Delete
      </button>
      <button
        @click="$emit('edit', template.id)"
        class="bg-green-500 text-black px-2 py-1 rounded"
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
