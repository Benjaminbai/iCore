<template>
  <contextHolder />
  <Query @refreash="refreash" />
  <Table
    :dataConfig="dataConfig"
    :rowSelection="rowSelection"
    :refreashHandler="sysUserListAll"
    :loading="loading"
    :pagination="pagination"
    @change="tableChangeHandler"
  >
    <template #tools>
      <Space>
        <Button type="primary" @click="addHandler">新增</Button>
        <Button type="primary" @click="sysUserExportXls">导出</Button>
        <Upload
          name="file"
          :action="sysUserImportExcelApi.url"
          :headers="{ 'X-Access-Token': TOKEN }"
          :showUploadList="false"
          @change="handleChange"
        >
          <Button type="primary">导入</Button>
        </Upload>
        <Button type="primary" @click="UserContext.openTrash = true"
          >回收站</Button
        >
        <Dropdown v-if="selectedKeys.length > 0">
          <template #overlay>
            <Menu>
              <MenuItem @click="batchHandler('delete')">批量删除</MenuItem>
              <MenuItem @click="batchHandler('frozen')">批量冻结</MenuItem>
              <MenuItem @click="batchHandler('unfrozen')">批量解冻</MenuItem>
            </Menu>
          </template>
          <Button>
            批量操作
            <DownOutlined />
          </Button>
        </Dropdown>
      </Space>
    </template>
    <template v-slot:bodyCell="{ column = {}, record = {} }">
      <template v-if="column.dataIndex === 'avatar'">
        <Avatar
          shape="square"
          :src="
            record.avatar?.startsWith('http')
              ? record.avatar
              : sysCommonStaticApi.url + record.avatar
          "
        ></Avatar>
      </template>
      <template v-if="column.dataIndex === 'sex'">
        <span>{{ record.sex === 1 ? "男" : "女" }}</span>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <span>
          <a @click.stop="editHandler(record)">编辑 </a>
          <Divider type="vertical" />
          <Dropdown>
            <a href="javascript:;"
              >更多 <DownOutlined class="more-action-icon"
            /></a>

            <template #overlay>
              <Menu>
                <MenuItem @click="editHandler(record, true)">详情</MenuItem>
                <MenuItem @click="passwordHandler(record)">密码</MenuItem>
                <MenuItem>
                  <Popconfirm
                    title="确定删除吗?"
                    okText="是"
                    cancelText="否"
                    @confirm="sysUserDelete(record.id)"
                  >
                    <a href="javascript:;">删除</a>
                  </Popconfirm>
                </MenuItem>
                <MenuItem v-if="record.status === 1">
                  <Popconfirm
                    title="确定冻结吗?"
                    okText="是"
                    cancelText="否"
                    @confirm="sysUserFrozenBatch(record.id, 2)"
                  >
                    <a href="javascript:;">冻结</a>
                  </Popconfirm>
                </MenuItem>
                <MenuItem v-if="record.status === 2">
                  <Popconfirm
                    title="确定解冻吗?"
                    okText="是"
                    cancelText="否"
                    @confirm="sysUserFrozenBatch(record.id, 1)"
                  >
                    <a href="javascript:;">解冻</a>
                  </Popconfirm>
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </span>
      </template>
    </template>
  </Table>
  <Edit v-if="UserContext.openEdit" />
  <Password v-if="UserContext.openPassword" />
  <Trash v-if="UserContext.openTrash" />
</template>

<script setup>
import {
  Button,
  Divider,
  Dropdown,
  Menu,
  MenuItem,
  message,
  Space,
  Avatar,
  Popconfirm,
  Modal,
  Upload,
} from "ant-design-vue";
import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { watchEffect, provide, reactive, ref, createVNode, h } from "vue";

import Table from "@core/libs/table/Table.vue";
import Query from "./query/Query.vue";
import {
  sysUserListAllApi,
  sysCommonStaticApi,
  sysUserFrozenBatchApi,
  sysUserDeleteApi,
  sysUserDeleteBatchApi,
  sysUserImportExcelApi,
  sysUserExportXlsApi,
} from "./api";
import Edit from "./edit/Edit.vue";
import Password from "./edit/Password.vue";
import Trash from "./Trash.vue";

const [messageApi, contextHolder] = message.useMessage();
const TOKEN = JSON.parse(localStorage.getItem("LOCALINFO") || "{}")?.token;
const UserContext = ref({});
provide("UserContext", UserContext);

const backupList = [
  {
    title: "用户账号",
    dataIndex: "username",
  },
  {
    title: "用户姓名",
    dataIndex: "realname",
  },
  {
    title: "头像",
    dataIndex: "avatar",
  },
  {
    title: "性别",
    dataIndex: "sex",
  },
  {
    title: "生日",
    dataIndex: "birthday",
  },
  {
    title: "手机号",
    dataIndex: "phone",
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
const formState = ref({});
const selectedKeys = ref([]);
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
  selectedKeys,
});
const rowSelection = {
  onChange: (selectedRowKeys) => {
    selectedKeys.value = selectedRowKeys;
  },
};

const tableChangeHandler = (_pagination) => {
  const { current, pageSize, total } = _pagination;
  pagination.value.current = current;
  pagination.value.pageSize = pageSize;
  pagination.value.total = total;
};

const sysUserListAll = () => {
  loading.value = true;
  const params = {
    column: "sex",
    order: "asc",
    pageNo: pagination.value.current,
    pageSize: pagination.value.pageSize,
    ...formState.value,
    username: formState.value.username && `*${formState.value.username}*`,
    realname: formState.value.realname && `*${formState.value.realname}*`,
  };
  sysUserListAllApi(params)
    .then((res) => {
      if (res.success) {
        dataConfig.dataSource = res.result.records;
        pagination.value.current = res.result.current;
        pagination.value.pageSize = res.result.size;
        pagination.value.total = res.result.total;
      } else {
        messageApi.error(res.message);
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const refreash = (val) => {
  formState.value = val;
  pagination.value.current = 1;
};

const addHandler = () => {
  UserContext.value.openEdit = true;
  UserContext.value.record = {};
  UserContext.value.disabled = false;
};

const editHandler = (record, disabled = false) => {
  UserContext.value.openEdit = true;
  UserContext.value.record = record;
  UserContext.value.disabled = disabled;
};

const passwordHandler = (record) => {
  UserContext.value.openPassword = true;
  UserContext.value.record = record;
};

const sysUserFrozenBatch = (ids, status) => {
  const params = {
    ids,
    status,
  };
  sysUserFrozenBatchApi(params)
    .then((res) => {
      if (res.success) {
        sysUserListAll();
      } else {
        messageApi.error(res.message);
      }
    })
    .finally(() => {
      selectedKeys.value = [];
    });
};

const sysUserDelete = (id) => {
  const params = {
    id,
  };
  sysUserDeleteApi(params)
    .then((res) => {
      if (res.success) {
        sysUserListAll();
      } else {
        messageApi.error(res.message);
      }
    })
    .finally(() => {
      selectedKeys.value = [];
    });
};

const sysUserDeleteBatch = (ids) => {
  const params = {
    ids,
  };
  sysUserDeleteBatchApi(params)
    .then((res) => {
      if (res.success) {
        sysUserListAll();
      } else {
        messageApi.error(res.message);
      }
    })
    .finally(() => {
      selectedKeys.value = [];
    });
};

const batchHandler = (type) => {
  Modal.confirm({
    title: "确认此项批量操作吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      loading.value = true;
      const ids = selectedKeys.value.join(",");
      switch (type) {
        case "delete":
          sysUserDeleteBatch(ids);
          break;
        case "frozen":
          sysUserFrozenBatch(ids, 2);
          break;
        case "unfrozen":
          sysUserFrozenBatch(ids, 1);
          break;
        default:
          break;
      }
    },
  });
};

const handleChange = (info) => {
  if (info.file.status === "done") {
    sysUserListAll();
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

const sysUserExportXls = () => {
  const params = {
    column: "createTime",
    order: "desc",
    selections: selectedKeys.value.join(","),
  };
  sysUserExportXlsApi(params, "用户列表.xls");
};

watchEffect(() => {
  sysUserListAll();
});

UserContext.value.sysUserListAll = sysUserListAll;
</script>
