export {
  Editor,
  FullModal,
  BlankLayout,
  HscfLayout,
  Logo,
  Menu,
  Table,
  UserInfo,
} from "./libs";

import { Axios } from "./axios";
import router, { syntheticRoutes } from "./router";

import DictMgt from "./dictMgt/index.vue";
import Home from "./home/index.vue";
import MenuMgt from "./menuMgt/index.vue";
import MsgTempMgt from "./msgTempMgt/index.vue";
import MyMsgMgt from "./myMsgMgt/index.vue";
import CgFormMgt from "./online/cgFormMgt/index.vue";
import CgReportMgt from "./online/cgReportMgt/index.vue";
import RoleMgt from "./roleMgt/index.vue";
import UserMgt from "./userMgt/index.vue";

export {
  DictMgt,
  Home,
  MenuMgt,
  MsgTempMgt,
  MyMsgMgt,
  CgFormMgt,
  CgReportMgt,
  RoleMgt,
  UserMgt,
  router,
  syntheticRoutes,
  Axios,
};
