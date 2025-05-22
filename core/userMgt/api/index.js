import Axios, { baseURL } from "@core/axios/Axios";

export const sysUserListAllApi = (params) =>
  Axios({
    url: "/sys/user/listAll",
    method: "get",
    params,
  });

export const sysRoleQueryAllNoByTenantApi = (params) =>
  Axios({
    url: "/sys/role/queryallNoByTenant",
    method: "get",
    params,
  });

export const sysDuplicateCheckApi = (params) =>
  Axios({
    url: "/sys/duplicate/check",
    method: "get",
    params,
  });

export const sysCommonUploadApi = {
  baseURL,
  url: baseURL + "/sys/common/upload",
};

export const sysCommonStaticApi = {
  baseURL,
  url: baseURL + "/sys/common/static/",
};

export const sysUserAddApi = (data) =>
  Axios({
    url: "/sys/user/add",
    method: "post",
    data,
  });

export const sysUserQueryUserRoleApi = (params) =>
  Axios({
    url: "/sys/user/queryUserRole",
    method: "get",
    params,
  });

export const sysUserEditApi = (data) =>
  Axios({
    url: "/sys/user/edit",
    method: "post",
    data,
  });

export const sysUserChangePasswordApi = (data) =>
  Axios({
    url: "/sys/user/changePassword",
    method: "put",
    data,
  });

export const sysUserFrozenBatchApi = (data) =>
  Axios({
    url: "/sys/user/frozenBatch",
    method: "put",
    data,
  });

export const sysUserDeleteApi = (params) =>
  Axios({
    url: "/sys/user/delete",
    method: "delete",
    params,
  });

export const sysUserDeleteBatchApi = (params) =>
  Axios({
    url: "/sys/user/deleteBatch",
    method: "delete",
    params,
  });

export const sysUserRecycleBinApi = (params) =>
  Axios({
    url: "/sys/user/recycleBin",
    method: "get",
    params,
  });

export const sysUserPutRecycleBinApi = (data) =>
  Axios({
    url: "/sys/user/putRecycleBin",
    method: "put",
    data,
  });

export const sysUserDeleteRecycleBinApi = (params) =>
  Axios({
    url: "/sys/user/deleteRecycleBin",
    method: "delete",
    params,
  });

export const sysUserImportExcelApi = {
  baseURL,
  url: baseURL + "/sys/user/importExcel",
};

export const sysUserExportXlsApi = (params, filename) =>
  downloadFile("/sys/user/exportXls", params, filename);

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
