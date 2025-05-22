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
        <FormItem label="标题" name="titile">
          <Input
            v-model:value="formState.titile"
            placeholder="请输入标题"
          ></Input>
        </FormItem>
      </Col>
      <Col :span="8">
        <FormItem label="发布人" name="sender">
          <Input
            v-model:value="formState.sender"
            placeholder="请输入发布人"
          ></Input>
        </FormItem>
      </Col>
      <Col :span="8">
        <FormItem label="发布时间" name="time">
          <RangePicker
            v-model:value="formState.time"
            style="width: 100%"
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
          />
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
  RangePicker,
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
