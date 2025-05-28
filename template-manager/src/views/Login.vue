<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded shadow">
    <h2 class="text-2xl mb-4 text-center">Login</h2>
    <form @submit.prevent="handleLogin" class="flex flex-col space-y-4">
      <div>
        <label class="block mb-1 font-semibold" for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Enter your email"
          class="border p-2 w-full rounded"
          required
        />
      </div>
      <div>
        <label class="block mb-1 font-semibold" for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Enter your password"
          class="border p-2 w-full rounded"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        :disabled="store.isLoading"
      >
        {{ store.isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    <!-- Error Messages -->
    <div v-if="store.error" class="mt-4 p-4 bg-red-100 text-red-700 rounded">
      {{ store.error }}
    </div>

    <!-- Links -->
    <div class="mt-4 text-center">
      <router-link to="/register" class="text-blue-500 hover:text-blue-600">
        Don't have an account? Register
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useMainStore } from "../store";
import { useRouter } from "vue-router";

const store = useMainStore();
const router = useRouter();

const email = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    await store.login(email.value, password.value);
    if (store.authToken) {
      router.push("/");
    }
  } catch (e) {
    console.error("Login error:", e);
  }
};
</script>
