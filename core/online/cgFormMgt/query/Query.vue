<template>
  <Form ref="formRef" :model="formState" @finish="onFinish">
    <Row :gutter="24" style="width: 100%">
      <Col :span="20">
        <Row :gutter="24">
          <Col :span="8">
            <FormItem label="表名" name="tableName">
              <Input
                v-model:value="formState.tableName"
                placeholder="请输入表名"
              ></Input>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="表类型" name="tableType_MultiString">
              <Select
                v-model:value="formState.tableType_MultiString"
                mode="multiple"
                placeholder="请选择表类型"
              >
                <SelectOption :value="1">单表</SelectOption>
                <SelectOption :value="2">主表</SelectOption>
                <SelectOption :value="3">附表</SelectOption>
              </Select>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="表描述" name="tableTxt">
              <Input
                v-model:value="formState.tableTxt"
                placeholder="请输入表描述"
              ></Input>
            </FormItem>
          </Col>
        </Row>
      </Col>
      <Col :span="4">
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
