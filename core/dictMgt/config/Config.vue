<template>
  <contextHolder />
  <Drawer
    title="字典配置"
    size="large"
    :open="DictContext.openConfig"
    @close="DictContext.openConfig = false"
  >
    <Query />

    <Button type="primary" style="margin-bottom: 10px" @click="addHandler"
      >新增</Button
    >

    <Table :columns="columns" :dataSource="dataSource">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <span>
            <a @click="editHandler(record)">编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除吗?"
              okText="是"
              cancelText="否"
              @confirm="confirmDeleteHandler(record)"
            >
              <a href="javascript:;">删除</a>
            </Popconfirm>
          </span>
        </template>
      </template>
    </Table>

    <Edit />
  </Drawer>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import {
  Drawer,
  message,
  Button,
  Table,
  Divider,
  Popconfirm,
} from "ant-design-vue";

import Query from "./Query.vue";
import { sysDictItemListApi, sysDictItemDeleteApi } from "../api";
import Edit from "./Edit.vue";

const [messageApi, contextHolder] = message.useMessage();
const DictContext = inject("DictContext");

const columns = [
  {
    title: "名称",
    dataIndex: "itemText",
  },
  {
    title: "数据值",
    dataIndex: "itemValue",
  },
  {
    title: "状态",
    dataIndex: "status_dictText",
  },
  {
    title: "操作",
    dataIndex: "action",
  },
];

const dataSource = ref([]);

const sysDictItemList = (val = {}) => {
  const params = {
    pageNo: 1,
    pageSize: 10,
    dictId: DictContext.value.record.id,
    ...val,
  };
  sysDictItemListApi(params).then((res) => {
    if (res.success) {
      dataSource.value = res.result.records;
    } else {
      messageApi.error(res.message);
    }
  });
};

const addHandler = () => {
  DictContext.value.openConfigEdit = true;
  DictContext.value.configRecord = {};
};

const editHandler = (record) => {
  DictContext.value.openConfigEdit = true;
  DictContext.value.configRecord = record;
};

const sysDictItemDelete = (id) => {
  const params = {
    id,
  };
  sysDictItemDeleteApi(params).then((res) => {
    if (res.success) {
      messageApi.success("删除成功");
      sysDictItemList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const confirmDeleteHandler = (record) => {
  sysDictItemDelete(record.id);
};

onMounted(() => {
  sysDictItemList();
});

DictContext.value.sysDictItemList = sysDictItemList;
</script>
