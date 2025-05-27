<template>
  <input
    v-model="localValue"
    @input="update"
    placeholder="Search..."
    class="border p-2 rounded w-full mb-4"
  />
</template>

<script setup>
import { ref, watch } from "vue";
defineProps({
  modelValue: String,
});
const emit = defineEmits(["update:modelValue"]);

const localValue = ref("");

// watch(
//   () => props.modelValue,
//   (val) => {
//     localValue.value = val
//   },
//   { immediate: true }
// )

const update = () => {
  emit("update:modelValue", localValue.value);
};
</script>
