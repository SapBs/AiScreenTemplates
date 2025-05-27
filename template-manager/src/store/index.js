import { defineStore } from "pinia";
import axios from "axios";

const API_BASE = '/AiScreenTemplates/api/v1';

export const useMainStore = defineStore("main", {
  state: () => ({
    templates: [],
    tags: [],
    authToken: localStorage.getItem("token") || "",
    user: null,
    isAuthenticated: !!localStorage.getItem("token"),
    isLoading: false,
    error: null
  }),
  actions: {
    async login(userEmail, userPassword) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(
          `${API_BASE}/login`,
          {
            email: userEmail,
            password: userPassword,
          },
        );
        this.authToken = response.data.token;
        this.isAuthenticated = true;
        localStorage.setItem("token", this.authToken);
      } catch (e) {
        this.isLoading = false;
        console.error("Login error", e);
        this.error = e.response?.data?.message || "Login failed";
        this.isAuthenticated = false;
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchTemplates() {
      if (this.authToken) {
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.authToken}`,
          },
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
      try {
        const templateData = {
          name: template.name,
          description: template.description || "",
          width: template.width,
          height: template.height,
          preview_image: template.preview_image || "",
          objects: "",
          tags: template.tags || [],
        };
        if (template.id) {
          await axios.put(
            `${API_BASE}/canvas_templates/${template.id}`,
            templateData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.authToken}`,
              },
            },
          );
        } else {
          await axios.post(
            `${API_BASE}/canvas_templates/`,
            templateData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.authToken}`,
              },
            },
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
    }
  },
});
