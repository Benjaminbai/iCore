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
    :dataSource="cgreportContext.items"
    :columns="columns"
    :rowSelection="rowSelection"
    :scroll="{ x: 1500 }"
    rowKey="fake_id"
  >
    <template #headerCell="{ column }">
      <template
        v-if="['fieldName', 'fieldTxt', 'fieldType'].includes(column.dataIndex)"
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
          [
            'fieldName',
            'fieldTxt',
            'fieldHref',
            'replaceVal',
            'dictCode',
            'groupTitle',
          ].includes(column.dataIndex)
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
      <template v-if="['fieldType'].includes(column.dataIndex)">
        <Select
          v-if="record[column.dataIndex + '_edit']"
          v-model:value="record[column.dataIndex]"
          @blur="record[column.dataIndex + '_edit'] = false"
          class="cell-input"
        >
          <SelectOption
            v-for="item in fieldTypeList"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</SelectOption
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
          {{ fieldTypeList.find((item) => item.value === text)?.label || " " }}
        </div>
      </template>
      <template v-if="['searchMode'].includes(column.dataIndex)">
        <Select
          v-if="record[column.dataIndex + '_edit']"
          v-model:value="record[column.dataIndex]"
          @blur="record[column.dataIndex + '_edit'] = false"
          class="cell-input"
        >
          <SelectOption
            v-for="item in searchModeList"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</SelectOption
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
          {{ searchModeList.find((item) => item.value === text)?.label || " " }}
        </div>
      </template>
      <template
        v-if="['isShow', 'isSearch', 'isTotal'].includes(column.dataIndex)"
      >
        <Checkbox v-model:checked="record[column.dataIndex]" />
      </template>
    </template>
  </Table>
</template>
<script setup>
import { h, inject, ref } from "vue";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Input,
  Select,
  SelectOption,
  Checkbox,
} from "ant-design-vue";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons-vue";

const cgreportContext = inject("cgreportContext");

const selectedKeys = ref([]);

const rowSelection = {
  onChange: (selectedRowKeys) => {
    selectedKeys.value = selectedRowKeys;
  },
};

const fieldTypeList = [
  { label: "字符类型", value: "String" },
  { label: "数值类型", value: "Integer" },
  { label: "日期类型", value: "Date" },
  { label: "时间类型", value: "DateTime" },
  { label: "长整型", value: "Long" },
  { label: "图片类型", value: "Image" },
];

const searchModeList = [
  { label: "单条件查询", value: "single" },
  { label: "数值查询", value: "group" },
];

const columns = [
  {
    title: "字段名字",
    dataIndex: "fieldName",
    width: 150,
  },
  {
    title: "字段文本",
    dataIndex: "fieldTxt",
    width: 150,
  },
  {
    title: "字段类型",
    dataIndex: "fieldType",
    width: 150,
  },
  {
    title: "是否显示",
    dataIndex: "isShow",
    width: 100,
  },
  {
    title: "字段href",
    dataIndex: "fieldHref",
    width: 150,
  },
  {
    title: "查询模式",
    dataIndex: "searchMode",
    width: 150,
  },
  {
    title: "取值表达式",
    dataIndex: "replaceVal",
    width: 150,
  },
  {
    title: "字典code",
    dataIndex: "dictCode",
    width: 150,
  },
  {
    title: "分组标题",
    dataIndex: "groupTitle",
    width: 150,
  },
  {
    title: "是否查询",
    dataIndex: "isSearch",
    width: 100,
  },
  {
    title: "是否合计",
    dataIndex: "isTotal",
    width: 100,
  },
];

const handleAdd = () => {
  const newData = {
    fieldName: "",
    fieldTxt: "",
    fieldType: "",
    isShow: true,
    fieldHref: "",
    searchMode: "",
    replaceVal: "",
    dictCode: "",
    groupTitle: "",
    isSearch: false,
    isTotal: false,
    fake_id: new Date().getTime(),
  };
  cgreportContext.value.items.push(newData);
};

const batchDeleteHandler = () => {
  const ids = selectedKeys.value;
  cgreportContext.value.items = cgreportContext.value.items.filter(
    (item) => !ids.includes(item.fake_id)
  );
  selectedKeys.value = [];
};
</script>
<style scoped>
@import url("../../common.css");
</style>
