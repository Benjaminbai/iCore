<template>
  <Drawer
    :open="RoleContext.openEdit"
    title="角色编辑"
    placement="right"
    @close="RoleContext.openEdit = false"
  >
    <Form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      :disabled="Boolean(mode)"
    >
      <FormItem label="角色名称" name="roleName">
        <Input v-model:value="formState.roleName" />
      </FormItem>
      <FormItem
        label="角色编码"
        name="roleCode"
        :validateStatus="validateForm.roleCode_status"
        :help="validateForm.roleCode_message"
      >
        <Input
          v-model:value="formState.roleCode"
          @input="changHandle($event, 'roleCode')"
          :disabled="Boolean(formState.id)"
        />
      </FormItem>
      <FormItem label="备注" name="description">
        <Textarea v-model:value="formState.description" />
      </FormItem>
    </Form>
    <template #footer v-if="!Boolean(mode)">
      <Button type="primary" @click="saveHandler">保存</Button>
    </template>
  </Drawer>
</template>

<script setup>
import {
  Drawer,
  Button,
  Input,
  Textarea,
  FormItem,
  Form,
} from "ant-design-vue";
import { inject, ref, reactive, watch } from "vue";

import { sysRoleCheckRoleCodeApi, sysRoleAddApi, sysRoleEditApi } from "../api";

const RoleContext = inject("RoleContext");

const formRef = ref();
const validateForm = reactive({});
const mode = ref(null);
const labelCol = {
  span: 6,
};
const wrapperCol = {
  span: 18,
};

const rules = {
  roleName: [
    {
      required: true,
      message: "Please input Activity name",
      trigger: "blur",
    },
  ],
  roleCode: [
    {
      required: true,
      message: "Please input Activity name",
      trigger: "blur",
    },
  ],
};

const formState = ref({});

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
      sysRoleCheckRoleCode();
    })
    .catch((err) => {
      console.log(err);
    });
}, 500);

const sysRoleCheckRoleCode = () => {
  const params = {
    roleCode: formState.value.roleCode,
  };
  sysRoleCheckRoleCodeApi(params).then((res) => {
    if (!res.success) {
      validateForm["roleCode_status"] = "error";
      validateForm["roleCode_message"] = res.message;
    } else {
      validateForm["roleCode_status"] = "";
      validateForm["roleCode_message"] = "";
    }
  });
};

const sysRoleAdd = () => {
  const params = {
    ...formState.value,
  };
  sysRoleAddApi(params).then((res) => {
    if (res.success) {
      RoleContext.value.sysRoleList();
      RoleContext.value.openEdit = false;
    } else {
      messageApi.error(res.message);
    }
  });
};

const sysRoleEdit = () => {
  const params = {
    ...formState.value,
  };
  sysRoleEditApi(params).then((res) => {
    if (res.success) {
      RoleContext.value.sysRoleList();
      RoleContext.value.openEdit = false;
    } else {
      messageApi.error(res.message);
    }
  });
};

const saveHandler = () => {
  formRef.value
    .validate()
    .then(() => {
      formState.value.id ? sysRoleEdit() : sysRoleAdd();
    })
    .catch((error) => {
      console.log(error);
    });
};

watch(
  () => RoleContext.value.record,
  (newVal) => {
    if (newVal?.id) {
      formState.value = newVal;
    } else {
      formState.value = {};
    }
  },
  { immediate: true }
);
watch(
  () => RoleContext.value.isView,
  (newVal) => {
    mode.value = newVal;
  },
  { immediate: true }
);
</script>
