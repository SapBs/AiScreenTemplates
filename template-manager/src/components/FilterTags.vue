<template>
  <div class="flex flex-wrap mb-4">
    <button
      v-for="tag in tags"
      :key="tag"
      @click="toggleTag(tag)"
      :class="[
        'mr-2 mb-2 px-3 py-1 rounded',
        selectedTags.includes(tag) ? 'bg-blue-500 text-black' : 'bg-gray-200',
      ]"
    >
      {{ tag }}
    </button>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";

const props = defineProps({
  tags: Array,
  selectedTags: Array,
});

const emit = defineEmits(["update:tags"]);

const toggleTag = (tag) => {
  const newTags = [...props.selectedTags];
  const index = newTags.indexOf(tag);
  if (index > -1) {
    newTags.splice(index, 1);
  } else {
    newTags.push(tag);
  }
  emit("update:tags", newTags);
};
</script>
