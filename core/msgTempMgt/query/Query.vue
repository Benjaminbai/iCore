<template>
  <Form
    ref="formRef"
    :model="formState"
    @finish="onFinish"
    :labelCol="{ span: 4 }"
    :wrapperCol="{ span: 20 }"
    style="margin-bottom: 24px"
  >
    <Row :gutter="24">
      <Col :span="8">
        <FormItem label="模版标题" name="templateName">
          <Input
            v-model:value="formState.templateName"
            placeholder="请输入模版标题"
          ></Input>
        </FormItem>
      </Col>
      <Col :span="8">
        <FormItem label="模版编码" name="templateCode">
          <Input
            v-model:value="formState.templateCode"
            placeholder="请输入模版编码"
          ></Input>
        </FormItem>
      </Col>
      <Col :span="8">
        <FormItem label="模版类型" name="templateType">
          <Select
            v-model:value="formState.templateType"
            placeholder="请选择模版类型"
          >
            <SelectOption :value="1">文本</SelectOption>
            <SelectOption :value="2">富文本</SelectOption>
          </Select>
        </FormItem>
      </Col>
      <Col :span="8">
        <Button type="primary" html-type="submit">搜索</Button>
        <Button style="margin: 0 8px" @click="resetForm">重置</Button>
      </Col>
    </Row>
  </Form>
</template>

<script setup>
import {
  Form,
  FormItem,
  Input,
  Button,
  Row,
  Col,
  Select,
  SelectOption,
} from "ant-design-vue";
import { reactive, ref } from "vue";

const emit = defineEmits(["refreash"]);

const formRef = ref();
const formState = reactive({});

const onFinish = () => {
  emit("refreash", formState);
};

const resetForm = () => {
  formRef.value.resetFields();
  emit("refreash", {});
};
</script>
