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
      <Button v-show="requestParams.deleteFieldIds.length > 0">
        <DeleteOutlined />
        删除
      </Button>
    </Popconfirm>
  </Space>
  <Table
    bordered
    :dataSource="requestParams.fields"
    :columns="columns"
    :rowSelection="rowSelection"
    rowKey="fake_id"
  >
    <template #headerCell="{ column }">
      <template
        v-if="
          [
            'dbFieldName',
            'dbFieldTxt',
            'fieldDefaultValue',
            'dbLength',
            'dbPointLength',
            'dbType',
          ].includes(column.dataIndex)
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
          ['dbFieldName', 'dbFieldTxt', 'fieldDefaultValue'].includes(
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
      <template v-if="['dbLength', 'dbPointLength'].includes(column.dataIndex)">
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
          {{ text }}
        </div>
      </template>
      <template v-if="['dbType'].includes(column.dataIndex)">
        <Select
          v-if="record[column.dataIndex + '_edit']"
          v-model:value="record[column.dataIndex]"
          @blur="record[column.dataIndex + '_edit'] = false"
          class="cell-input"
        >
          <SelectOption value="string">String</SelectOption>
          <SelectOption value="int">Integer</SelectOption>
          <SelectOption value="double">Double</SelectOption>
          <SelectOption value="Date">Date</SelectOption>
          <SelectOption value="Datetime">Datetime</SelectOption>
          <SelectOption value="BigDecimal">BigDecimal</SelectOption>
          <SelectOption value="Text">Text</SelectOption>
          <SelectOption value="Blob">Blob</SelectOption>
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
      <template
        v-if="['dbIsKey', 'dbIsNull', 'dbIsPersist'].includes(column.dataIndex)"
      >
        <Checkbox
          v-model:checked="record[column.dataIndex]"
          :disabled="record['dbFieldName'] === 'id'"
        />
      </template>
    </template>
  </Table>
</template>
<script setup>
import { ref, h, inject } from "vue";
import {
  Table,
  Input,
  Button,
  Checkbox,
  InputNumber,
  Select,
  SelectOption,
  Space,
  Popconfirm,
} from "ant-design-vue";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons-vue";

const columns = [
  {
    title: "字段名称",
    dataIndex: "dbFieldName",
    width: 100,
  },
  {
    title: "字段备注",
    dataIndex: "dbFieldTxt",
    width: 100,
  },
  {
    title: "字段长度",
    dataIndex: "dbLength",
    width: 80,
  },
  {
    title: "小数点",
    dataIndex: "dbPointLength",
    width: 80,
  },
  {
    title: "默认值",
    dataIndex: "fieldDefaultValue",
    width: 100,
  },
  {
    title: "字段类型",
    dataIndex: "dbType",
    width: 100,
  },
  {
    title: "主键",
    dataIndex: "dbIsKey",
    width: 60,
  },
  {
    title: "允许空值",
    dataIndex: "dbIsNull",
    width: 60,
  },
  {
    title: "同步数据库",
    dataIndex: "dbIsPersist",
    width: 60,
  },
];
const requestParams = inject("requestParams");

const rowSelection = {
  onChange: (selectedRowKeys) => {
    requestParams.value.deleteFieldIds = selectedRowKeys;
  },
  getCheckboxProps: (record) => ({
    disabled: record.dbFieldName === "id",
  }),
};

const handleAdd = () => {
  const newData = {
    dbFieldName: "",
    dbFieldTxt: "",
    dbLength: 0,
    dbPointLength: 0,
    fieldDefaultValue: "",
    dbType: "",
    dbIsKey: false,
    dbIsNull: true,
    dbIsPersist: true,
    fake_id: "_" + new Date().getTime(),
  };
  requestParams.value.fields.push(newData);
};

const batchDeleteHandler = () => {
  const deleteIds = requestParams.value.deleteFieldIds;
  requestParams.value.fields = requestParams.value.fields.filter(
    (item) => !deleteIds.includes(item.fake_id)
  );
  requestParams.value.deleteFieldIds =
    requestParams.value.deleteFieldIds.filter((v) => !v.startsWith("_"));
};
</script>
<style scoped>
@import url("../../common.css");
</style>
