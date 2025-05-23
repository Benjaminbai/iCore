<template>
  <contextHolder />
  <Query @refreash="refreash" />

  <Table
    :dataConfig="dataConfig"
    :rowSelection="rowSelection"
    :refreashHandler="sysMessageTemplateList"
    :loading="loading"
    :pagination="pagination"
    @change="tableChangeHandler"
  >
    <template #tools>
      <Space>
        <Button type="primary" @click="addHandler">新增</Button>
        <Button type="primary" @click="sysMessageTemplateExportXls"
          >导出</Button
        >
        <Upload
          name="file"
          :action="sysMessageTemplateImportExcelApi.url"
          :headers="{ 'X-Access-Token': TOKEN }"
          :showUploadList="false"
          @change="handleChange"
        >
          <Button type="primary">导入</Button>
        </Upload>
        <Dropdown>
          <template #overlay>
            <Menu>
              <MenuItem @click="batchDeleteHandler">批量删除</MenuItem>
            </Menu>
          </template>
          <Button v-show="selectedKeys.length > 0">
            批量操作
            <DownOutlined />
          </Button>
        </Dropdown>
      </Space>
    </template>
    <template v-slot:bodyCell="{ column = {}, record = {} }">
      <template v-if="column.dataIndex === 'templateType'">
        <span>{{ record[column.dataIndex] === 1 ? "文本" : "富文本" }}</span>
      </template>
      <template v-if="column.dataIndex === 'useStatus'">
        <span>{{ record[column.dataIndex] == 1 ? "是" : "否" }}</span>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div>
          <a @click.stop="viewHandler(record)">查看 </a>
          <Divider type="vertical" />
          <a @click.stop="editHandler(record)">编辑 </a>
          <Divider type="vertical" />
          <Dropdown>
            <a href="javascript:;"
              >更多 <DownOutlined class="more-action-icon"
            /></a>
            <template #overlay>
              <Menu>
                <MenuItem>
                  <Popconfirm
                    title="确定应用吗?"
                    okText="是"
                    cancelText="否"
                    @confirm="sysMessageTemplateEdit(record.id, '1')"
                  >
                    <a href="javascript:;">应用</a>
                  </Popconfirm>
                </MenuItem>
                <MenuItem>
                  <Popconfirm
                    title="确定停用吗?"
                    okText="是"
                    cancelText="否"
                    @confirm="sysMessageTemplateEdit(record.id, '0')"
                  >
                    <a href="javascript:;">停用</a>
                  </Popconfirm>
                </MenuItem>
                <MenuItem>
                  <Popconfirm
                    title="确定删除吗?"
                    okText="是"
                    cancelText="否"
                    @confirm="sysMessageTemplateDeleteBatch(record.id)"
                  >
                    <a href="javascript:;">删除</a>
                  </Popconfirm>
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </div>
      </template>
    </template>
  </Table>

  <Edit v-if="MsgTempContext.openEdit" />
</template>

<script setup>
import {
  message,
  Space,
  Button,
  Dropdown,
  Menu,
  MenuItem,
  Divider,
  Popconfirm,
  Modal,
  Upload,
} from "ant-design-vue";
import { ref, reactive, watchEffect, provide, createVNode, h } from "vue";
import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";

import { Table } from "../libs";
import Query from "./query/Query.vue";
import {
  sysMessageTemplateListApi,
  sysMessageTemplateExportXlsApi,
  sysMessageTemplateImportExcelApi,
  sysMessageTemplateEditApi,
  sysMessageTemplateDeleteBatchApi,
} from "./api";
import Edit from "./edit/Edit.vue";

const [messageApi, contextHolder] = message.useMessage();
const TOKEN = JSON.parse(localStorage.getItem("LOCALINFO") || "{}")?.token;

const MsgTempContext = ref({});
provide("MsgTempContext", MsgTempContext);

const backupList = [
  {
    title: "模板标题",
    dataIndex: "templateName",
  },
  {
    title: "模板编码",
    dataIndex: "templateCode",
  },
  {
    title: "通知模板",
    dataIndex: "templateContent",
    width: "25%",
    ellipsis: true,
  },
  {
    title: "模板类型",
    dataIndex: "templateType",
    width: "10%",
  },
  {
    title: "是否应用",
    dataIndex: "useStatus",
    width: "10%",
  },
  {
    title: "操作",
    dataIndex: "action",
  },
];
const formState = ref({});
const selectedKeys = ref([]);
const loading = ref(false);
const rowSelection = {
  onChange: (selectedRowKeys) => {
    selectedKeys.value = selectedRowKeys;
  },
};
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
  selectedKeys,
});

const tableChangeHandler = (_pagination) => {
  const { current, pageSize, total } = _pagination;
  pagination.value.current = current;
  pagination.value.pageSize = pageSize;
  pagination.value.total = total;
};

const sysMessageTemplateList = () => {
  loading.value = true;
  const params = {
    column: "createTime",
    order: "desc",
    pageNo: pagination.value.current,
    pageSize: pagination.value.pageSize,
    ...formState.value,
  };
  sysMessageTemplateListApi(params).then((res) => {
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

const addHandler = () => {
  MsgTempContext.value.openEdit = true;
  MsgTempContext.value.record = {};
  MsgTempContext.value.isView = false;
};

const editHandler = (record) => {
  if (record.useStatus == 1)
    return messageApi.warning("此模板已被应用，禁止编辑!");
  MsgTempContext.value.openEdit = true;
  MsgTempContext.value.record = record;
  MsgTempContext.value.isView = false;
};

const viewHandler = (record) => {
  MsgTempContext.value.openEdit = true;
  MsgTempContext.value.record = record;
  MsgTempContext.value.isView = true;
};

const sysMessageTemplateEdit = (id, useStatus) => {
  const params = {
    id,
    useStatus,
  };
  sysMessageTemplateEditApi(params).then((res) => {
    if (res.success) {
      sysMessageTemplateList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const sysMessageTemplateDeleteBatch = (ids) => {
  const params = {
    ids,
  };
  sysMessageTemplateDeleteBatchApi(params).then((res) => {
    if (res.success) {
      selectedKeys.value = [];
      sysMessageTemplateList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const batchDeleteHandler = () => {
  Modal.confirm({
    title: "确认删除吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "",
    okText: "删除",
    cancelText: "取消",
    onOk() {
      sysMessageTemplateDeleteBatch(selectedKeys.value.join(","));
    },
  });
};

const sysMessageTemplateExportXls = () => {
  const params = {
    column: "createTime",
    order: "desc",
    selections: selectedKeys.value.join(","),
  };
  sysMessageTemplateExportXlsApi(params, "消息模板列表.xls");
};

const handleChange = (info) => {
  if (info.file.status === "done") {
    sysMessageTemplateList();
    if (info.file.response.success) {
      const {
        message,
        result: { fileUrl, msg },
      } = info.file.response;
      Modal.confirm({
        title: message,
        icon: createVNode(ExclamationCircleOutlined),
        content: h("div", {}, [
          h("div", {}, [
            h("p", {}, msg),
            h(
              "a",
              { href: sysMessageTemplateImportExcelApi.baseURL + fileUrl },
              "点击下载"
            ),
          ]),
        ]),
        closable: true,
        footer: null,
      });
    } else {
      messageApi.error(info.file.response.message);
    }
  } else if (info.file.status === "error") {
    messageApi.error(`${info.file.name} file upload failed.`);
  }
};

watchEffect(() => {
  sysMessageTemplateList();
});

MsgTempContext.value.sysMessageTemplateList = sysMessageTemplateList;
</script>
