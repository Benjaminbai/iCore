<template>
  <contextHolder />

  <Drawer
    title="角色用户"
    :open="RoleContext.openUser"
    @close="RoleContext.openUser = false"
    size="large"
  >
    <Query @refreash="refreash" />
    <Table
      :dataConfig="dataConfig"
      :styleConfig="styleConfig"
      :rowSelection="rowSelection"
      :refreashHandler="sysUserRoleList"
      :loading="loading"
      :pagination="pagination"
      @change="tableChangeHandler"
    >
      <template #tools>
        <Space>
          <Button type="primary" @click="addHandler">新增用户</Button>
          <Button type="primary" @click="userListHandler">已有用户</Button>
          <Dropdown v-if="selectedKeys.length > 0">
            <template #overlay>
              <Menu>
                <MenuItem @click="batchHandler">批量取消关联</MenuItem>
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
        <template v-if="column.dataIndex === 'action'">
          <span>
            <a @click.stop="editHandler(record)">编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定取消关联吗?"
              okText="是"
              cancelText="否"
              @confirm="sysUserDeleteUserRole(record.id)"
            >
              <a href="javascript:;">取消关联</a>
            </Popconfirm>
          </span>
        </template>
      </template>
    </Table>
  </Drawer>
  <Edit v-if="UserContext.openEdit" />
  <UserSelect v-if="UserContext.openUserSelect" />
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
  Drawer,
} from "ant-design-vue";
import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { provide, reactive, ref, inject, watch, createVNode } from "vue";

import Table from "@core/libs/table/Table.vue";
import {
  sysUserRoleListApi,
  sysUserDeleteUserRoleApi,
  sysUserDeleteUserRoleBatchApi,
} from "../api";
import Query from "./query/Query.vue";
import Edit from "../../userMgt/edit/Edit.vue";
import UserSelect from "../userSelect/UserSelect.vue";

const [messageApi, contextHolder] = message.useMessage();
const RoleContext = inject("RoleContext");
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
    title: "状态",
    dataIndex: "status_dictText",
  },
  {
    title: "操作",
    dataIndex: "action",
  },
];
const formState = ref({});
const loading = ref(false);
const selectedKeys = ref([]);
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
const styleConfig = reactive({
  bordered: true,
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
  sysUserRoleList();
};

const sysUserRoleList = () => {
  const params = {
    pageNo: pagination.value.current,
    pageSize: pagination.value.pageSize,
    roleId: RoleContext.value.record.id,
    ...formState.value,
  };
  loading.value = true;
  sysUserRoleListApi(params)
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
  sysUserRoleList();
};

const sysUserDeleteUserRole = (userId) => {
  const params = {
    roleId: RoleContext.value.record.id,
    userId,
  };
  sysUserDeleteUserRoleApi(params).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      sysUserRoleList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const sysUserDeleteUserRoleBatch = () => {
  loading.value = true;
  const params = {
    roleId: RoleContext.value.record.id,
    userIds: selectedKeys.value.join(","),
  };
  sysUserDeleteUserRoleBatchApi(params)
    .then((res) => {
      if (res.success) {
        messageApi.success(res.message);
        sysUserRoleList();
      } else {
        messageApi.error(res.message);
      }
    })
    .finally(() => {
      selectedKeys.value = [];
    });
};

const batchHandler = () => {
  Modal.confirm({
    title: "确认批量取消关联吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      sysUserDeleteUserRoleBatch();
    },
  });
};

const addHandler = () => {
  UserContext.value.openEdit = true;
  UserContext.value.record = {};
  UserContext.value.disabled = false;
};

const editHandler = (record, disabled = false) => {
  UserContext.value.openEdit = true;
  UserContext.value.record = { ...record };
  UserContext.value.disabled = disabled;
};

const userListHandler = () => {
  UserContext.value.openUserSelect = true;
  UserContext.value.roleId = RoleContext.value.record.id;
};

UserContext.value.sysUserListAll = sysUserRoleList;

watch(
  () => RoleContext.value.record,
  (val) => {
    if (val) {
      formState.value = {};
      selectedKeys.value = [];
      pagination.value.current = 1;
      sysUserRoleList();
    }
  }
);
</script>
