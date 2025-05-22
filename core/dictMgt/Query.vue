<template>
  <Form ref="formRef" :model="formState" @finish="onFinish">
    <Row :gutter="24">
      <Col :span="8">
        <FormItem label="字典名称" name="dictName">
          <Input
            v-model:value="formState.dictName"
            placeholder="请输入字典名称"
          ></Input>
        </FormItem>
      </Col>
      <Col :span="8">
        <FormItem label="字典编码" name="dictCode">
          <Input
            v-model:value="formState.dictCode"
            placeholder="请输入字典编码"
          ></Input>
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
import { Form, FormItem, Input, Button, Row, Col } from "ant-design-vue";
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
