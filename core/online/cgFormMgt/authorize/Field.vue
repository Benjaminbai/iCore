<template>
  <contextHolder />
  <Flex justify="end">
    <Button type="primary" size="small" @click="cgformRoleColumnAuth"
      >保存</Button
    >
  </Flex>
  <Tree
    v-if="treeData.length > 0"
    v-model:checkedKeys="checkedKeys"
    checkable
    :defaultExpandAll="true"
    :treeData="treeData"
  >
  </Tree>
</template>

<script setup>
import { inject, watch, ref } from "vue";
import { message, Flex, Tree, Button } from "ant-design-vue";

import {
  cgformAuthPageApi,
  cgformRoleColumnAuthApi,
  cgformRoleAuthApi,
} from "../api";

const [messageApi, contextHolder] = message.useMessage();
const context = inject("context");

const checkedKeys = ref([]);

const treeData = ref([]);

const groupedByCode = (array) => {
  const result = [];
  const map = new Map();
  for (const item of array) {
    const code = item.code;
    if (!map.has(code)) {
      map.set(code, {
        title: item.title,
        key: "_" + code,
        children: [],
      });
      result.push(map.get(code));
    }
    const parent = map.get(code);
    parent.children.push({
      title: fieldRights(item),
      key: item.id,
      children: [],
    });
  }
  return result;
};

const fieldRights = (item) => {
  let str = "";
  switch (item.page) {
    case 3:
      str = item.control === 5 && "列表可见";
      break;

    default:
      if (item.control === 5) {
        str = "表单可见";
      } else if (item.control === 3) {
        str = "表单可编辑";
      }
      break;
  }
  return str;
};

const cgformAuthPage = () => {
  cgformAuthPageApi(context.value.headInfo.id, 1).then((res) => {
    if (res.success) {
      const result = groupedByCode(res.result);
      console.log(result);
      treeData.value = result;
    } else {
      messageApi.error(res.message);
    }
  });
};

const cgformRoleColumnAuth = () => {
  const { activeKey, headInfo, selectedKeys } = context.value;
  const params = {
    authId: checkedKeys.value.filter((item) => !item.startsWith("_")),
    authMode: activeKey,
  };
  cgformRoleColumnAuthApi(selectedKeys[0], headInfo.id, params).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
    } else {
      messageApi.error(res.message);
    }
  });
};

const cgformRoleAuth = () => {
  const { activeKey, headInfo, selectedKeys, activeKeyType } = context.value;
  const params = {
    roleId: selectedKeys[0],
    cgformId: headInfo.id,
    authMode: activeKey,
    type: activeKeyType,
  };
  cgformRoleAuthApi(params).then((res) => {
    if (res.success) {
      checkedKeys.value = res.result.map((item) => item.authId);
    } else {
      messageApi.error(res.message);
    }
  });
};

watch(
  () => context.value.selectedKeys,
  () => {
    cgformAuthPage();
    cgformRoleAuth();
  },
  { immediate: true }
);
</script>
