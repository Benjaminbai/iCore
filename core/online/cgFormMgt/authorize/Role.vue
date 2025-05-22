<template>
  <contextHolder />
  <Table
    :columns="columns"
    :dataSource="dataSource"
    rowKey="id"
    :rowSelection="rowSelection"
    :pagination="pagination"
    @change="tableChangeHandler"
    size="small"
  ></Table>
</template>

<script setup>
import { Table, message } from "ant-design-vue";
import { inject, ref } from "vue";

import { sysRoleListApi } from "../api";

const [messageApi, contextHolder] = message.useMessage();
const context = inject("context");

const columns = [
  {
    title: "角色编码",
    dataIndex: "roleCode",
  },
  {
    title: "角色名称",
    dataIndex: "roleName",
  },
];
const dataSource = ref([]);

const rowSelection = {
  type: "radio",
  onChange: (selectedRowKeys) => {
    context.value.selectedKeys = selectedRowKeys;
  },
};
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: ["10", "20", "50"],
  showSizeChanger: true,
});

const sysRoleList = () => {
  const params = {
    column: "createTime",
    order: "desc",
    pageNo: pagination.value.current,
    pageSize: pagination.value.pageSize,
  };
  sysRoleListApi(params).then((res) => {
    if (res.success) {
      dataSource.value = res.result.records;
      pagination.value.total = res.result.total;
    } else {
      messageApi.error(res.message);
    }
  });
};

const tableChangeHandler = (_pagination) => {
  const { current, pageSize, total } = _pagination;
  pagination.value.current = current;
  pagination.value.pageSize = pageSize;
  pagination.value.total = total;
};

watchEffect(() => {
  sysRoleList();
});
</script>
