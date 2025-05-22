<template>
  <contextHolder />
  <Table bordered :dataSource="dataSource" :columns="columns">
    <template #bodyCell="{ column, text, record }">
      <template v-if="['status'].includes(column.dataIndex)">
        <Switch
          v-model:checked="record[column.dataIndex]"
          @change="changeHandler(record)"
        />
      </template>
    </template>
  </Table>
</template>

<script setup>
import { Table, Switch, message } from "ant-design-vue";
import { inject, ref } from "vue";

import { cgformAuthButtonPostApi } from "../api";

const [messageApi, contextHolder] = message.useMessage();
const rightButtonContext = inject("rightButtonContext");
const columns = [
  {
    title: "字段名称",
    dataIndex: "code",
  },
  {
    title: "字段描述",
    dataIndex: "title",
  },
  {
    title: "启用",
    dataIndex: "status",
  },
];
const { headInfo, buttonList, authList } = rightButtonContext.value;
const initDataSource = [
  {
    code: "add",
    title: "新增",
    status: 0,
  },
  {
    code: "update",
    title: "编辑",
    status: 0,
  },
  {
    code: "delete",
    title: "删除",
    status: 0,
  },
  {
    code: "batch_delete",
    title: "批量删除",
    status: 0,
  },
  {
    code: "export",
    title: "导出",
    status: 0,
  },
  {
    code: "import",
    title: "导入",
    status: 0,
  },
  {
    code: "bpm",
    title: "提交流程",
    status: 0,
  },
  {
    code: "super_query",
    title: "高级查询",
    status: 0,
  },
];
const dataSource = ref([
  ...initDataSource.map((item) => ({
    ...item,
    status: authList.find((v) => v.code === item.code)?.status ? true : false,
    cgformId: headInfo.id,
    type: 2,
    page: 3,
    control: 5,
  })),
]);
buttonList.forEach((item) => {
  dataSource.value.push({
    code: item.buttonCode,
    title: item.buttonName,
    status: authList.find((v) => v.code === item.buttonCode)?.status
      ? true
      : false,
    cgformId: headInfo.id,
    type: 2,
    page: 3,
    control: 5,
  });
});

const cgformAuthButtonPost = (record) => {
  const params = {
    ...record,
    status: record.status ? 1 : 0,
  };
  cgformAuthButtonPostApi(params).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
    } else {
      messageApi.error(res.message);
    }
  });
};

const changeHandler = (record) => {
  cgformAuthButtonPost(record);
};
</script>
