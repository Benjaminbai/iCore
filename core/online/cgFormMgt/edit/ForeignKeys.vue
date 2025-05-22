<template>
  <Table bordered :dataSource="requestParams.fields" :columns="columns">
    <template #headerCell="{ column }">
      <template v-if="['mainTable', 'mainField'].includes(column.dataIndex)">
        <span class="header-box">
          <span class="required-span">*</span>
          {{ column.title }}
        </span>
      </template>
    </template>
    <template #bodyCell="{ column, text, record }">
      <template v-if="['mainTable', 'mainField'].includes(column.dataIndex)">
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
    </template>
  </Table>
</template>
<script setup>
import { Table, Input } from "ant-design-vue";
import { inject } from "vue";

const columns = [
  {
    title: "字段名称",
    dataIndex: "dbFieldName",
    width: 300,
  },
  {
    title: "字段备注",
    dataIndex: "dbFieldTxt",
    width: 300,
  },
  {
    title: "主表名",
    dataIndex: "mainTable",
    width: 300,
  },
  {
    title: "主表字段",
    dataIndex: "mainField",
    width: 300,
  },
];

const requestParams = inject("requestParams");
</script>
<style scoped>
@import url("../../common.css");
</style>
