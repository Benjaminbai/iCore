<template>
  <Form
    ref="formRef"
    :model="formState"
    @finish="onFinish"
    :labelCol="{ span: 8 }"
    :wrapperCol="{ span: 16 }"
    style="margin-top: 24px"
  >
    <Row :gutter="24">
      <Col :span="8">
        <FormItem label="用户帐号" name="username">
          <Input
            v-model:value="formState.username"
            placeholder="请输入帐号"
          ></Input>
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
