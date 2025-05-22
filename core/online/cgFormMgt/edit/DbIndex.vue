<template>
  <Space style="margin-bottom: 10px">
    <Button type="primary" @click="handleAdd" :icon="h(PlusOutlined)"
      >新增</Button
    >
    <Popconfirm
      title="确定删除选中项?"
      okText="是"
      cancelText="否"
      @confirm="batchDeleteHandler"
    >
      <Button v-show="requestParams.deleteIndexIds.length > 0">
        <DeleteOutlined />
        删除
      </Button>
    </Popconfirm>
  </Space>
  <Table
    bordered
    :dataSource="requestParams.indexs"
    :columns="columns"
    :rowSelection="rowSelection"
    rowKey="fake_id"
  >
    <template #bodyCell="{ column, text, record }">
      <template v-if="['indexName'].includes(column.dataIndex)">
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
              if (record['dbFieldName'] === 'id') return;
              record[column.dataIndex + '_edit'] = true;
            }
          "
        >
          {{ text || " " }}
        </div>
      </template>
      <template v-if="['indexField'].includes(column.dataIndex)">
        <Select
          mode="multiple"
          v-if="record[column.dataIndex + '_edit']"
          v-model:value="record[column.dataIndex]"
          @blur="record[column.dataIndex + '_edit'] = false"
          class="cell-input"
        >
          <SelectOption
            v-for="item in requestParams.fields"
            :key="item.id"
            :value="item.dbFieldName"
            >{{ item.dbFieldTxt }}</SelectOption
          >
        </Select>
        <div
          v-else
          class="cell-div"
          @click="
            () => {
              record[column.dataIndex + '_edit'] = true;
            }
          "
        >
          {{ text.join(",") }}
        </div>
      </template>
      <template v-if="['indexType'].includes(column.dataIndex)">
        <Select
          v-if="record[column.dataIndex + '_edit']"
          v-model:value="record[column.dataIndex]"
          @blur="record[column.dataIndex + '_edit'] = false"
          class="cell-input"
        >
          <SelectOption value="normal">normal</SelectOption>
          <SelectOption value="unique">unique</SelectOption>
        </Select>
        <div
          v-else
          class="cell-div"
          @click="
            () => {
              if (record['dbFieldName'] === 'id') return;
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
import {
  Table,
  Space,
  Button,
  Popconfirm,
  Input,
  Select,
  SelectOption,
} from "ant-design-vue";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { inject, h } from "vue";

const columns = [
  {
    title: "索引名称",
    dataIndex: "indexName",
    width: "30%",
  },
  {
    title: "索引栏位",
    dataIndex: "indexField",
    width: "30%",
  },
  {
    title: "索引类型",
    dataIndex: "indexType",
    width: "30%",
  },
];

const requestParams = inject("requestParams");

const rowSelection = {
  onChange: (selectedRowKeys) => {
    requestParams.value.deleteIndexIds = selectedRowKeys;
  },
};

const handleAdd = () => {
  const newData = {
    indexName: "",
    indexField: [],
    indexType: "",
    fake_id: "_" + new Date().getTime(),
  };
  requestParams.value.indexs.push(newData);
};

const batchDeleteHandler = () => {
  const deleteIds = requestParams.value.deleteIndexIds;
  requestParams.value.fields = requestParams.value.fields.filter(
    (item) => !deleteIds.includes(item.fake_id)
  );
  requestParams.value.deleteIndexIds =
    requestParams.value.deleteIndexIds.filter((v) => !v.startsWith("_"));
};
</script>
<style scoped>
@import url("../../common.css");
</style>
