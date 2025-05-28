import { defineStore } from "pinia";
import axios from "axios";

const API_BASE = '/AiScreenTemplates/api/v1';

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const useMainStore = defineStore("main", {
  state: () => ({
    templates: [],
    tags: [],
    authToken: localStorage.getItem("token") || "",
    user: null,
    isAuthenticated: !!localStorage.getItem("token"),
    isLoading: false,
    error: null,
    registrationSuccess: false,
    activationSuccess: false,
    passwordResetRequested: false,
    passwordResetSuccess: false
  }),
  actions: {
    async login(userEmail, userPassword) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(`${API_BASE}/login`, {
          email: userEmail,
          password: userPassword,
        });
        this.authToken = response.data.token;
        this.isAuthenticated = true;
        localStorage.setItem("token", this.authToken);
      } catch (e) {
        console.error("Login error", e);
        this.error = e.response?.data?.message || "Login failed";
        this.isAuthenticated = false;
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchTemplates() {
      if (!this.authToken) return;
      
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE}/canvas_templates`, {
          headers: { Authorization: `Bearer ${this.authToken}` },
        });
        this.templates = response.data;
        this.extractTags();
      } catch (e) {
        console.error("Fetch templates error", e);
        this.error = e.response?.data?.message || "Failed to fetch templates";
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    extractTags() {
      const tagsSet = new Set();
      this.templates.forEach((t) => {
        if (Array.isArray(t.tags)) {
          t.tags.forEach((tag) => tagsSet.add(tag));
        }
      });
      this.tags = Array.from(tagsSet);
    },

    async deleteTemplate(id) {
      this.isLoading = true;
      this.error = null;
      try {
        await axios.delete(`${API_BASE}/canvas_templates`, {
          headers: { Authorization: `Bearer ${this.authToken}` },
          data: { id },
        });
        this.templates = this.templates.filter((t) => t.id !== id);
      } catch (e) {
        console.error("Delete error", e);
        this.error = e.response?.data?.message || "Failed to delete template";
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    async saveTemplate(template) {
      this.isLoading = true;
      this.error = null;
    
      const payload = {
        name: template.name,
        description: template.description || '',
        width: `${template.width}`,
        height: `${template.height}`,
        objects: '',
        tags: template.tags || [],
      };
    
      if (typeof template.preview_image === 'string') {
        payload.preview_image = template.preview_image;
      }
    
      return this.sendTemplateRequest(template.id, payload);
    },
    
    async sendTemplateRequest(templateId, payload) {
      const config = {
        headers: { Authorization: `Bearer ${this.authToken}` },
      };
    
      try {
        if (templateId) {
          config.params = { _method: 'PATCH' };
          await axios.patch(
            `${API_BASE}/canvas_templates/${templateId}`,
            payload,
            config
          );
        } else {
          await axios.post(
            `${API_BASE}/canvas_templates/`,
            payload,
            config
          );
        }
        await this.fetchTemplates();
      } catch (e) {
        console.error("Save template error", e);
        this.error = e.response?.data?.message || "Failed to save template";
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    async register(userData) {
      this.isLoading = true;
      this.error = null;
      this.registrationSuccess = false;

      try {
        const response = await axios.post(`${API_BASE}/oauth/registration`, {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          password_confirmation: userData.password_confirmation
        });
        this.registrationSuccess = true;
        return response.data;
      } catch (e) {
        console.error("Registration error", e);
        this.error = e.response?.data?.message || "Registration failed";
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    async activateAccount(token) {
      this.isLoading = true;
      this.error = null;
      this.activationSuccess = false;

      try {
        const response = await axios.get(`${API_BASE}/oauth/activate/${token}`);
        this.activationSuccess = true;
        return response.data;
      } catch (e) {
        console.error("Activation error", e);
        this.error = e.response?.data?.message || "Account activation failed";
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    async requestPasswordReset(email) {
      this.isLoading = true;
      this.error = null;
      this.passwordResetRequested = false;

      try {
        const response = await axios.post(`${API_BASE}/auth/forgot-password`, { email });
        this.passwordResetRequested = true;
        return response.data;
      } catch (e) {
        console.error("Password reset request error", e);
        this.error = e.response?.data?.message || "Failed to request password reset";
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    async resetPassword(resetData) {
      this.isLoading = true;
      this.error = null;
      this.passwordResetSuccess = false;

      try {
        const response = await axios.post(`${API_BASE}/auth/reset-password`, {
          token: resetData.token,
          password: resetData.password,
          password_confirmation: resetData.password_confirmation
        });
        this.passwordResetSuccess = true;
        return response.data;
      } catch (e) {
        console.error("Password reset error", e);
        this.error = e.response?.data?.message || "Failed to reset password";
        throw e;
      } finally {
        this.isLoading = false;
      }
    }
  },
});
