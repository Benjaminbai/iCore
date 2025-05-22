<template>
  <Space style="margin-bottom: 10px">
    <Button type="primary" :icon="h(PlusOutlined)" @click="handleAdd"
      >新增</Button
    >
    <Popconfirm
      title="确定删除选中项?"
      okText="是"
      cancelText="否"
      @confirm="batchDeleteHandler"
    >
      <Button v-show="selectedKeys.length > 0">
        <DeleteOutlined />
        删除
      </Button>
    </Popconfirm>
  </Space>
  <Table
    bordered
    :dataSource="cgreportContext.params"
    :columns="columns"
    :rowSelection="rowSelection"
    rowKey="fake_id"
  >
    <template #headerCell="{ column }">
      <template
        v-if="
          ['paramName', 'paramTxt', 'paramValue'].includes(column.dataIndex)
        "
      >
        <span class="header-box">
          <span class="required-span">*</span>
          {{ column.title }}
        </span>
      </template>
    </template>
    <template #bodyCell="{ column, text, record }">
      <template
        v-if="
          ['paramName', 'paramTxt', 'paramValue'].includes(column.dataIndex)
        "
      >
        <Input
          v-if="record[column.dataIndex + '_edit']"
          v-model:value="record[column.dataIndex]"
          @blur="record[column.dataIndex + '_edit'] = false"
        />
        <div
          v-else
          class="cell-div"
          @click="
            () => {
              record[column.dataIndex + '_edit'] = true;
            }
          "
        >
          {{ text || " " }}
        </div>
      </template>
    </template>
  </Table>
</template>
<script setup>
import { h, inject, ref } from "vue";
import { Table, Button, Space, Popconfirm, Input } from "ant-design-vue";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons-vue";

const cgreportContext = inject("cgreportContext");

const selectedKeys = ref([]);

const rowSelection = {
  onChange: (selectedRowKeys) => {
    selectedKeys.value = selectedRowKeys;
  },
};

const columns = [
  {
    title: "参数字段",
    dataIndex: "paramName",
    width: "30%",
  },
  {
    title: "参数文本",
    dataIndex: "paramTxt",
    width: "30%",
  },
  {
    title: "参数默认值",
    dataIndex: "paramValue",
    width: "30%",
  },
];

const handleAdd = () => {
  const newData = {
    paramName: "",
    paramTxt: "",
    paramValue: "",
    fake_id: new Date().getTime(),
  };
  cgreportContext.value.params.push(newData);
};

const batchDeleteHandler = () => {
  const ids = selectedKeys.value;
  cgreportContext.value.params = cgreportContext.value.params.filter(
    (item) => !ids.includes(item.fake_id)
  );
  selectedKeys.value = [];
};
</script>
<style scoped>
@import url("../../common.css");
</style>
