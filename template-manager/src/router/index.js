import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Template from "../views/Template.vue";
import Login from "../views/Login.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/template/:id?", component: Template },
  { path: "/login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
