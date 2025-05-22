import Axios, { baseURL } from "@core/axios/Axios";

export const sysMessageTemplateImportExcelApi = {
  baseURL,
  url: baseURL + "/sys/message/sysMessageTemplate/importExcel",
};

export const sysMessageTemplateExportXlsApi = (params, filename) =>
  downloadFile("/sys/message/sysMessageTemplate/exportXls", params, filename);

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

export const sysMessageTemplateListApi = (params) =>
  Axios({
    url: "/sys/message/sysMessageTemplate/list",
    method: "get",
    params,
  });

export const sysMessageTemplateAddApi = (data) =>
  Axios({
    url: "/sys/message/sysMessageTemplate/add",
    method: "post",
    data,
  });

export const sysDuplicateCheckApi = (params) =>
  Axios({
    url: "/sys/duplicate/check",
    method: "get",
    params,
  });

export const sysMessageTemplateEditApi = (data) =>
  Axios({
    url: "/sys/message/sysMessageTemplate/edit",
    method: "put",
    data,
  });

export const sysMessageTemplateDeleteBatchApi = (params) =>
  Axios({
    url: "/sys/message/sysMessageTemplate/deleteBatch",
    method: "delete",
    params,
  });
