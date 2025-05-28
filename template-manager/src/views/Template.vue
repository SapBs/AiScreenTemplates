<template>
  <div>
    <h1 class="text-2xl mb-4">
      {{ isEdit ? "Edit Template" : "Create Template" }}
    </h1>
    <form @submit.prevent="save" class="space-y-4">
      <div>
        <label class="block mb-1 font-medium">Name *</label>
        <input 
          v-model="form.name" 
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
          required 
        />
      </div>
      <div>
        <label class="block mb-1 font-medium">Tags (comma separated)</label>
        <input 
          v-model="form.tags" 
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
        />
      </div>
      <div>
        <label class="block mb-1 font-medium">Width *</label>
        <input
          v-model.number="form.width"
          type="number"
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>
      <div>
        <label class="block mb-1 font-medium">Description</label>
        <input
          v-model="form.description"
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <div>
        <label class="block mb-1 font-medium">Height *</label>
        <input
          v-model.number="form.height"
          type="number"
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>
      <div>
        <label class="block mb-1 font-medium">Preview Image</label>
        <div class="space-y-2">
          <input
            type="file"
            @change="handleFileUpload"
            accept="image/*"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div v-if="imagePreview" class="mt-2">
            <img :src="imagePreview" alt="Preview" class="max-h-40 rounded-lg" />
          </div>
          <div v-if="imageError" class="text-sm text-red-600">
            {{ imageError }}
          </div>
        </div>
      </div>
      <div class="flex gap-4">
        <button 
          type="submit" 
          class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          :disabled="store.isLoading"
        >
          {{ store.isLoading ? 'Saving...' : 'Save' }}
        </button>
        <button
          @click="$router.push('/')"
          type="button"
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          :disabled="store.isLoading"
        >
          Cancel
        </button>
      </div>
      <div v-if="store.error" class="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
        {{ store.error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMainStore } from "../store";
import LoadingOverlay from "../components/LoadingOverlay.vue";

const route = useRoute();
const router = useRouter();
const store = useMainStore();
const imagePreview = ref("");
const imageError = ref("");

const isEdit = ref(false);
const form = ref({
  id: null,
  name: "",
  tags: "",
  width: null,
  height: null,
  description: "",
  preview_image: null,
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
        description: template.description || "",
        tags: Array.isArray(template.tags) ? template.tags.join(", ") : "",
        width: parseInt(template.width),
        height: parseInt(template.height),
        preview_image: null,
      };
      if (template.preview_image) {
        imagePreview.value = template.preview_image;
      }
    }
  }
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) {
    imagePreview.value = "";
    form.value.preview_image = null;
    imageError.value = "";
    return;
  }

  if (!file.type.startsWith('image/')) {
    imageError.value = "Please select an image file";
    imagePreview.value = "";
    form.value.preview_image = null;
    return;
  }

  imageError.value = "";
  form.value.preview_image = file;
  imagePreview.value = URL.createObjectURL(file);
};

const save = async () => {
  if (!form.value.name.trim()) {
    alert("Name is required");
    return;
  }

  try {
    const tagsArray = form.value.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    const newTemplate = {
      ...form.value,
      width: `${form.value.width}px`,
      height: `${form.value.height}px`,
      tags: tagsArray,
    };

    await store.saveTemplate(newTemplate);
    router.push("/");
  } catch (error) {
    console.error("Save failed:", error);
  }
};
</script>
