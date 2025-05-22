import Axios from "@core/axios/Axios";

export const cgformHeadListApi = (params) =>
  Axios({
    url: "/online/cgform/head/list",
    method: "get",
    params,
  });

export const cgformHeadDeleteApi = (params) =>
  Axios({
    url: "/online/cgform/head/delete",
    method: "delete",
    params,
  });

export const cgformHeadRemoveRecordApi = (params) =>
  Axios({
    url: "/online/cgform/head/removeRecord",
    method: "delete",
    params,
  });

export const cgformHeadDeleteBatchApi = (params) =>
  Axios({
    url: "/online/cgform/head/deleteBatch",
    method: "delete",
    params,
  });

export const sysDuplicateCheckApi = (params) =>
  Axios({
    url: "/sys/duplicate/check",
    method: "get",
    params,
  });

export const cgformFieldListByHeadIdApi = (params) =>
  Axios({
    url: "/online/cgform/field/listByHeadId",
    method: "get",
    params,
  });

export const cgformIndexListByHeadIdApi = (params) =>
  Axios({
    url: "/online/cgform/index/listByHeadId",
    method: "get",
    params,
  });

export const cgformEditAllApi = (data) =>
  Axios({
    url: "/online/cgform/api/editAll",
    method: "put",
    data,
  });

export const cgformAddAllApi = (data) =>
  Axios({
    url: "/online/cgform/api/addAll",
    method: "post",
    data,
  });

export const cgformCopyOnlineTableApi = (id, params) =>
  Axios({
    url: `/online/cgform/head/copyOnlineTable/${id}`,
    method: "get",
    params,
  });

export const cgformDoDbSynchNormalApi = (id, data) =>
  Axios({
    url: `/online/cgform/api/doDbSynch/${id}/normal`,
    method: "post",
    data,
  });

export const cgformDoDbSynchForceApi = (id, data) =>
  Axios({
    url: `/online/cgform/api/doDbSynch/${id}/force`,
    method: "post",
    data,
  });

export const cgformAuthColumnApi = (id, params) =>
  Axios({
    url: `/online/cgform/api/authColumn/${id}`,
    method: "get",
    params,
  });

export const cgformAuthColumnPostApi = (data) =>
  Axios({
    url: "/online/cgform/api/authColumn",
    method: "post",
    data,
  });

export const cgformAuthColumnPutApi = (data) =>
  Axios({
    url: "/online/cgform/api/authColumn",
    method: "put",
    data,
  });

export const cgformAuthButtonApi = (id, params) =>
  Axios({
    url: `/online/cgform/api/authButton/${id}`,
    method: "get",
    params,
  });

export const cgformAuthButtonPostApi = (data) =>
  Axios({
    url: "/online/cgform/api/authButton",
    method: "post",
    data,
  });

export const cgformButtonListApi = (id, params) =>
  Axios({
    url: `/online/cgform/button/list/${id}`,
    method: "get",
    params,
  });

export const cgformButtonAddApi = (data) =>
  Axios({
    url: "/online/cgform/button/add",
    method: "post",
    data,
  });

export const cgformButtonEditApi = (data) =>
  Axios({
    url: "/online/cgform/button/edit",
    method: "put",
    data,
  });

export const cgformButtonDeleteBatchApi = (params) =>
  Axios({
    url: "/online/cgform/button/deleteBatch",
    method: "delete",
    params,
  });

export const sysRoleListApi = (params) =>
  Axios({
    url: "/sys/role/list",
    method: "get",
    params,
  });

export const sysUserListApi = (params) =>
  Axios({
    url: "/sys/user/list",
    method: "get",
    params,
  });

export const cgformAuthPageApi = (id, url, params) =>
  Axios({
    url: `/online/cgform/api/authPage/${id}/${url}`,
    method: "get",
    params,
  });

export const cgformRoleColumnAuthApi = (id, parentId, data) =>
  Axios({
    url: `/online/cgform/api/roleColumnAuth/${id}/${parentId}`,
    method: "post",
    data,
  });

export const cgformRoleButtonAuthApi = (id, parentId, data) =>
  Axios({
    url: `/online/cgform/api/roleButtonAuth/${id}/${parentId}`,
    method: "post",
    data,
  });

export const cgformRoleAuthApi = (params) =>
  Axios({
    url: "/online/cgform/api/roleAuth",
    method: "get",
    params,
  });
