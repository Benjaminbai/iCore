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
        <FormItem label="角色名称" name="roleName">
          <Input
            v-model:value="formState.roleName"
            placeholder="请输入帐号"
          ></Input>
        </FormItem>
      </Col>
      <Col :span="8">
        <FormItem label="角色编码" name="roleCode">
          <Input
            v-model:value="formState.roleCode"
            placeholder="请输入名字"
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
