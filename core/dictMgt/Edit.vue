<template>
  <contextHolder />
  <Modal
    :open="DictContext.openEdit"
    title="编辑字典"
    @ok="handleOk"
    @cancel="DictContext.openEdit = false"
  >
    <Form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <FormItem label="字典名称" name="dictName">
        <Input v-model:value="formState.dictName" />
      </FormItem>
      <FormItem label="字典编码" name="dictCode">
        <Input
          v-model:value="formState.dictCode"
          :disabled="Boolean(formState.id)"
        />
      </FormItem>
      <FormItem label="描述" name="description">
        <Input v-model:value="formState.description" />
      </FormItem>
    </Form>
  </Modal>
</template>

<script setup>
import { Modal, Form, FormItem, Input, message } from "ant-design-vue";
import { inject, ref, watch } from "vue";

import { sysDuplicateCheckApi, sysDictAddApi, sysDictEditApi } from "./api";

const DictContext = inject("DictContext");
const [messageApi, contextHolder] = message.useMessage();

const labelCol = {
  span: 5,
};
const wrapperCol = {
  span: 16,
};

const formState = ref({});
const rules = {
  dictName: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
  dictCode: [{ required: true, message: "请输入字典编码", trigger: "blur" }],
};
const formRef = ref(null);

const handleOk = () => {
  formRef.value
    .validate()
    .then(async () => {
      const res = await sysDuplicateCheck();
      if (res.success) {
        formState.value.id ? sysDictEdit() : sysDictAdd();
      } else {
        messageApi.error(res.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const sysDuplicateCheck = async () => {
  const params = {
    tableName: "sys_dict",
    fieldName: "dict_code",
    fieldVal: formState.value.dictCode,
    dataId: formState.value.id,
  };
  const res = await sysDuplicateCheckApi(params);
  return res;
};

const sysDictAdd = () => {
  const params = {
    ...formState.value,
  };
  sysDictAddApi(params).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      DictContext.value.openEdit = false;
      DictContext.value.sysDictList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const sysDictEdit = () => {
  const params = {
    ...formState.value,
  };
  sysDictEditApi(params).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      DictContext.value.openEdit = false;
      DictContext.value.sysDictList();
    } else {
      messageApi.error(res.message);
    }
  });
};

watch(
  () => DictContext.value.record,
  (val) => {
    formState.value = { ...val };
  }
);
</script>
