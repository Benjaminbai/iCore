<template>
  <Table
    bordered
    :dataSource="requestParams.fields"
    :columns="columns"
    :scroll="{ x: 'max-content' }"
  >
    <template #headerCell="{ column }">
      <template v-if="['queryShowType'].includes(column.dataIndex)">
        <span class="header-box">
          <span class="required-span">*</span>
          {{ column.title }}
        </span>
      </template>
    </template>
    <template #bodyCell="{ column, text, record }">
      <template
        v-if="
          ['fieldDefaultValue', 'converter', 'fieldExtendJson'].includes(
            column.dataIndex
          )
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
              if (record['dbFieldName'] === 'id') return;
              record[column.dataIndex + '_edit'] = true;
            }
          "
        >
          {{ text || " " }}
        </div>
      </template>
      <template v-if="['fieldShowType'].includes(column.dataIndex)">
        <Select
          v-if="record[column.dataIndex + '_edit']"
          v-model:value="record[column.dataIndex]"
          @blur="record[column.dataIndex + '_edit'] = false"
          class="cell-input"
        >
          <SelectOption
            v-for="option in fieldShowTypeOptions"
            :key="option.value"
            :value="option.value"
            >{{ option.label }}</SelectOption
          >
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
          {{
            fieldShowTypeOptions.find((item) => item.value === text)?.label ||
            " "
          }}
        </div>
      </template>
      <template v-if="['queryMode'].includes(column.dataIndex)">
        <Select
          v-if="record[column.dataIndex + '_edit']"
          v-model:value="record[column.dataIndex]"
          @blur="record[column.dataIndex + '_edit'] = false"
          class="cell-input"
        >
          <SelectOption
            v-for="option in queryModeOptions"
            :key="option.value"
            :value="option.value"
          ></SelectOption>
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
          {{
            queryModeOptions.find((item) => item.value === text)?.label || " "
          }}
        </div>
      </template>
      <template
        v-if="
          [
            'isShowForm',
            'isShowList',
            'sortFlag',
            'isReadOnly',
            'isQuery',
          ].includes(column.dataIndex)
        "
      >
        <Checkbox
          v-model:checked="record[column.dataIndex]"
          :disabled="record['dbFieldName'] === 'id'"
        />
      </template>
      <template v-if="['fieldLength'].includes(column.dataIndex)">
        <InputNumber
          :min="0"
          v-if="record[column.dataIndex + '_edit']"
          v-model:value="record[column.dataIndex]"
          @blur="record[column.dataIndex + '_edit'] = false"
          class="cell-input"
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
import {
  Table,
  Input,
  InputNumber,
  Select,
  SelectOption,
  Checkbox,
} from "ant-design-vue";
import { inject } from "vue";

const columns = [
  {
    title: "字段名称",
    dataIndex: "dbFieldName",
    width: 150,
  },
  {
    title: "字段备注",
    dataIndex: "dbFieldTxt",
    width: 150,
  },
  {
    title: "表单显示",
    dataIndex: "isShowForm",
    width: 100,
  },
  {
    title: "列表显示",
    dataIndex: "isShowList",
    width: 100,
  },
  {
    title: "是否排序",
    dataIndex: "sortFlag",
    width: 100,
  },
  {
    title: "是否只读",
    dataIndex: "isReadOnly",
    width: 100,
  },
  {
    title: "控件类型",
    dataIndex: "fieldShowType",
    width: 150,
  },
  {
    title: "控件长度",
    dataIndex: "fieldLength",
    width: 150,
  },
  {
    title: "是否查询",
    dataIndex: "isQuery",
    width: 100,
  },
  {
    title: "查询类型",
    dataIndex: "queryMode",
    width: 150,
  },
  {
    title: "控件默认值",
    dataIndex: "fieldDefaultValue",
    width: 100,
  },
  {
    title: "定义转换器",
    dataIndex: "converter",
    width: 100,
  },
  {
    title: "扩展参数",
    dataIndex: "fieldExtendJson",
    width: 100,
  },
];

const fieldShowTypeOptions = [
  { label: "文本框", value: "text" },
  { label: "密码", value: "password" },
  { label: "下拉框", value: "list" },
  { label: "单选框", value: "radio" },
  { label: "多选框", value: "checkbox" },
  { label: "开关", value: "switch" },
  { label: "日期（年月日）", value: "date" },
  { label: "日期（年月日时分秒）", value: "datetime" },
  { label: "时间（HH:mm:ss）", value: "time" },
  { label: "文件", value: "file" },
  { label: "图片", value: "image" },
  { label: "多行文本", value: "textarea" },
  { label: "富文本", value: "umeditor" },
  { label: "MarkDown", value: "markdown" },
  { label: "用户选择", value: "sel_user" },
  { label: "部门选择", value: "sel_depart" },
  { label: "关联记录", value: "link_table" },
  { label: "他表字段", value: "link_table_field" },
  { label: "省市区组件", value: "pca" },
  { label: "Popup弹框", value: "popup" },
  { label: "Popup字典", value: "popup_dict" },
  { label: "下拉多选框", value: "list_multi" },
  { label: "下拉搜索框", value: "sel_search" },
  { label: "分类字典树", value: "cat_tree" },
  { label: "自定义树控件", value: "sel_tree" },
  { label: "联动组件", value: "link_down" },
];

const queryModeOptions = [
  { label: "普通查询", value: "single" },
  { label: "模糊查询", value: "like" },
  { label: "范围查询", value: "group" },
];

const requestParams = inject("requestParams");
</script>
<style scoped>
@import url("../../common.css");
</style>
