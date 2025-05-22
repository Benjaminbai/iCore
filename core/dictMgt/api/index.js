import Axios, { baseURL } from "@core/axios/Axios";

export const sysDictListApi = (params) =>
  Axios({
    url: "/sys/dict/list",
    method: "get",
    params,
  });

export const sysDuplicateCheckApi = (params) =>
  Axios({
    url: "/sys/duplicate/check",
    method: "get",
    params,
  });

export const sysDictAddApi = (data) =>
  Axios({
    url: "/sys/dict/add",
    method: "post",
    data,
  });

export const sysDictEditApi = (data) =>
  Axios({
    url: "/sys/dict/edit",
    method: "post",
    data,
  });

export const sysDictDeleteApi = (params) =>
  Axios({
    url: "/sys/dict/delete",
    method: "delete",
    params,
  });

export const sysDictDeleteBatchApi = (params) =>
  Axios({
    url: "/sys/dict/deleteBatch",
    method: "delete",
    params,
  });

export const sysDictItemListApi = (params) =>
  Axios({
    url: "/sys/dictItem/list",
    method: "get",
    params,
  });

export const sysDictItemDictItemCheckApi = (params) =>
  Axios({
    url: "/sys/dictItem/dictItemCheck",
    method: "get",
    params,
  });

export const sysDictItemEditApi = (data) =>
  Axios({
    url: "/sys/dictItem/edit",
    method: "post",
    data,
  });

export const sysDictItemAddApi = (data) =>
  Axios({
    url: "/sys/dictItem/add",
    method: "post",
    data,
  });

export const sysDictItemDeleteApi = (params) =>
  Axios({
    url: "/sys/dictItem/delete",
    method: "delete",
    params,
  });

export const sysDictRefleshCacheApi = (params) =>
  Axios({
    url: "/sys/dict/refleshCache",
    method: "get",
    params,
  });

export const sysDictQueryAllDictItemsApi = (params) =>
  Axios({
    url: "/sys/dict/queryAllDictItems",
    method: "get",
    params,
  });

export const sysDictDeleteListApi = (params) =>
  Axios({
    url: "/sys/dict/deleteList",
    method: "get",
    params,
  });

export const sysDictBackApi = (id, data) =>
  Axios({
    url: `/sys/dict/back/${id}`,
    method: "put",
    data,
  });

export const sysDictDeletePhysicApi = (id, params) =>
  Axios({
    url: `/sys/dict/deletePhysic/${id}`,
    method: "delete",
    params,
  });

export const sysDictPutRecycleBinApi = (data) =>
  Axios({
    url: "/sys/dict/putRecycleBin",
    method: "put",
    data,
  });

export const sysDictDeleteRecycleBinApi = (params) =>
  Axios({
    url: "/sys/dict/deleteRecycleBin",
    method: "delete",
    params,
  });

export const sysDictExportXlsApi = (params, filename) =>
  downloadFile("/sys/dict/exportXls", params, filename);

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

export const sysDictImportExcelApi = {
  baseURL,
  url: baseURL + "/sys/dict/importExcel",
};
