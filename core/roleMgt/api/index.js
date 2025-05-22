import Axios, { baseURL } from "@core/axios/Axios";

export const sysRoleImportExcelApi = {
  baseURL,
  url: baseURL + "/sys/role/importExcel",
};

export const sysRoleExportXlsApi = (params, filename) =>
  downloadFile("/sys/role/exportXls", params, filename);

function downloadFile(url, params, filename) {
  Axios({
    url: url,
    method: "get",
    params,
    responseType: "blob",
  })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      console.error("下载文件失败:", error);
    });
}

export const sysRoleListApi = (params) =>
  Axios({
    url: "/sys/role/list",
    method: "get",
    params,
  });

export const sysUserRoleListApi = (params) =>
  Axios({
    url: "/sys/user/userRoleList",
    method: "get",
    params,
  });

export const sysUserDeleteUserRoleApi = (params) =>
  Axios({
    url: "/sys/user/deleteUserRole",
    method: "delete",
    params,
  });

export const sysUserDeleteUserRoleBatchApi = (params) =>
  Axios({
    url: "/sys/user/deleteUserRoleBatch",
    method: "delete",
    params,
  });

export const sysUserListApi = (params) =>
  Axios({
    url: "/sys/user/list",
    method: "get",
    params,
  });

export const sysUserAddSysUserRoleApi = (data) =>
  Axios({
    url: "/sys/user/addSysUserRole",
    method: "post",
    data,
  });

export const sysRoleDeleteApi = (params) =>
  Axios({
    url: "/sys/role/delete",
    method: "delete",
    params,
  });

export const sysRoleCheckRoleCodeApi = (params) =>
  Axios({
    url: "/sys/role/checkRoleCode",
    method: "get",
    params,
  });

export const sysRoleAddApi = (data) =>
  Axios({
    url: "/sys/role/add",
    method: "post",
    data,
  });

export const sysRoleEditApi = (data) =>
  Axios({
    url: "/sys/role/edit",
    method: "post",
    data,
  });

export const sysRoleQueryTreeListApi = (params) =>
  Axios({
    url: "/sys/role/queryTreeList",
    method: "get",
    params,
  });

export const sysRoleQueryRolePermissionApi = (params) =>
  Axios({
    url: "/sys/permission/queryRolePermission",
    method: "get",
    params,
  });

export const sysPermissionSaveRolePermissionApi = (data) =>
  Axios({
    url: "/sys/permission/saveRolePermission",
    method: "post",
    data,
  });
