<template>
  <contextHolder />
  <Modal
    :open="UserContext.openPassword"
    title="修改密码"
    @ok="handleOk"
    okText="确认"
    cancelText="取消"
    @cancel="UserContext.openPassword = false"
  >
    <Form
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      layout="horizontal"
      :model="formState"
      :rules="rules"
      ref="formRef"
    >
      <FormItem label="用户帐号" name="username">
        <Input
          v-model:value="formState.username"
          placeholder="请输入用户帐号"
          @change="(e) => changHandle(e, 'username')"
          :disabled="Boolean(formState.id)"
        />
      </FormItem>
      <FormItem label="登录密码" name="password">
        <InputPassword
          v-model:value="formState.password"
          placeholder="请输入登录密码"
        />
      </FormItem>
      <FormItem label="确认密码" name="confirmPassword">
        <InputPassword
          v-model:value="formState.confirmPassword"
          placeholder="请确认密码"
        />
      </FormItem>
    </Form>
  </Modal>
</template>

<script setup>
import {
  Modal,
  Form,
  FormItem,
  Input,
  InputPassword,
  message,
} from "ant-design-vue";
import { inject, ref, watch } from "vue";

import { sysUserChangePasswordApi } from "../api";

const [messageApi, contextHolder] = message.useMessage();
const UserContext = inject("UserContext");

const labelCol = {
  style: {
    width: "80px",
  },
};

const wrapperCol = {
  span: 18,
};

const validatePass = async (_rule, value) => {
  if (value === "") {
    return Promise.reject("请输入密码!");
  } else if (
    value?.length < 8 ||
    !/^[a-zA-Z0-9~!@#$%^&*()_+`\-={}[\]:";'<>?,./]*$/.test(value)
  ) {
    return Promise.reject("密码由8位数字、大小写字母和特殊符号组成!");
  } else {
    if (formState.value.confirmPassword !== "") {
      formRef.value.validateFields("confirmPassword");
    }
    return Promise.resolve();
  }
};

const validatePass2 = async (_rule, value) => {
  if (value === "") {
    return Promise.reject("请输入确认密码!");
  } else if (value !== formState.value.password) {
    return Promise.reject("两次输入密码不一致!");
  } else {
    return Promise.resolve();
  }
};

const rules = {
  password: [
    {
      required: true,
      validator: validatePass,
      trigger: "blur",
    },
  ],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: "blur" },
  ],
};

const formRef = ref(null);
const formState = ref({});

const handleOk = () => {
  formRef.value
    .validate()
    .then(() => {
      sysUserChangePassword();
    })
    .catch((error) => {
      console.log(error);
    });
};

const sysUserChangePassword = () => {
  const { confirmPassword, password, username } = formState.value;
  const params = {
    confirmPassword,
    password,
    username,
  };
  sysUserChangePasswordApi(params).then((res) => {
    if (res.success) {
      UserContext.value.openPassword = false;
      UserContext.value.sysUserListAll();
    } else {
      messageApi.error(res.message);
    }
  });
};

watch(
  () => UserContext.value.record,
  (newValue) => {
    if (newValue) {
      formState.value = newValue;
    }
  }
);
</script>
