<template>
  <Form ref="formRef" :model="formState" @finish="onFinish">
    <Row :gutter="24">
      <Col :span="8">
        <FormItem label="名称" name="itemText">
          <Input
            v-model:value="formState.itemText"
            placeholder="请输入名称"
          ></Input>
        </FormItem>
      </Col>
      <Col :span="8">
        <FormItem label="状态" name="status">
          <Select v-model:value="formState.status" placeholder="请输入名称">
            <SelectOption value="1">启用</SelectOption>
            <SelectOption value="0">未启用</SelectOption>
          </Select>
        </FormItem>
      </Col>
      <Col :span="8">
        <FormItem>
          <Button type="primary" html-type="submit">搜索</Button>
          <Button style="margin: 0 8px" @click="resetForm">重置</Button>
        </FormItem>
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
import { reactive, ref, inject } from "vue";

const DictContext = inject("DictContext");

const formRef = ref();
const formState = reactive({});

const onFinish = () => {
  DictContext.value.sysDictItemList(formState);
};

const resetForm = () => {
  formRef.value.resetFields();
  DictContext.value.sysDictItemList(formState);
};
</script>
