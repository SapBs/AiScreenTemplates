<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded shadow">
    <h2 class="text-2xl mb-4 text-center">{{ isPasswordReset ? 'Reset Password' : 'Register' }}</h2>
    
    <!-- Registration Form -->
    <form v-if="!isPasswordReset" @submit.prevent="handleRegister" class="flex flex-col space-y-4">
      <div>
        <label class="block mb-1 font-semibold" for="name">Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="Enter your name"
          class="border p-2 w-full rounded"
          required
        />
      </div>
      <div>
        <label class="block mb-1 font-semibold" for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
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
          v-model="form.password"
          type="password"
          placeholder="Enter your password"
          class="border p-2 w-full rounded"
          required
          minlength="8"
        />
      </div>
      <div>
        <label class="block mb-1 font-semibold" for="password_confirmation">Confirm Password</label>
        <input
          id="password_confirmation"
          v-model="form.password_confirmation"
          type="password"
          placeholder="Confirm your password"
          class="border p-2 w-full rounded"
          required
          minlength="8"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        :disabled="store.isLoading"
      >
        {{ store.isLoading ? 'Registering...' : 'Register' }}
      </button>
    </form>

    <!-- Password Reset Form -->
    <form v-else @submit.prevent="handlePasswordReset" class="flex flex-col space-y-4">
      <div v-if="!resetToken">
        <label class="block mb-1 font-semibold" for="reset-email">Email</label>
        <input
          id="reset-email"
          v-model="resetForm.email"
          type="email"
          placeholder="Enter your email"
          class="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          class="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          :disabled="store.isLoading"
        >
          {{ store.isLoading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </div>
      <div v-else>
        <div>
          <label class="block mb-1 font-semibold" for="new-password">New Password</label>
          <input
            id="new-password"
            v-model="resetForm.password"
            type="password"
            placeholder="Enter new password"
            class="border p-2 w-full rounded"
            required
            minlength="8"
          />
        </div>
        <div>
          <label class="block mb-1 font-semibold" for="confirm-password">Confirm New Password</label>
          <input
            id="confirm-password"
            v-model="resetForm.password_confirmation"
            type="password"
            placeholder="Confirm new password"
            class="border p-2 w-full rounded"
            required
            minlength="8"
          />
        </div>
        <button
          type="submit"
          class="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          :disabled="store.isLoading"
        >
          {{ store.isLoading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </div>
    </form>

    <!-- Success Messages -->
    <div v-if="store.registrationSuccess" class="mt-4 p-4 bg-green-100 text-green-700 rounded">
      Registration successful! Please check your email to activate your account.
    </div>
    <div v-if="store.passwordResetRequested" class="mt-4 p-4 bg-green-100 text-green-700 rounded">
      Password reset link has been sent to your email.
    </div>
    <div v-if="store.passwordResetSuccess" class="mt-4 p-4 bg-green-100 text-green-700 rounded">
      Password has been reset successfully. You can now login with your new password.
    </div>

    <!-- Error Messages -->
    <div v-if="store.error" class="mt-4 p-4 bg-red-100 text-red-700 rounded">
      {{ store.error }}
    </div>

    <!-- Links -->
    <div class="mt-4 text-center">
      <button
        @click="toggleForm"
        class="text-blue-500 hover:text-blue-600"
      >
        {{ isPasswordReset ? 'Register instead' : 'Forgot password?' }}
      </button>
      <div class="mt-2">
        <router-link to="/login" class="text-blue-500 hover:text-blue-600">
          Back to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMainStore } from "../store";

const route = useRoute();
const router = useRouter();
const store = useMainStore();

const isPasswordReset = ref(false);
const resetToken = ref(route.query.token || null);

const form = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: ""
});

const resetForm = ref({
  email: "",
  password: "",
  password_confirmation: "",
  token: resetToken.value
});

onMounted(() => {
  if (resetToken.value) {
    isPasswordReset.value = true;
  }
});

const handleRegister = async () => {
  if (form.value.password !== form.value.password_confirmation) {
    store.error = "Passwords do not match";
    return;
  }

  try {
    await store.register(form.value);
    form.value = {
      name: "",
      email: "",
      password: "",
      password_confirmation: ""
    };
  } catch (error) {
    console.error("Registration failed:", error);
  }
};

const handlePasswordReset = async () => {
  if (resetToken.value) {
    if (resetForm.value.password !== resetForm.value.password_confirmation) {
      store.error = "Passwords do not match";
      return;
    }

    try {
      await store.resetPassword({
        token: resetToken.value,
        password: resetForm.value.password,
        password_confirmation: resetForm.value.password_confirmation
      });
      router.push("/login");
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  } else {
    try {
      await store.requestPasswordReset(resetForm.value.email);
      resetForm.value.email = "";
    } catch (error) {
      console.error("Password reset request failed:", error);
    }
  }
};

const toggleForm = () => {
  isPasswordReset.value = !isPasswordReset.value;
  store.error = null;
  store.registrationSuccess = false;
  store.passwordResetRequested = false;
  store.passwordResetSuccess = false;
};
</script> 