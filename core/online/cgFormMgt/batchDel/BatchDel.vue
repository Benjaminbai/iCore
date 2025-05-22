<template>
  <contextHolder />
  <Modal :open="open" wrapClassName="batch-modal" :closable="false">
    <template #footer>
      <Button @click="open = false">取消</Button>
      <Button type="primary" @click="cgformHeadDeleteBatch(0)">移除</Button>
      <Button type="primary" @click="cgformHeadDeleteBatch(1)" danger
        >删除</Button
      >
    </template>
    <Row class="batch-modal-row">
      <Col :span="2">
        <h3><ExclamationCircleOutlined class="batch-modal-icon" /></h3>
      </Col>
      <Col :span="22">
        <h3>确认彻底删除该表吗？</h3>
        <p>
          移除只会删除表单配置；删除则会删除对应的数据库表以及子表且不能恢复。请确认您的操作…
        </p>
      </Col>
    </Row>
  </Modal>
</template>

<script setup>
import { Modal, Row, Col, Button, message } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";

import { cgformHeadDeleteBatchApi } from "../api";

const [messageApi, contextHolder] = message.useMessage();
const { open, selectedKeys } = defineProps(["open", "selectedKeys"]);
const emit = defineEmits(["setOpen"]);

const cgformHeadDeleteBatch = (flag) => {
  const params = {
    flag,
    ids: selectedKeys.join(","),
  };
  cgformHeadDeleteBatchApi(params).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      emit("setOpen");
    } else {
      messageApi.error(res.message);
    }
  });
};
</script>

<style>
.batch-modal {
  .batch-modal-icon {
    font-size: 22px;
    color: #efb041;
  }
}
</style>
