<template>
  <div>
    <contextHolder />
    <Dropdown>
      <Space :size="10">
        <Avatar
          :size="30"
          :src="userInfo?.avatar"
          style="background-color: #87d068"
        >
          <template #icon><UserOutlined /></template>
        </Avatar>
        <span style="color: #fff">{{ userInfo?.realname }}</span>
      </Space>
      <template #overlay>
        <Menu>
          <MenuItem>
            <a href="javascript:;" @click="logoutHandler">退出系统</a>
          </MenuItem>
        </Menu>
      </template>
    </Dropdown>
  </div>
</template>

<script setup>
import {
  Menu,
  Space,
  Avatar,
  Dropdown,
  MenuItem,
  Modal,
  message,
} from "ant-design-vue";
import { UserOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";

import { logoutApi } from "../../axios/User";

const router = useRouter();
const [messageApi, contextHolder] = message.useMessage();
const userInfo = JSON.parse(localStorage.getItem("LOCALINFO"))?.userInfo;

const logoutHandler = () => {
  Modal.confirm({
    title: "温馨提醒",
    content: "是否确认退出系统?",
    onCancel: () => {},
    onOk: () => {
      logoutApi().then((res) => {
        if (res.code === 200) {
          localStorage.removeItem("LOCALINFO");
          localStorage.removeItem("MENUS");
          router.push({ path: "/login" });
        } else {
          messageApi.error(res.message);
        }
      });
    },
    cancelText: "取消",
    okText: "确认",
  });
};
</script>

<style scoped></style>
