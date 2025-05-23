<template>
  <contextHolder />
  <Query @refreash="refreash" />
  <Table
    :dataConfig="dataConfig"
    :refreashHandler="sysGetMyAnnouncementSend"
    :loading="loading"
    :pagination="pagination"
    @change="tableChangeHandler"
  >
    <template #tools>
      <Space>
        <Button type="primary" @click="confirmHandler">全部标注已读</Button>
      </Space>
    </template>
    <template v-slot:bodyCell="{ column = {}, record = {} }">
      <template v-if="column.dataIndex === 'msgCategory'">
        <span>{{
          msgCategoryOptions.find((item) => item.value === record.msgCategory)
            .label
        }}</span>
      </template>
      <template v-if="column.dataIndex === 'priority'">
        <span>{{
          priorityOptions.find((item) => item.value === record.priority).label
        }}</span>
      </template>
      <template v-if="column.dataIndex === 'readFlag'">
        <span>{{ record.readFlag === 1 ? "已读" : "未读" }}</span>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <span>
          <a @click.stop="viewHandler(record)">查看</a>
        </span>
      </template>
    </template>
  </Table>

  <Modal
    v-model:open="open"
    width="800px"
    title="查看详情"
    @ok="open = false"
    @cancel="open = false"
    :footer="null"
  >
    <div v-html="content"></div>
  </Modal>
</template>

<script setup>
import { Space, Button, message, Modal } from "ant-design-vue";
import { ref, reactive, watchEffect, createVNode } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";

import Query from "./query/Query.vue";
import { Table } from "../libs";
import {
  sysGetMyAnnouncementSendApi,
  sysAnnouncementSendReadAllApi,
} from "./api";

const [messageApi, contextHolder] = message.useMessage();

const msgCategoryOptions = [
  { label: "系统消息", value: "1" },
  { label: "通知公告", value: "2" },
];

const priorityOptions = [
  { label: "高", value: "H" },
  { label: "中", value: "M" },
  { label: "低", value: "L" },
];

const backupList = [
  {
    title: "标题",
    dataIndex: "titile",
  },
  {
    title: "消息类型",
    dataIndex: "msgCategory",
  },
  {
    title: "发布人",
    dataIndex: "sender",
  },
  {
    title: "发布时间",
    dataIndex: "sendTime",
  },
  {
    title: "优先级",
    dataIndex: "priority",
  },
  {
    title: "阅读状态",
    dataIndex: "readFlag",
  },
  {
    title: "操作",
    dataIndex: "action",
  },
];
const formState = ref({});
const loading = ref(false);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: ["10", "20", "50"],
  showSizeChanger: true,
});
const dataConfig = reactive({
  columns: backupList,
  dataSource: [],
  backupList: [...backupList],
  checkedState: {
    checkAll: true,
    checkedList: backupList.map((item) => item.dataIndex),
  },
});
const open = ref(false);
const content = ref("");

const tableChangeHandler = (_pagination) => {
  const { current, pageSize, total } = _pagination;
  pagination.value.current = current;
  pagination.value.pageSize = pageSize;
  pagination.value.total = total;
};

const sysGetMyAnnouncementSend = () => {
  loading.value = true;
  const params = {
    column: "createTime",
    order: "desc",
    logType: "1",
    pageNo: pagination.value.current,
    pageSize: pagination.value.pageSize,
    titile: formState.value.titile,
    sender: formState.value.sender,
    sendTimeBegin: formState.value.time && formState.value.time[0],
    sendTimeEnd: formState.value.time && formState.value.time[1],
  };
  sysGetMyAnnouncementSendApi(params).then((res) => {
    loading.value = false;
    if (res.success) {
      dataConfig.dataSource = res.result.records;
      pagination.value.current = res.result.current;
      pagination.value.pageSize = res.result.size;
      pagination.value.total = res.result.total;
    } else {
      messageApi.error(res.message);
    }
  });
};

const refreash = (val) => {
  formState.value = val;
  pagination.value.current = 1;
};

const viewHandler = (record) => {
  open.value = true;
  content.value = record.msgContent;
};

const sysAnnouncementSendReadAll = () => {
  sysAnnouncementSendReadAllApi().then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      sysGetMyAnnouncementSend();
    } else {
      messageApi.error(res.message);
    }
  });
};

const confirmHandler = () => {
  Modal.confirm({
    title: "确认操作",
    icon: createVNode(ExclamationCircleOutlined),
    content: "是否全部标注已读?",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      sysAnnouncementSendReadAll();
    },
  });
};

watchEffect(() => {
  sysGetMyAnnouncementSend();
});
</script>
