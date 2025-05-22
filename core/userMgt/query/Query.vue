<template>
  <Form
    ref="formRef"
    :model="formState"
    @finish="onFinish"
    :labelCol="{ span: 4 }"
    :wrapperCol="{ span: 20 }"
  >
    <Row :gutter="24">
      <Col :span="8">
        <FormItem label="帐号" name="username">
          <Input
            v-model:value="formState.username"
            placeholder="请输入帐号"
          ></Input>
        </FormItem>
      </Col>
      <Col :span="8">
        <FormItem label="名字" name="realname">
          <Input
            v-model:value="formState.realname"
            placeholder="请输入名字"
          ></Input>
        </FormItem>
      </Col>
      <Col :span="8">
        <FormItem label="性别" name="sex">
          <Select v-model:value="formState.sex" placeholder="请选择性别">
            <SelectOption :value="1">男</SelectOption>
            <SelectOption :value="2">女</SelectOption>
          </Select>
        </FormItem>
      </Col>
      <Col :span="8">
        <FormItem label="手机号码" name="phone">
          <Input
            v-model:value="formState.phone"
            placeholder="请输入手机号"
          ></Input>
        </FormItem>
      </Col>
      <Col :span="8">
        <FormItem label="用户状态" name="status">
          <Select v-model:value="formState.status" placeholder="请选择用户状态">
            <SelectOption :value="1">正常</SelectOption>
            <SelectOption :value="2">冻结</SelectOption>
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
