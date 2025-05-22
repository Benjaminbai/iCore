<template>
  <contextHolder />
  <Drawer
    :open="open"
    title="编辑菜单"
    placement="right"
    width="450"
    @close="onClose"
  >
    <Form
      :labelCol="{ span: 6 }"
      :wrapperCol="{ span: 18 }"
      :model="formState"
      :rules="rules"
      ref="formRef"
    >
      <FormItem label="菜单类型">
        <RadioGroup v-model:value="formState.menuType">
          <RadioButton :value="0">一级菜单</RadioButton>
          <RadioButton :value="1">子菜单</RadioButton>
        </RadioGroup>
      </FormItem>
      <FormItem label="菜单名称" name="name">
        <Input v-model:value="formState.name" placeholder="请输入菜单名称" />
      </FormItem>
      <FormItem
        label="上级菜单"
        name="parentId"
        v-if="formState.menuType === 1"
      >
        <TreeSelect
          v-model:value="formState.parentId"
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请输选择上级菜单"
          allow-clear
          tree-default-expand-all
          :tree-data="recordList"
          :field-names="{
            children: 'children',
            label: 'name',
            value: 'id',
          }"
          tree-node-filter-prop="label"
        >
        </TreeSelect>
      </FormItem>
      <FormItem label="访问路径" name="url">
        <Input v-model:value="formState.url" placeholder="请输入访问路径" />
      </FormItem>
      <FormItem label="前端组件">
        <Input
          v-model:value="formState.component"
          placeholder="请输入前端组件"
        />
      </FormItem>
      <FormItem label="菜单图标">
        <Input v-model:value="formState.icon" placeholder="请输入菜单图标" />
      </FormItem>
      <FormItem label="排序">
        <InputNumber v-model:value="formState.sortNo" :min="0" />
      </FormItem>
      <FormItem label="是否路由菜单">
        <Switch
          v-model:checked="formState.route"
          checkedChildren="开"
          unCheckedChildren="关"
        />
      </FormItem>
      <FormItem label="打开方式">
        <Switch
          v-model:checked="formState.internalOrExternal"
          checkedChildren="内部"
          unCheckedChildren="外部"
        />
      </FormItem>
    </Form>
    <template #footer>
      <Button type="primary" @click="onSubmit">保存</Button>
    </template>
  </Drawer>
</template>

<script setup>
import {
  Form,
  FormItem,
  Input,
  Button,
  Drawer,
  RadioGroup,
  RadioButton,
  InputNumber,
  Switch,
  message,
  TreeSelect,
} from "ant-design-vue";
import { ref } from "vue";

import {
  sysPermissionCheckPermDuplicationApi,
  sysPermissionEditApi,
  sysRoleIndexQueryDefIndexApi,
  sysPermissionAddApi,
} from "./api";

const [messageApi, contextHolder] = message.useMessage();

const rules = {
  name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  url: [{ required: true, message: "请输入访问路径", trigger: "blur" }],
  parentId: [{ required: true, message: "请选择上级菜单", trigger: "blur" }],
};

const { open, record, recordList } = defineProps([
  "open",
  "record",
  "recordList",
]);
const emit = defineEmits(["setOpen", "refresh"]);

const formRef = ref();
const formState = ref(record);

const onClose = () => {
  emit("setOpen", false);
};

const sysPermissionCheckPermDuplication = async () => {
  const params = {
    id: record.id,
    url: formState.value.url,
    alwaysShow: false,
  };
  const res = await sysPermissionCheckPermDuplicationApi(params);
  return res;
};

const sysPermissionEdit = async () => {
  const params = {
    ...formState.value,
    id: record.id,
  };
  const res = await sysPermissionEditApi(params);
  if (res.success) {
    messageApi.success(res.message);
    emit("refresh");
  } else {
    messageApi.error(res.message);
  }
};

const sysRoleIndexQueryDefIndex = async () => {
  const res = await sysRoleIndexQueryDefIndexApi();
  if (!res.success) {
    messageApi.error(res.message);
  }
};

const sysPermissionAdd = () => {
  const params = {
    ...formState.value,
  };
  sysPermissionAddApi(params).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      emit("refresh");
    } else {
      messageApi.error(res.message);
    }
  });
};

const onSubmit = () => {
  formRef.value
    .validate()
    .then(async () => {
      const validateRes = await sysPermissionCheckPermDuplication();
      if (validateRes.success) {
        record.id ? sysPermissionEdit() : sysPermissionAdd();
        sysRoleIndexQueryDefIndex();
      } else {
        messageApi.error(validateRes.message);
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};
</script>
