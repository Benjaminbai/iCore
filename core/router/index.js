import { createWebHistory, createRouter } from "vue-router";

import { BlankLayout } from "../libs";
import { syntheticRoutes } from "./dynamic";

export const routes = [
  {
    path: "/",
    component: BlankLayout,
    children: [
      { path: "login", component: () => import("../login/index.vue") },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
export { syntheticRoutes };

const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  if (whiteList.includes(from.path)) {
    await syntheticRoutes();
  }
  next();
});
