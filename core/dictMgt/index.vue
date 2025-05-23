<template>
  <contextHolder />
  <Query @refreash="refreash" />

  <Table
    :dataConfig="dataConfig"
    :rowSelection="rowSelection"
    :refreashHandler="sysDictList"
    :loading="loading"
    :pagination="pagination"
    @change="tableChangeHandler"
  >
    <template #tools>
      <Space>
        <Button type="primary" @click="addHandler">新增</Button>
        <Button type="primary" @click="sysDictExportXls">导出</Button>
        <Upload
          name="file"
          :action="sysDictImportExcelApi.url"
          :headers="{ 'X-Access-Token': TOKEN }"
          :showUploadList="false"
          @change="handleChange"
        >
          <Button type="primary">导入</Button>
        </Upload>

        <Button type="primary" @click="cleanCacheHandler">刷新缓存</Button>
        <Button type="primary" @click="trashHandler">回收站</Button>
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
      <template v-if="column.dataIndex === 'action'">
        <div>
          <a @click.stop="editHandler(record)">编辑 </a>
          <Divider type="vertical" />
          <a @click.stop="configHandler(record)">字典配置 </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除吗?"
            okText="是"
            cancelText="否"
            @confirm="confirmDeleteHandler(record)"
          >
            <a href="javascript:;">删除</a>
          </Popconfirm>
        </div>
      </template>
    </template>
  </Table>

  <Edit />
  <Config v-if="DictContext.openConfig" />
  <Trash v-if="DictContext.openTrash" />
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
import Query from "./Query.vue";
import {
  sysDictListApi,
  sysDictDeleteApi,
  sysDictDeleteBatchApi,
  sysDictRefleshCacheApi,
  sysDictQueryAllDictItemsApi,
  sysDictExportXlsApi,
  sysDictImportExcelApi,
} from "./api";
import Edit from "./Edit.vue";
import Config from "./config/Config.vue";
import Trash from "./Trash.vue";

const [messageApi, contextHolder] = message.useMessage();
const TOKEN = JSON.parse(localStorage.getItem("LOCALINFO") || "{}")?.token;

const backupList = [
  {
    title: "字典名称",
    dataIndex: "dictName",
    width: "25%",
  },
  {
    title: "字典编码",
    dataIndex: "dictCode",
    width: "25%",
  },
  {
    title: "描述",
    dataIndex: "description",
    width: "25%",
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

const sysDictList = () => {
  loading.value = true;
  const params = {
    column: "createTime",
    order: "desc",
    pageNo: pagination.value.current,
    pageSize: pagination.value.pageSize,
    dictName: formState.value.dictName && `*${formState.value.dictName}*`,
    dictCode: formState.value.dictCode && `*${formState.value.dictCode}*`,
  };
  sysDictListApi(params).then((res) => {
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
  DictContext.value.openEdit = true;
  DictContext.value.record = {};
};

const editHandler = (record) => {
  DictContext.value.openEdit = true;
  DictContext.value.record = record;
};

const confirmDeleteHandler = (record) => {
  const params = {
    id: record.id,
  };
  sysDictDeleteApi(params).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      sysDictList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const sysDictDeleteBatch = () => {
  const params = {
    ids: selectedKeys.value.join(","),
  };
  sysDictDeleteBatchApi(params).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      selectedKeys.value = [];
      sysDictList();
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
      sysDictDeleteBatch();
    },
  });
};

const configHandler = (record) => {
  DictContext.value.openConfig = true;
  DictContext.value.record = record;
};

const DictContext = ref({
  openEdit: false,
  sysDictList,
});

const cleanCacheHandler = () => {
  sysDictRefleshCache();
  sysDictQueryAllDictItems();
};

const sysDictRefleshCache = () => {
  sysDictRefleshCacheApi().then((res) => {
    if (!res.success) {
      messageApi.error(res.message);
    }
  });
};

const sysDictQueryAllDictItems = () => {
  sysDictQueryAllDictItemsApi().then((res) => {
    if (res.success) {
      // 等待后续的处理
    } else {
      messageApi.error(res.message);
    }
  });
};

const trashHandler = () => {
  DictContext.value.openTrash = true;
};

const sysDictExportXls = () => {
  const params = {
    column: "createTime",
    order: "desc",
    selections: selectedKeys.value.join(","),
  };
  sysDictExportXlsApi(params, "数据字典列表.xls");
};

const handleChange = (info) => {
  if (info.file.status === "done") {
    sysDictList();
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

provide("DictContext", DictContext);

watchEffect(() => {
  sysDictList();
});
</script>
