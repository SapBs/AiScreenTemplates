import { defineStore } from "pinia";
import axios from "axios";

export const useMainStore = defineStore("main", {
  state: () => ({
    templates: [],
    tags: [],
    authToken: localStorage.getItem("token") || "",
    user: null,
    isAuthenticated: !!localStorage.getItem("token"),
  }),
  actions: {
    async login(userEmail, userPassword) {
      try {
        const response = await axios.post(
          "https://dev-api.aiscreen.io/api/v1/login",
          {
            email: userEmail,
            password: userPassword,
          },
        );
        this.authToken = response.data.token;
        this.isAuthenticated = true;
        localStorage.setItem("token", this.authToken);
      } catch (e) {
        console.error("Login error", e);
        this.isAuthenticated = false;
      }
    },

    async fetchTemplates() {
      try {
        const response = await axios.get("/api/v1/canvas_templates", {
          headers: { Authorization: `Bearer ${this.authToken}` },
        });
        this.templates = response.data;
        this.extractTags();
      } catch (e) {
        console.error("Fetch templates error", e);
      }
    },
    extractTags() {
      const tagsSet = new Set();
      this.templates.forEach((t) => {
        t.tags.forEach((tag) => tagsSet.add(tag));
      });
      this.tags = Array.from(tagsSet);
    },
    async deleteTemplate(id) {
      try {
        console.log("Auth token delete:", this.authToken);
        await axios.delete(`/api/v1/canvas_templates`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.authToken}`,
          },
          data: { id },
        });
        this.templates = this.templates.filter((t) => t.id !== id);
      } catch (e) {
        console.error("Delete error", e);
      }
    },
    async saveTemplate(template) {
      try {
        if (template.id) {
          console.log("Auth token save existing:", this.authToken);
          // Update existing
          await axios.put(
            `/api/v1/canvas_templates/${template.id}`,
            {
              name: template.name,
              description: template.description || "",
              width: template.width,
              height: template.height,
              preview_image: template.preview_image || "",
              objects: "",
              tags: template.tags || null,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.authToken}`,
              },
            },
          );
        } else {
          console.log("Auth token create new:", this.authToken);
          await axios.post(
            `/api/v1/canvas_templates/`, // URL
            {
              name: template.name,
              description: template.description || "",
              width: template.width,
              height: template.height,
              preview_image: template.preview_image || "",
              objects: "",
              tags: template.tags || null,
            },
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
      }
    },
  },
});
