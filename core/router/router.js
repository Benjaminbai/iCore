import { createWebHistory, createRouter } from "vue-router";

import BlankLayout from "@core/libs/layout/BlankLayout.vue";

export const routes = [
  {
    path: "/",
    component: BlankLayout,
    children: [
      { path: "login", component: () => import("@/views/login/Login.vue") },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
