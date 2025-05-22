<template>
  <contextHolder />
  <Drawer
    :open="RoleContext.openAuthorize"
    title="角色权限配置"
    placement="right"
    @close="RoleContext.openAuthorize = false"
  >
    <Tree
      v-if="treeData.length > 0"
      v-model:checkedKeys="checkedKeys"
      :defaultExpandAll="true"
      checkable
      checkStrictly
      :tree-data="treeData"
      :fieldNames="{ title: 'slotTitle' }"
    >
    </Tree>
    <template #footer>
      <Button type="primary" @click="saveHandler">保存</Button>
    </template>
  </Drawer>
</template>

<script setup>
import { Drawer, Tree, Button, message } from "ant-design-vue";
import { inject, onMounted, ref } from "vue";

import {
  sysRoleQueryTreeListApi,
  sysRoleQueryRolePermissionApi,
  sysPermissionSaveRolePermissionApi,
} from "../api";

const RoleContext = inject("RoleContext");
const [messageApi, contextHolder] = message.useMessage();

const checkedKeys = ref([]);
const treeData = ref([]);
const lastpermissionIds = ref([]);

const sysRoleQueryTreeList = () => {
  sysRoleQueryTreeListApi().then((res) => {
    if (res.success) {
      treeData.value = res.result.treeList;
    } else {
      messageApi.error(res.message);
    }
  });
};

const sysRoleQueryRolePermission = () => {
  const params = { roleId: RoleContext.value.record?.id };
  sysRoleQueryRolePermissionApi(params).then((res) => {
    if (res.success) {
      checkedKeys.value = res.result;
      lastpermissionIds.value = res.result;
    } else {
      messageApi.error(res.message);
    }
  });
};

const sysPermissionSaveRolePermission = () => {
  const params = {
    lastpermissionIds: lastpermissionIds.value.join(","),
    permissionIds: checkedKeys.value.join(","),
    roleId: RoleContext.value.record?.id,
  };
  sysPermissionSaveRolePermissionApi(params).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      RoleContext.value.openAuthorize = false;
    } else {
      messageApi.error(res.message);
    }
  });
};

const saveHandler = () => {
  sysPermissionSaveRolePermission();
};

onMounted(() => {
  sysRoleQueryRolePermission();
  sysRoleQueryTreeList();
});
</script>
