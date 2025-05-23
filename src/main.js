import { createApp } from "vue";
import { router, syntheticRoutes, Axios } from "@core/index";
import "@core/index.js.css";

import App from "@/App.vue";
import "@/style.css";

const main = async () => {
  Axios.defaults.baseURL = import.meta.env.VITE_GLOB_DOMAIN_URL;
  await syntheticRoutes();
  createApp(App).use(router).mount("#app");
};

main();
