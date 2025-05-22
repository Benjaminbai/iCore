<template>
  <contextHolder />
  <Drawer title="权限控制" size="large" :open="open" @close="onClose">
    <Tabs v-model:activeKey="activeKey">
      <TabPane key="1" tab="字段权限">
        <FieldRight />
      </TabPane>
      <TabPane key="2" tab="按钮权限">
        <ButtonRight />
      </TabPane>
    </Tabs>
  </Drawer>
</template>

<script setup>
import { Drawer, Tabs, TabPane, message } from "ant-design-vue";
import { ref, provide, onMounted } from "vue";

import FieldRight from "./FieldRight.vue";
import ButtonRight from "./ButtonRight.vue";
import { cgformAuthColumnApi, cgformAuthButtonApi } from "../api";

const { open, headInfo } = defineProps(["open", "headInfo"]);
const emit = defineEmits(["setOpen"]);
const [messageApi, contextHolder] = message.useMessage();

const activeKey = ref("1");
const rightColumnContext = ref([]);
provide("rightColumnContext", rightColumnContext);
const rightButtonContext = ref({});
rightButtonContext.value.headInfo = headInfo;
provide("rightButtonContext", rightButtonContext);

const hidden = ["id", "create_by", "create_time", "update_by", "update_time"];

const onClose = () => {
  emit("setOpen", false);
};

const cgformAuthColumn = (id) => {
  cgformAuthColumnApi(id).then((res) => {
    if (res.success) {
      res.result.forEach((obj) => {
        obj.status = obj.status === 1;
      });
      rightColumnContext.value = res.result.filter(
        (obj) => !hidden.includes(obj.code)
      );
    } else {
      messageApi.error(res.message);
    }
  });
};

const cgformAuthButton = (id) => {
  cgformAuthButtonApi(id).then((res) => {
    if (res.success) {
      rightButtonContext.value.authList = res.result.authList;
      rightButtonContext.value.buttonList = res.result.buttonList;
    } else {
      messageApi.error(res.message);
    }
  });
};

onMounted(() => {
  if (headInfo.id) {
    cgformAuthColumn(headInfo.id);
    cgformAuthButton(headInfo.id);
  }
});
</script>
