import axios from "axios";
import { message } from "ant-design-vue";

const env = import.meta.env;
export const baseURL = env.VITE_GLOB_DOMAIN_URL;

const Axios = axios.create({
  baseURL,
  timeout: 1000 * 10 * 3,
  headers: {
    "Content-Type": "application/json",
  },
});

Axios.interceptors.request.use(
  function (config) {
    config.headers["X-Access-Token"] = JSON.parse(
      localStorage.getItem("LOCALINFO") || "{}"
    )?.token;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (error.response?.status === 401) {
      message.error(error.response.data.message);
      localStorage.removeItem("LOCALINFO");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
    return Promise.reject(error);
  }
);

export default Axios;
