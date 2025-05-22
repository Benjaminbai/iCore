<template>
  <contextHolder />
  <Query @refreash="refreash" />
  <Table
    :dataConfig="dataConfig"
    :refreashHandler="sysRoleList"
    :loading="loading"
    :pagination="pagination"
    @change="tableChangeHandler"
  >
    <template #tools>
      <Space>
        <Button type="primary" @click="addHandler">新增</Button>
        <Button type="primary" @click="sysRoleExportXls">导出</Button>
        <Upload
          name="file"
          :action="sysRoleImportExcelApi.url"
          :headers="{
            'X-Access-Token': TOKEN,
          }"
          :showUploadList="false"
          @change="handleChange"
        >
          <Button type="primary">导入</Button>
        </Upload>
      </Space>
    </template>
    <template v-slot:bodyCell="{ column = {}, record = {} }">
      <template v-if="column.dataIndex === 'action'">
        <span>
          <a @click="userHandler(record)">用户</a>
          <Divider type="vertical" />
          <a @click="authorizeHandler(record)">授权</a>
          <Divider type="vertical" />
          <Dropdown>
            <a href="javascript:;"
              >更多 <DownOutlined class="more-action-icon"
            /></a>

            <template #overlay>
              <Menu>
                <MenuItem @click="editHandler(record)">编辑</MenuItem>
                <MenuItem @click="viewHandler(record)">详情</MenuItem>
                <MenuItem>
                  <Popconfirm
                    title="确定删除吗?"
                    okText="是"
                    cancelText="否"
                    @confirm="sysRoleDelete(record.id)"
                  >
                    <a href="javascript:;">删除</a>
                  </Popconfirm>
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </span>
      </template>
    </template>
  </Table>

  <User />
  <Edit />
  <Authorize v-if="RoleContext.openAuthorize" />
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
  Popconfirm,
  Modal,
  Upload,
} from "ant-design-vue";
import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { watchEffect, provide, reactive, ref, createVNode, h } from "vue";

import Table from "@core/libs/table/Table.vue";
import Query from "./query/Query.vue";
import {
  sysRoleImportExcelApi,
  sysRoleExportXlsApi,
  sysRoleListApi,
  sysRoleDeleteApi,
} from "./api";
import User from "./user/User.vue";
import Edit from "./edit/Edit.vue";
import Authorize from "./authorize/Authorize.vue";

const [messageApi, contextHolder] = message.useMessage();
const RoleContext = ref({});
provide("RoleContext", RoleContext);

const TOKEN = JSON.parse(localStorage.getItem("LOCALINFO") || "{}")?.token;

const backupList = [
  {
    title: "角色名称",
    dataIndex: "roleName",
  },
  {
    title: "角色编码",
    dataIndex: "roleCode",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
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

const tableChangeHandler = (_pagination) => {
  const { current, pageSize, total } = _pagination;
  pagination.value.current = current;
  pagination.value.pageSize = pageSize;
  pagination.value.total = total;
};

const handleChange = (info) => {
  if (info.file.status === "done") {
    sysRoleList();
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

const sysRoleExportXls = () => {
  const params = {
    column: "createTime",
    order: "desc",
  };
  sysRoleExportXlsApi(params, "角色列表.xls");
};

const sysRoleList = () => {
  const params = {
    column: "id",
    order: "desc",
    pageNo: pagination.value.current,
    pageSize: pagination.value.pageSize,
    ...formState.value,
  };
  loading.value = true;
  sysRoleListApi(params)
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

const userHandler = (record) => {
  RoleContext.value.openUser = true;
  RoleContext.value.record = record;
};

const sysRoleDelete = (id) => {
  const params = {
    id,
  };
  sysRoleDeleteApi(params).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      sysRoleList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const addHandler = () => {
  RoleContext.value.openEdit = true;
  RoleContext.value.record = {};
  RoleContext.value.isView = false;
};

const editHandler = (record) => {
  RoleContext.value.openEdit = true;
  RoleContext.value.record = record;
  RoleContext.value.isView = false;
};

const viewHandler = (record) => {
  RoleContext.value.openEdit = true;
  RoleContext.value.record = record;
  RoleContext.value.isView = true;
};

const authorizeHandler = (record) => {
  RoleContext.value.openAuthorize = true;
  RoleContext.value.record = record;
};

watchEffect(() => {
  sysRoleList();
});

RoleContext.value.sysRoleList = sysRoleList;
</script>
