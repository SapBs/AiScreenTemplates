<template>
  <div>
    <h1 class="text-2xl mb-4">
      {{ isEdit ? "Edit Template" : "Create Template" }}
    </h1>
    <form @submit.prevent="save">
      <div class="mb-2">
        <label class="block mb-1">Name *</label>
        <input v-model="form.name" class="border p-2 w-full" required />
      </div>
      <div class="mb-2">
        <label class="block mb-1">Tags (comma separated)</label>
        <input v-model="form.tags" class="border p-2 w-full" />
      </div>
      <div class="mb-2">
        <label class="block mb-1">Width *</label>
        <input
          v-model.number="form.width"
          type="number"
          class="border p-2 w-full"
          required
        />
      </div>
      <div class="mb-2">
        <label class="block mb-1">description</label>
        <input
          v-model.number="form.description"
          class="border p-2 w-full"
        />
      </div>
      <div class="mb-2">
        <label class="block mb-1">Height *</label>
        <input
          v-model.number="form.height"
          type="number"
          class="border p-2 w-full"
          required
        />
      </div>
      <div class="mb-2">
        <label class="block mb-1">Preview Image URL</label>
        <input v-model="form.preview_image" class="border p-2 w-full" />
      </div>
      <div class="mt-4">
        <button type="submit" class="bg-blue-500 text-black px-4 py-2 rounded">
          Save
        </button>
        <button
          @click="$router.push('/')"
          type="button"
          class="ml-2 bg-gray-500 text-black px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMainStore } from "../store";

const route = useRoute();
const router = useRouter();
const store = useMainStore();

const isEdit = ref(false);
const form = ref({
  id: null,
  name: "",
  tags: "",
  width: null,
  height: null,
  preview_image: "",
});

onMounted(() => {
  if (route.params.id) {
    isEdit.value = true;
    const template = store.templates.find(
      (t) => t.id === parseInt(route.params.id),
    );
    if (template) {
      form.value = {
        id: template.id,
        name: template.name,
        description: template.description,
        tags: template.tags.join(", "),
        width: template.width,
        height: template.height,
        preview_image: template.preview_image,
      };
    }
  }
});

const save = () => {
  if (!form.value.name.trim()) {
    alert("Name is required");
    return;
  }

  form.width += "px"
  form.height += "px"
  const tagsArray = form.value.tags
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t);
  const newTemplate = {
    ...form.value,
    tags: tagsArray,
  };
  store.saveTemplate(newTemplate);
  router.push("/");
};
</script>
