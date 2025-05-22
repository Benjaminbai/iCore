<template>
  <contextHolder />
  <Modal
    v-model:open="DictContext.openConfigEdit"
    title="编辑"
    @ok="handleOk"
    okText="保存"
    cancelText="取消"
  >
    <Form
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
      ref="formRef"
    >
      <FormItem label="名称" name="itemText">
        <Input v-model:value="formState.itemText" />
      </FormItem>
      <FormItem label="数据值" name="itemValue">
        <Input v-model:value="formState.itemValue" />
      </FormItem>
      <FormItem label="描述" name="description">
        <Input v-model:value="formState.description" />
      </FormItem>
      <FormItem label="排序">
        <InputNumber v-model:value="formState.sortOrder" :min="0" />
      </FormItem>
      <FormItem label="状态">
        <RadioGroup v-model:value="formState.status">
          <Radio
            v-for="item in statusOptions"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</Radio
          >
        </RadioGroup>
      </FormItem>
    </Form>
  </Modal>
</template>

<script setup>
import { ref, inject, watch } from "vue";
import {
  Modal,
  Form,
  FormItem,
  Input,
  InputNumber,
  RadioGroup,
  Radio,
  message,
} from "ant-design-vue";

import {
  sysDictItemEditApi,
  sysDictItemDictItemCheckApi,
  sysDictItemAddApi,
} from "../api";

const DictContext = inject("DictContext");
const [messageApi, contextHolder] = message.useMessage();

const labelCol = {
  style: {
    width: "120px",
  },
};
const wrapperCol = {
  span: 14,
};

const rules = {
  itemText: [{ required: true, message: "请输入名称", trigger: "blur" }],
  itemValue: [{ required: true, message: "请输入数据值", trigger: "blur" }],
};

const statusOptions = [
  {
    label: "启用",
    value: 1,
  },
  {
    label: "不启用",
    value: 0,
  },
];

const formState = ref({});
const formRef = ref(null);

const sysDictItemDictItemCheck = async () => {
  const params = {
    dictId: DictContext.value.record.id,
    id: DictContext.value.configRecord.id,
    itemValue: formState.value.itemValue,
  };
  const res = await sysDictItemDictItemCheckApi(params);
  return res;
};

const sysDictItemEdit = () => {
  const params = {
    ...formState.value,
  };
  sysDictItemEditApi(params).then((res) => {
    if (res.success) {
      DictContext.value.openConfigEdit = false;
      DictContext.value.sysDictItemList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const sysDictItemAdd = () => {
  const params = {
    ...formState.value,
    dictId: DictContext.value.record.id,
  };
  sysDictItemAddApi(params).then((res) => {
    if (res.success) {
      DictContext.value.openConfigEdit = false;
      DictContext.value.sysDictItemList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const handleOk = () => {
  formRef.value
    .validate()
    .then(async () => {
      const res = await sysDictItemDictItemCheck();
      if (res.success) {
        formState.value.id ? sysDictItemEdit() : sysDictItemAdd();
      } else {
        messageApi.error(res.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

watch(
  () => DictContext.value.configRecord,
  (newVal) => {
    formState.value = newVal;
  }
);
</script>
