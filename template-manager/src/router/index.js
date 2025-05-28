import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Template from "../views/Template.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/template/:id?", component: Template },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
];

const router = createRouter({
  history: createWebHistory("/AiScreenTemplates/"),
  routes,
});

export default router;
