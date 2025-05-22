<template>
  <FullModal
    title="权限授权"
    :open="open"
    destroyOnClose
    @cancel="emit('setOpen')"
    :footer="null"
  >
    <Row :gutter="40">
      <Col :span="12">
        <Tabs v-model:activeKey="activeKey" @change="handleTabChange">
          <TabPane key="role" tab="角色授权">
            <Role v-if="activeKey === 'role'" />
          </TabPane>
          <TabPane key="user" tab="人员授权">
            <User v-if="activeKey === 'user'" />
          </TabPane>
        </Tabs>
      </Col>
      <Col :span="12">
        <Tabs v-model:activeKey="activeKeyType">
          <TabPane key="1" tab="字段权限">
            <Field v-if="activeKeyType === '1' && selectedKeys.length > 0" />
          </TabPane>
          <TabPane key="2" tab="按钮权限">
            <ButtonAuth
              v-if="activeKeyType === '2' && selectedKeys.length > 0"
            />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  </FullModal>
</template>
<script setup>
import { Row, Col, Tabs, TabPane } from "ant-design-vue";
import { ref, provide } from "vue";

import FullModal from "@core/libs/fullModal/FullModal.vue";
import Role from "./Role.vue";
import User from "./User.vue";
import Field from "./Field.vue";
import ButtonAuth from "./Button.vue";

const emit = defineEmits(["setOpen"]);
const { open, headInfo } = defineProps(["open", "headInfo"]);
const activeKey = ref("role");
const activeKeyType = ref("1");
const selectedKeys = ref([]);
const context = ref({});
context.value.headInfo = headInfo;
context.value.selectedKeys = selectedKeys;
context.value.activeKey = activeKey;
context.value.activeKeyType = activeKeyType;
provide("context", context);

const handleTabChange = () => {
  context.value.selectedKeys = [];
};
</script>
