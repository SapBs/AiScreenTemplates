import { defineStore } from "pinia";
import axios from "axios";

const API_BASE = 'https://dev-api.aiscreen.io/api/v1';

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
        console.log('Templates response:', response.data);
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

    async uploadMedia(file) {
      if (!(file instanceof File)) {
        throw new Error('Invalid file object');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('parent_uuid', '');

      try {
        const response = await axios.post(`${API_BASE}/media/file`, formData, {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
            'Content-Type': 'multipart/form-data',
            'accept': 'application/json'
          },
        });
        
        if (response.data && response.data.preview_image) {
          return response.data.preview_image;
        } else {
          throw new Error('Invalid response format from media upload');
        }
      } catch (e) {
        console.error("Media upload error", e);
        if (e.response?.data?.errors) {
          const errors = e.response.data.errors;
          const errorMessage = Object.values(errors).flat().join(', ');
          this.error = errorMessage;
        } else {
          this.error = e.response?.data?.message || "Failed to upload media";
        }
        throw e;
      }
    },

    async saveTemplate(template) {
      this.isLoading = true;
      this.error = null;
    
      try {
        const formData = new FormData();
        formData.append('name', template.name);
        formData.append('description', template.description || '');
        formData.append('width', `${template.width}`);
        formData.append('height', `${template.height}`);
        formData.append('objects', '');
        formData.append('tags', template.tags || []);
        if (template.preview_image instanceof File) {
          formData.append('preview_image', template.preview_image);
        }
    
        return this.sendTemplateRequest(template.id, formData);
      } catch (e) {
        console.error("Save template error", e);
        this.error = e.response?.data?.message || "Failed to save template";
        throw e;
      } finally {
        this.isLoading = false;
      }
    },
    
    async sendTemplateRequest(templateId, formData) {
      const config = {
        headers: { 
          Authorization: `Bearer ${this.authToken}`,
        },
      };
    
      try {
        let response;
        if (templateId) {
          config.params = { _method: 'PATCH' };
          response = await axios.post(
            `${API_BASE}/canvas_templates/${templateId}`,
            formData,
            config
          );
        } else {
          response = await axios.post(
            `${API_BASE}/canvas_templates`,
            formData,
            config
          );
        }
        await this.fetchTemplates();
        return response.data;
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
