import BlankLayout from "@core/libs/layout/BlankLayout.vue";
import { getUserPermissionByTokenApi } from "@core/axios/User";
import router from "./router";

const componentLoader = (componentName) => {
  const componentMap = {
    "@core/menuMgt/MenuMgt": () => import("@core/menuMgt/MenuMgt.vue"),
    "@core/userMgt/UserMgt": () => import("@core/userMgt/UserMgt.vue"),
    "@core/roleMgt/RoleMgt": () => import("@core/roleMgt/RoleMgt.vue"),
    "@core/dictMgt/DictMgt": () => import("@core/dictMgt/DictMgt.vue"),
    "@core/myMsgMgt/MyMsgMgt": () => import("@core/myMsgMgt/MyMsgMgt.vue"),
    "@core/msgTempMgt/MsgTempMgt": () =>
      import("@core/msgTempMgt/MsgTempMgt.vue"),
    "@core/online/cgFormMgt/CgFormMgt": () =>
      import("@core/online/cgFormMgt/CgFormMgt.vue"),
    "@core/online/cgReportMgt/CgReportMgt": () =>
      import("@core/online/cgReportMgt/CgReportMgt.vue"),

    "@core/home/Home": () => import("@core/home/Home.vue"),
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
