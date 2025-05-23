import Axios from "../../axios/Axios";

export const sysPermissionListApi = (params) =>
  Axios({
    url: "/sys/permission/list",
    method: "get",
    params,
  });

export const sysPermissionCheckPermDuplicationApi = (params) =>
  Axios({
    url: "/sys/permission/checkPermDuplication",
    method: "get",
    params,
  });

export const sysPermissionEditApi = (data) =>
  Axios({
    url: "/sys/permission/edit",
    method: "post",
    data,
  });

export const sysRoleIndexQueryDefIndexApi = (params) =>
  Axios({
    url: "/sys/sysRoleIndex/queryDefIndex",
    method: "get",
    params,
  });

export const sysPermissionAddApi = (data) =>
  Axios({
    url: "/sys/permission/add",
    method: "post",
    data,
  });

export const sysPermissionDeleteApi = (params) =>
  Axios({
    url: "/sys/permission/delete",
    method: "delete",
    params,
  });
