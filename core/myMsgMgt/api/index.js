import Axios from "../../axios/Axios";

export const sysGetMyAnnouncementSendApi = (params) =>
  Axios({
    url: "/sys/sysAnnouncementSend/getMyAnnouncementSend",
    method: "get",
    params,
  });

export const sysAnnouncementSendReadAllApi = (data) =>
  Axios({
    url: "/sys/sysAnnouncementSend/readAll",
    method: "put",
    data,
  });
