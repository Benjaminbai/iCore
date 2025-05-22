import { createApp } from "vue";

import App from "@/App.vue";
import router from "@core/router/router";
import { syntheticRoutes } from "@core/router/dynamic";
import "@core/router/guard";
import "@/style.css";

const main = async () => {
  await syntheticRoutes();
  createApp(App).use(router).mount("#app");
};

main();
