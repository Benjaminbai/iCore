<template>
  <contextHolder />
  <Modal
    :open="UserContext.openUserSelect"
    width="1000px"
    title="用户选择列表"
    @ok="sysUserAddSysUserRole"
    okText="确认"
    cancelText="取消"
    @cancel="UserContext.openUserSelect = false"
  >
    <Query @refreash="refreash" />

    <Table
      :dataConfig="dataConfig"
      :styleConfig="styleConfig"
      :rowSelection="rowSelection"
      :refreashHandler="sysUserList"
      :loading="loading"
      :pagination="pagination"
      @change="tableChangeHandler"
    >
      <template #tools>
        <span></span>
      </template>
    </Table>
  </Modal>
</template>

<script setup>
import { message, Modal } from "ant-design-vue";
import { reactive, ref, inject, watchEffect } from "vue";

import Table from "@core/libs/table/Table.vue";
import { sysUserListApi, sysUserAddSysUserRoleApi } from "../api";
import Query from "./query/Query.vue";

const [messageApi, contextHolder] = message.useMessage();
const UserContext = inject("UserContext");

const backupList = [
  {
    title: "用户账号",
    dataIndex: "username",
  },
  {
    title: "用户姓名",
    dataIndex: "realname",
  },
  {
    title: "状态",
    dataIndex: "status_dictText",
  },
];
const formState = ref({});
const loading = ref(false);
const selectedKeys = ref([]);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: ["10", "20", "50"],
  showSizeChanger: true,
});
const dataConfig = reactive({
  columns: backupList,
  dataSource: [],
  backupList: [...backupList],
  checkedState: {
    checkAll: true,
    checkedList: backupList.map((item) => item.dataIndex),
  },
  selectedKeys,
});
const styleConfig = reactive({
  bordered: true,
});
const rowSelection = {
  onChange: (selectedRowKeys) => {
    selectedKeys.value = selectedRowKeys;
  },
};

const tableChangeHandler = (_pagination) => {
  const { current, pageSize, total } = _pagination;
  pagination.value.current = current;
  pagination.value.pageSize = pageSize;
  pagination.value.total = total;
};

const sysUserList = () => {
  const params = {
    pageNo: pagination.value.current,
    pageSize: pagination.value.pageSize,
    ...formState.value,
  };
  loading.value = true;
  sysUserListApi(params)
    .then((res) => {
      if (res.success) {
        dataConfig.dataSource = res.result.records;
        pagination.value.current = res.result.current;
        pagination.value.pageSize = res.result.size;
        pagination.value.total = res.result.total;
      } else {
        messageApi.error(res.message);
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const refreash = (val) => {
  formState.value = val;
  pagination.value.current = 1;
};

const sysUserAddSysUserRole = () => {
  const params = {
    roleId: UserContext.value.roleId,
    userIdList: selectedKeys.value,
  };
  sysUserAddSysUserRoleApi(params).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      UserContext.value.openUserSelect = false;
      UserContext.value.sysUserListAll();
    } else {
      messageApi.error(res.message);
    }
  });
};

watchEffect(() => {
  sysUserList();
});
</script>
