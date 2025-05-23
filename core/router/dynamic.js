import { BlankLayout } from "../libs";
import { getUserPermissionByTokenApi } from "../axios/User";
import router from "./index";

const componentLoader = (componentName) => {
  const componentMap = {
    "@core/menuMgt/index": () => import("../menuMgt/index.vue"),
    "@core/userMgt/index": () => import("../userMgt/index.vue"),
    "@core/roleMgt/index": () => import("../roleMgt/index.vue"),
    "@core/dictMgt/index": () => import("../dictMgt/index.vue"),
    "@core/myMsgMgt/index": () => import("../myMsgMgt/index.vue"),
    "@core/msgTempMgt/index": () => import("../msgTempMgt/index.vue"),
    "@core/online/cgFormMgt/index": () =>
      import("../online/cgFormMgt/index.vue"),
    "@core/online/cgReportMgt/index": () =>
      import("../online/cgReportMgt/index.vue"),

    "@core/home/index": () => import("../home/index.vue"),
  };
  return componentMap[componentName];
};

const recursionRoutes = (_menus) => {
  _menus.forEach((menu) => {
    if (menu.children) {
      menu.component = BlankLayout;
      recursionRoutes(menu.children);
    } else {
      menu.component = componentLoader(menu.component);
    }
  });
};

export const getUserPermissionByToken = async () => {
  if (JSON.parse(localStorage.getItem("LOCALINFO") || "{}")?.token) {
    const res = await getUserPermissionByTokenApi();
    if (res.success) {
      const menus = res.result.menu.filter(
        (menu) => menu.path !== "/dashboard/analysis"
      );
      localStorage.setItem("MENUS", JSON.stringify(menus));
      syntheticRoutes();
    }
  }
};

export const syntheticRoutes = async () => {
  if (
    JSON.parse(localStorage.getItem("LOCALINFO") || "{}")?.token &&
    localStorage.getItem("MENUS")
  ) {
    let menus = JSON.parse(localStorage.getItem("MENUS") || "[]");
    recursionRoutes(menus);
    genarateMenus(menus);
    menus.forEach((menu) => {
      router.addRoute(menu);
    });
  }
};

const recursionMenu = (_menus) => {
  _menus.forEach((menu) => {
    if (menu.children) {
      recursionMenu(menu.children);
    }
    menu.key = menu.path;
    menu.icon = "";
    menu.label = menu.meta.title;
    menu.title = menu.meta.title;
    delete menu.component;
  });
};

const genarateMenus = (dynamicRoutes) => {
  const menus = JSON.parse(JSON.stringify(dynamicRoutes));
  recursionMenu(menus);
};
