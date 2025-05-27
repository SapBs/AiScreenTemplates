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
      >
        Login
      </button>
    </form>
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
    } else {
      alert("Login failed");
    }
  } catch (e) {
    alert("Error during login");
    console.error(e);
  }
};
</script>
