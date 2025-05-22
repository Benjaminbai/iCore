<template>
  <contextHolder />
  <Table bordered :dataSource="rightColumnContext" :columns="columns">
    <template #bodyCell="{ column, text, record }">
      <template
        v-if="
          ['listShow', 'formShow', 'formEditable'].includes(column.dataIndex)
        "
      >
        <Checkbox
          v-model:checked="record[column.dataIndex]"
          @change="changeHandler(record, column.dataIndex)"
          :disabled="!record.status"
        />
      </template>
      <template v-if="['status'].includes(column.dataIndex)">
        <Switch
          v-model:checked="record[column.dataIndex]"
          @change="changeHandler(record, column.dataIndex)"
        />
      </template>
    </template>
  </Table>
</template>

<script setup>
import { Table, Checkbox, Switch, message } from "ant-design-vue";
import { inject } from "vue";

import { cgformAuthColumnPostApi, cgformAuthColumnPutApi } from "../api";

const [messageApi, contextHolder] = message.useMessage();
const rightColumnContext = inject("rightColumnContext");

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
    title: "列表控制",
    dataIndex: "listShow",
  },
  {
    title: "表单控制（可见）",
    dataIndex: "formShow",
  },
  {
    title: "表单控制（可编辑）",
    dataIndex: "formEditable",
  },
  {
    title: "启用",
    dataIndex: "status",
  },
];

const changeHandler = (record, dataIndex) => {
  const { cgformId, code } = record;
  const params = {
    cgformId,
    code,
  };
  switch (dataIndex) {
    case "listShow":
      params.listShow = record.listShow;
      params.switchFlag = 1;
      cgformAuthColumnPost(params);
      break;
    case "formShow":
      params.formShow = record.formShow;
      params.switchFlag = 2;
      cgformAuthColumnPost(params);
      break;
    case "formEditable":
      params.formEditable = record.formEditable;
      params.switchFlag = 3;
      cgformAuthColumnPost(params);
      break;
    case "status":
      params.status = record.status ? 1 : 0;
      cgformAuthColumnPut(params);
      break;
    default:
      break;
  }
};

const cgformAuthColumnPost = (params) => {
  cgformAuthColumnPostApi(params).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
    } else {
      messageApi.error(res.message);
    }
  });
};
const cgformAuthColumnPut = (params) => {
  cgformAuthColumnPutApi(params).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
    } else {
      messageApi.error(res.message);
    }
  });
};
</script>
