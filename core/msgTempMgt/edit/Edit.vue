<template>
  <contextHolder />
  <Modal
    :open="MsgTempContext.openEdit"
    width="800px"
    title="编辑消息模版"
    okText="保存"
    cancelText="取消"
    @ok="handleOk"
    @cancel="MsgTempContext.openEdit = false"
  >
    <Form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :disabled="Boolean(MsgTempContext.isView)"
    >
      <FormItem label="模版标题" name="templateName">
        <Input
          v-model:value="formState.templateName"
          placeholder="请输入模版标题"
        />
      </FormItem>
      <FormItem
        label="模版编码"
        name="templateCode"
        :validateStatus="validateForm.templateCode_status"
        :help="validateForm.templateCode_message"
      >
        <Input
          v-model:value="formState.templateCode"
          placeholder="请输入模版编码"
          :disabled="Boolean(formState.id)"
          @input="changHandle($event, 'templateCode')"
        />
      </FormItem>
      <FormItem label="模版类型" name="templateType">
        <Select
          v-model:value="formState.templateType"
          placeholder="请选择模版类型"
        >
          <SelectOption value="1">文本</SelectOption>
          <SelectOption value="2">富文本</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="是否应用" name="useStatus">
        <Switch v-model:checked="formState.useStatus" />
      </FormItem>
      <FormItem label="模版内容" name="templateContent">
        <Editor
          v-if="formState.templateType == 2"
          v-model="formState.templateContent"
          :disabled="Boolean(MsgTempContext.isView)"
        />
        <Textarea
          v-model:value="formState.templateContent"
          placeholder="请输入模版内容"
          v-else="formState.templateType != 2"
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
  Select,
  SelectOption,
  Switch,
  Textarea,
  Input,
  message,
} from "ant-design-vue";
import { inject, ref, reactive, watch } from "vue";

import { Editor } from "../../libs";
import {
  sysMessageTemplateAddApi,
  sysDuplicateCheckApi,
  sysMessageTemplateEditApi,
} from "../api";

const [messageApi, contextHolder] = message.useMessage();
const MsgTempContext = inject("MsgTempContext");

const formRef = ref(null);
const formState = ref({});
const validateForm = reactive({});

const rules = {
  templateName: [
    { required: true, message: "请输入模版标题", trigger: "blur" },
  ],
  templateType: [
    { required: true, message: "请选择模版类型", trigger: "change" },
  ],
};
const labelCol = { span: 4 };
const wrapperCol = { span: 18 };

const sysMessageTemplateAdd = () => {
  const params = {
    ...formState.value,
    useStatus: formState.value.useStatus ? 1 : 0,
  };
  sysMessageTemplateAddApi(params).then((res) => {
    if (res.success) {
      MsgTempContext.value.sysMessageTemplateList();
      MsgTempContext.value.openEdit = false;
    } else {
      messageApi.error(res.message);
    }
  });
};

const handleOk = () => {
  formRef.value
    .validate()
    .then(() => {
      formState.value.id ? sysMessageTemplateEdit() : sysMessageTemplateAdd();
    })
    .catch(() => {});
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
      sysDuplicateCheck(fieldName);
    })
    .catch((err) => {
      console.log(err);
    });
}, 500);

const sysDuplicateCheck = (fieldName) => {
  const params = {
    roleCode: formState.value[fieldName],
  };
  sysDuplicateCheckApi(params).then((res) => {
    if (!res.success) {
      validateForm[`${fieldName}_status`] = "error";
      validateForm[`${fieldName}_message`] = res.message;
    } else {
      validateForm[`${fieldName}_status`] = "";
      validateForm[`${fieldName}_message`] = "";
    }
  });
};

const sysMessageTemplateEdit = () => {
  const params = {
    ...formState.value,
    useStatus: formState.value.useStatus ? 1 : 0,
  };
  sysMessageTemplateEditApi(params).then((res) => {
    if (res.success) {
      MsgTempContext.value.sysMessageTemplateList();
      MsgTempContext.value.openEdit = false;
    } else {
      messageApi.error(res.message);
    }
  });
};

watch(
  () => MsgTempContext.value.record,
  (val) => {
    if (val) {
      formState.value = val;
      formState.value.useStatus = val.useStatus == 1;
    }
  },
  { immediate: true }
);
</script>
