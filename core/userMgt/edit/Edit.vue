<template>
  <contextHolder />
  <Drawer
    title="用户编辑"
    :open="UserContext.openEdit"
    @close="UserContext.openEdit = false"
  >
    <Form
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      layout="horizontal"
      :model="formState"
      :rules="rules"
      ref="formRef"
      :disabled="UserContext.disabled"
    >
      <FormItem
        label="用户帐号"
        name="username"
        :validateStatus="validateForm.username_status"
        :help="validateForm.username_message"
      >
        <Input
          v-model:value="formState.username"
          placeholder="请输入用户帐号"
          @change="(e) => changHandle(e, 'username')"
          :disabled="Boolean(formState.id)"
        />
      </FormItem>
      <FormItem label="登录密码" name="password" v-if="!formState.id">
        <InputPassword
          v-model:value="formState.password"
          placeholder="请输入登录密码"
        />
      </FormItem>
      <FormItem label="确认密码" name="confirmPassword" v-if="!formState.id">
        <InputPassword
          v-model:value="formState.confirmPassword"
          placeholder="请确认密码"
        />
      </FormItem>
      <FormItem label="用户姓名" name="realname">
        <Input
          v-model:value="formState.realname"
          placeholder="请输入用户姓名"
        />
      </FormItem>
      <FormItem
        label="工号"
        name="workNo"
        :validateStatus="validateForm.workNo_status"
        :help="validateForm.workNo_message"
      >
        <Input v-model:value="formState.workNo" placeholder="请输入用户帐号" />
      </FormItem>
      <FormItem label="角色">
        <Select
          v-model:value="formState.selectedroles"
          placeholder="请选择角色"
          mode="multiple"
          style="width: 100%"
        >
          <SelectOption
            v-for="item in roleOptions"
            :key="item.id"
            :value="item.id"
            >{{ item.roleName }}</SelectOption
          >
        </Select>
      </FormItem>
      <FormItem label="头像">
        <Upload
          v-model:fileList="fileList"
          :action="sysCommonUploadApi.url"
          :headers="{ 'X-Access-Token': TOKEN }"
          listType="picture-card"
          :data="{ biz: 'temp' }"
          :maxCount="1"
          @change="uploadHandler"
        >
          <div v-if="fileList.length < 1">
            <PlusOutlined />
            <div style="margin-top: 8px">上传</div>
          </div>
        </Upload>
      </FormItem>
      <FormItem label="生日">
        <DatePicker
          v-model:value="formState.birthday"
          placeholder="请选择日期"
          style="width: 100%"
          valueFormat="YYYY-MM-DD"
        />
      </FormItem>
      <FormItem label="性别">
        <Select
          v-model:value="formState.sex"
          placeholder="请选择性别"
          style="width: 100%"
        >
          <SelectOption :value="1">男</SelectOption>
          <SelectOption :value="2">女</SelectOption>
        </Select>
      </FormItem>
      <FormItem
        label="邮箱"
        :validateStatus="validateForm.email_status"
        :help="validateForm.email_message"
        name="email"
      >
        <Input
          type="email"
          v-model:value="formState.email"
          placeholder="请输入邮箱"
          @change="(e) => changHandle(e, 'email')"
        />
      </FormItem>
      <FormItem
        label="手机号"
        :validateStatus="validateForm.phone_status"
        :help="validateForm.phone_message"
        name="phone"
      >
        <Input
          type="tel"
          v-model:value="formState.phone"
          placeholder="请输入手机号"
          @change="(e) => changHandle(e, 'phone')"
        />
      </FormItem>
      <FormItem
        label="座机"
        :validateStatus="validateForm.telephone_status"
        :help="validateForm.telephone_message"
        name="telephone"
      >
        <Input
          type="tel"
          v-model:value="formState.telephone"
          placeholder="请输入座机号"
          @change="(e) => changHandle(e, 'telephone')"
        />
      </FormItem>
      <FormItem label="工作流引擎">
        <RadioGroup
          v-model:value="formState.activitiSync"
          placeholder="请输入用户帐号"
        >
          <Radio :value="1">同步</Radio>
          <Radio :value="0">不同步</Radio>
        </RadioGroup>
      </FormItem>
    </Form>

    <template #footer>
      <Button type="primary" @click="saveHandler">保存</Button>
    </template>
  </Drawer>
</template>

<script setup>
import {
  Drawer,
  message,
  Button,
  Form,
  FormItem,
  Input,
  Select,
  SelectOption,
  DatePicker,
  Upload,
  Radio,
  RadioGroup,
  InputPassword,
} from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { inject, onMounted, ref, reactive, watch } from "vue";

import {
  sysRoleQueryAllNoByTenantApi,
  sysDuplicateCheckApi,
  sysCommonUploadApi,
  sysUserAddApi,
  sysUserQueryUserRoleApi,
  sysCommonStaticApi,
  sysUserEditApi,
} from "../api";

const [messageApi, contextHolder] = message.useMessage();
const UserContext = inject("UserContext");
const TOKEN = JSON.parse(localStorage.getItem("LOCALINFO") || "{}")?.token;

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

const validateEmail = async (_rule, value) => {
  if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
    return Promise.reject("请输入正确的邮箱格式!");
  } else {
    return Promise.resolve();
  }
};

const validatePhone = async (_rule, value) => {
  if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(value)) {
    console.log(44444, value);
    return Promise.reject("请输入正确的手机号格式!");
  } else {
    return Promise.resolve();
  }
};

const validateTelephone = async (_rule, value) => {
  if (!/^0\d{2,3}-?\d{7,8}$/.test(value)) {
    return Promise.reject("请输入正确的座机号格式!");
  } else {
    return Promise.resolve();
  }
};

const rules = {
  username: [{ required: true, message: "请输入用户帐号", trigger: "blur" }],
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
  realname: [{ required: true, message: "请输入用户姓名", trigger: "blur" }],
  workNo: [{ required: true, message: "请输入工号", trigger: "blur" }],
  email: [{ required: true, validator: validateEmail, trigger: "blur" }],
  phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
  telephone: [
    { required: true, validator: validateTelephone, trigger: "blur" },
  ],
};

const formRef = ref(null);
const formState = ref({});
const roleOptions = ref([]);
const validateForm = reactive({});
const fileList = ref([]);

const sysRoleQueryAllNoByTenant = () => {
  sysRoleQueryAllNoByTenantApi().then((res) => {
    if (res.success) {
      roleOptions.value = res.result;
    } else {
      messageApi.error(res.message);
    }
  });
};

const sysDuplicateCheck = (fieldName, fieldVal) => {
  const params = {
    tableName: "sys_user",
    fieldName,
    fieldVal,
  };
  sysDuplicateCheckApi(params).then((res) => {
    if (!res.success) {
      validateForm[fieldName + "_status"] = "error";
      validateForm[fieldName + "_message"] = res.message;
    } else {
      validateForm[fieldName + "_status"] = "";
      validateForm[fieldName + "_message"] = "";
    }
  });
};

const useDebounce = (func, wait) => {
  const timeout = ref(null);
  const debouncedFunc = (...args) => {
    if (timeout.value) clearTimeout(timeout.value);
    timeout.value = setTimeout(() => {
      func(...args);
    }, wait);
  };
  return debouncedFunc;
};

const changHandle = useDebounce((e, fieldName) => {
  formRef.value
    .validateFields([fieldName])
    .then(() => {
      sysDuplicateCheck(fieldName, e.target.value);
    })
    .catch((err) => {
      console.log(err);
    });
}, 500);

const uploadHandler = (info) => {
  if (info.file.status === "done") {
    formState.value.avatar = info.file.response.message;
  }
};

const sysUserAdd = () => {
  const params = {
    ...formState.value,
    selectedroles: formState.value.selectedroles.join(","),
  };
  sysUserAddApi(params).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      afterSaveReload();
    } else {
      messageApi.error(res.message);
    }
  });
};

const afterSaveReload = () => {
  setTimeout(() => {
    UserContext.value.sysUserListAll();
    UserContext.value.openEdit = false;
  }, 1000);
};

const saveHandler = () => {
  formRef.value
    .validate()
    .then(() => {
      formState.value.id ? sysUserEdit() : sysUserAdd();
    })
    .catch((error) => {
      console.log(error);
    });
};

const sysUserQueryUserRole = (userId) => {
  const params = {
    userid: userId,
  };
  sysUserQueryUserRoleApi(params).then((res) => {
    if (res.success) {
      formState.value.selectedroles = res.result;
    } else {
      messageApi.error(res.message);
    }
  });
};

const sysUserEdit = () => {
  const params = {
    ...formState.value,
    selectedroles: formState.value.selectedroles.join(","),
  };
  sysUserEditApi(params).then((res) => {
    if (res.success) {
      afterSaveReload();
    } else {
      messageApi.error(res.message);
    }
  });
};

onMounted(() => {
  sysRoleQueryAllNoByTenant();
});

watch(
  () => UserContext.value.record,
  (newVal) => {
    if (newVal.id) {
      formState.value = newVal;
      fileList.value = [
        {
          url: newVal.avatar?.startsWith("http")
            ? newVal.avatar
            : sysCommonStaticApi.url + newVal.avatar,
          name: newVal.avatar,
          status: "done",
        },
      ];
      sysUserQueryUserRole(newVal.id);
    } else {
      formState.value = {};
      fileList.value = [];
    }
  },
  { immediate: true }
);
</script>
