import router from "./router";
import { syntheticRoutes } from "./dynamic";

const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  if (whiteList.includes(from.path)) {
    await syntheticRoutes();
  }
  next();
});
