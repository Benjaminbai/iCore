import Axios from "./Axios";

export const logoutApi = () => Axios.get("/sys/logout");

export const getInputCodeApi = (code) => Axios.get(`/sys/randomImage/${code}`);

export const loginApi = (params) => Axios.post("/sys/login", params);

export const getUserPermissionByTokenApi = (params) =>
  Axios({
    url: "/sys/permission/getUserPermissionByToken",
    method: "get",
    params,
  });
