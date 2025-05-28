<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Templates</h1>
      <button
        @click="$router.push('/template')"
        class="bg-blue-500 text-black px-4 py-2 rounded"
      >
        Add New
      </button>
      <button
        v-if="!isAuthenticated"
        @click="$router.push('/login')"
        class="bg-blue-500 text-black px-4 py-2 rounded"
      >
        Login
      </button>

      
      <button
        v-else
        disabled
        class="bg-gray-300 text-black px-4 py-2 rounded cursor-not-allowed"
      >
        You're logged in
      </button>
    </div>
    <SearchInput v-model="search" />
    <FilterTags
      :tags="tags"
      :selectedTags="selectedTags"
      @update:tags="updateTags"
    />
    <div
      v-if="!filteredTemplates.length"
      class="text-center text-gray-500 mt-4"
    >
      No templates found
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <TemplateCard
        v-for="template in filteredTemplates"
        :key="template.id"
        :template="template"
        @delete="deleteTemplate"
        @edit="editTemplate"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useMainStore } from "../store";
import TemplateCard from "../components/TemplateCard.vue";
import FilterTags from "../components/FilterTags.vue";
import SearchInput from "../components/SearchInput.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useMainStore();
const search = ref("");
const selectedTags = ref([]);

const isAuthenticated = computed(() => store.isAuthenticated);

const fetchData = () => {
  store.fetchTemplates();
};

onMounted(() => {
  fetchData();
});

const deleteTemplate = (id) => {
  store.deleteTemplate(id);
};

const editTemplate = (id) => {
  router.push(`/template/${id}`);
};

const tags = computed(() => store.tags);

const filteredTemplates = computed(() => {
  let result = store.templates;
  if (search.value) {
    result = result.filter((t) =>
      t.name.toLowerCase().includes(search.value.toLowerCase()),
    );
  }
  if (selectedTags.value.length) {
    result = result.filter((t) =>
      selectedTags.value.every((tag) => t.tags?.includes(tag) ?? false),
    );
  }
  return result;
});

const updateTags = (tags) => {
  selectedTags.value = tags;
};
</script>
