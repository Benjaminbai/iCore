<template>
  <Table bordered :dataSource="requestParams.fields" :columns="columns">
    <template #bodyCell="{ column, text, record }">
      <template
        v-if="
          ['fieldHref', 'dictTable', 'dictField', 'dictText'].includes(
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
              record[column.dataIndex + '_edit'] = true;
            }
          "
        >
          {{ text || " " }}
        </div>
      </template>
      <template v-if="['fieldValidType'].includes(column.dataIndex)">
        <Select
          v-if="record[column.dataIndex + '_edit']"
          v-model:value="record[column.dataIndex]"
          @change="record[column.dataIndex + '_edit'] = false"
          class="cell-input"
          :options="
            fieldValidateOptions.map((item) => ({
              label: item.label,
              value: item.value,
            }))
          "
        >
          <template #dropdownRender="{ menuNode: menu }">
            <VNodes :vnodes="menu" />
            <Divider style="margin: 4px 0" />
            <Space style="padding: 4px">
              <Input v-model:value="record[column.dataIndex]" />
              <Button
                type="text"
                @click="record[column.dataIndex + '_edit'] = false"
              >
                <template #icon>
                  <PlusOutlined />
                </template>
                正则
              </Button>
            </Space>
          </template>
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
          {{
            fieldValidateOptions.find((item) => item.value === text)?.label ||
            text
          }}
        </div>
      </template>
      <template v-if="['fieldMustInput'].includes(column.dataIndex)">
        <Checkbox v-model:checked="record[column.dataIndex]" />
      </template>
    </template>
  </Table>
</template>
<script setup>
import {
  Table,
  Input,
  Select,
  Checkbox,
  Divider,
  Space,
  Button,
} from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { inject, defineComponent } from "vue";

const VNodes = defineComponent({
  props: {
    vnodes: {
      type: Object,
      required: true,
    },
  },
  render() {
    return this.vnodes;
  },
});
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
    title: "字段Href",
    dataIndex: "fieldHref",
    width: 100,
  },
  {
    title: "验证规则",
    dataIndex: "fieldValidType",
    width: 300,
  },
  {
    title: "校验必填",
    dataIndex: "fieldMustInput",
    width: 100,
  },
  {
    title: "字典Table",
    dataIndex: "dictTable",
    width: 100,
  },
  {
    title: "字典Code",
    dataIndex: "dictField",
    width: 150,
  },
  {
    title: "字典Text",
    dataIndex: "dictText",
    width: 150,
  },
];

const fieldValidateOptions = [
  { label: "空", value: "" },
  { label: "唯一校验", value: "only" },
  { label: "6到16位数字", value: "n6-16" },
  { label: "6到18位字母", value: "s6-18" },
  { label: "6到16位任意字符", value: "*6-16" },
  { label: "网址", value: "url" },
  { label: "电子邮件", value: "e" },
  { label: "手机号码", value: "m" },
  { label: "邮政编码", value: "p" },
  { label: "字母", value: "s" },
  { label: "数字", value: "n" },
  { label: "整数", value: "z" },
  { label: "非空", value: "*" },
  { label: "金额", value: "money" },
];

const requestParams = inject("requestParams");
</script>
<style scoped>
@import url("../../common.css");
</style>
