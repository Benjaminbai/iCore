import Axios from "@core/axios/Axios";

export const cgreportHeadListApi = (params) =>
  Axios({
    url: "/online/cgreport/head/list",
    method: "get",
    params,
  });

export const cgreportHeadDeleteApi = (params) =>
  Axios({
    url: "/online/cgreport/head/delete",
    method: "delete",
    params,
  });

export const cgreportHeadDeleteBatchApi = (params) =>
  Axios({
    url: "/online/cgreport/head/deleteBatch",
    method: "delete",
    params,
  });

export const cgreportParamListByHeadIdApi = (params) =>
  Axios({
    url: "/online/cgreport/param/listByHeadId",
    method: "get",
    params,
  });

export const cgreportItemListByHeadIdApi = (params) =>
  Axios({
    url: "/online/cgreport/item/listByHeadId",
    method: "get",
    params,
  });

export const sysDuplicateCheckApi = (params) =>
  Axios({
    url: "/sys/duplicate/check",
    method: "get",
    params,
  });

export const cgreportHeadParseSqlApi = (params) =>
  Axios({
    url: "/online/cgreport/head/parseSql",
    method: "get",
    params,
    paramsSerializer: function (params) {
      return Object.keys(params)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        )
        .join("&");
    },
  });

export const cgreportHeadAddApi = (data) =>
  Axios({
    url: "/online/cgreport/head/add",
    method: "post",
    data,
  });

export const cgreportHeadEditAllApi = (data) =>
  Axios({
    url: "/online/cgreport/head/editAll",
    method: "put",
    data,
  });
