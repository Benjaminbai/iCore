<template>
  <contextHolder />
  <div class="cgform-wrapper">
    <Query @refreash="refreash" />

    <Table
      :dataConfig="dataConfig"
      :rowSelection="rowSelection"
      :refreashHandler="cgformHeadList"
      :loading="loading"
      :pagination="pagination"
      @change="tableChangeHandler"
    >
      <template #tools>
        <Space>
          <Button type="primary" @click="addHandler">新增</Button>
          <Dropdown>
            <template #overlay>
              <Menu>
                <MenuItem @click="openBatchDel = true">批量删除</MenuItem>
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
        <template v-if="column.dataIndex === 'isDbSynch'">
          <Tag color="green" v-if="record.isDbSynch === 'Y'">已同步</Tag>
          <Tag color="red" v-else>未同步</Tag>
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
                  <MenuItem @click="syncDatabaseHandler(record)"
                    >同步数据库</MenuItem
                  >
                  <MenuItem @click="buttonHandler(record)">自定义按钮</MenuItem>
                  <MenuItem @click="rightHandler(record)">权限控制</MenuItem>
                  <MenuItem @click="authorizeHandler(record)"
                    >角色授权</MenuItem
                  >
                  <MenuItem @click="copyHandler(record)">复制表</MenuItem>
                  <MenuItem @click="removeHandler(record)">移除</MenuItem>
                  <MenuItem @click="deleteHandler(record)">删除</MenuItem>
                </Menu>
              </template>
            </Dropdown>
          </span>
        </template>
      </template>
    </Table>
    <Edit v-if="open" :open="open" :headInfo="headInfo" @setOpen="setOpen" />
    <Right
      v-if="openRight"
      :open="openRight"
      :headInfo="headInfo"
      @setOpen="setOpenRight"
    />
    <ButtonCustomize
      v-if="openButton"
      :open="openButton"
      :headInfo="headInfo"
      @setOpen="setOpenButton"
    />
    <BatchDel
      v-if="openBatchDel"
      :open="openBatchDel"
      :selectedKeys="selectedKeys"
      @setOpen="setOpenBatchDel"
    />
    <Authorize
      v-if="openAuthorize"
      :open="openAuthorize"
      :headInfo="headInfo"
      @setOpen="setOpenAuthorize"
    />
  </div>
</template>
<script setup>
import {
  Input,
  Button,
  Divider,
  Tag,
  Dropdown,
  Menu,
  MenuItem,
  message,
  Modal,
  Space,
  RadioGroup,
  Radio,
} from "ant-design-vue";
import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { reactive, ref, createVNode, h, watchEffect } from "vue";

import Table from "@core/libs/table/Table.vue";
import Edit from "./edit/Edit.vue";
import Right from "./right/Right.vue";
import ButtonCustomize from "./button/Button.vue";
import BatchDel from "./batchDel/BatchDel.vue";
import Query from "./query/Query.vue";
import Authorize from "./authorize/Authorize.vue";

import {
  cgformHeadListApi,
  cgformHeadDeleteApi,
  cgformHeadRemoveRecordApi,
  cgformCopyOnlineTableApi,
  cgformDoDbSynchNormalApi,
  cgformDoDbSynchForceApi,
} from "./api";

const [messageApi, contextHolder] = message.useMessage();

const backupList = [
  {
    title: "表类型",
    dataIndex: "tableType",
  },
  {
    title: "表名",
    dataIndex: "tableName",
  },
  {
    title: "表描述",
    dataIndex: "tableTxt",
  },
  {
    title: "版本",
    dataIndex: "tableVersion",
  },
  {
    title: "同步状态",
    dataIndex: "isDbSynch",
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
const selectedKeys = ref([]);
const loading = ref(true);
const headInfo = ref({});
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: ["10", "20", "50"],
  showSizeChanger: true,
});

const open = ref(false);
const openRight = ref(false);
const openButton = ref(false);
const openBatchDel = ref(false);
const openAuthorize = ref(false);

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

const newTableName = ref("");
const syncDataBaseWays = ref(1);

const addHandler = () => {
  open.value = true;
  headInfo.value = {};
};
const editHandler = (record) => {
  open.value = true;
  headInfo.value = record;
};
const buttonHandler = (record) => {
  openButton.value = true;
  headInfo.value = record;
};

const setOpen = () => {
  open.value = false;
  cgformHeadList();
};
const setOpenRight = () => {
  openRight.value = false;
};
const setOpenButton = () => {
  openButton.value = false;
};
const setOpenBatchDel = () => {
  openBatchDel.value = false;
  selectedKeys.value = [];
  cgformHeadList();
};
const setOpenAuthorize = () => {
  openAuthorize.value = false;
};

const cgformHeadList = () => {
  const params = {
    column: "createTime",
    order: "desc",
    pageNo: pagination.value.current,
    pageSize: pagination.value.pageSize,
    copyType: 0,
    tableName: formState.value.tableName && `*${formState.value.tableName}*`,
    tableType: formState.value.tableType_MultiString,
    tableTxt: formState.value.tableTxt && `*${formState.value.tableTxt}*`,
  };
  loading.value = true;
  cgformHeadListApi(params).then((res) => {
    loading.value = false;
    if (res.success) {
      dataConfig.dataSource = res.result.records;
      pagination.value.total = res.result.total;
    } else {
      messageApi.error(res.message);
    }
  });
};

const rowSelection = {
  onChange: (selectedRowKeys) => {
    selectedKeys.value = selectedRowKeys;
  },
};

const deleteHandler = (record) => {
  Modal.confirm({
    title: "确认彻底删除该表吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除online配置表的同时会删除数据库物理表",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      cgformHeadDelete(record.id);
    },
  });
};

const cgformHeadDelete = (id) => {
  cgformHeadDeleteApi({ id }).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      cgformHeadList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const removeHandler = (record) => {
  Modal.confirm({
    title: "确认移除该表吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "只删除online配置表，数据库物理表保留",
    okText: "移除",
    cancelText: "取消",
    onOk() {
      cgformHeadRemoveRecord(record.id);
    },
  });
};

const cgformHeadRemoveRecord = (id) => {
  cgformHeadRemoveRecordApi({ id }).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      cgformHeadList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const tableChangeHandler = (_pagination) => {
  const { current, pageSize, total } = _pagination;
  pagination.value.current = current;
  pagination.value.pageSize = pageSize;
  pagination.value.total = total;
};

const copyHandler = (record) => {
  newTableName.value = record.tableName + "_copy";
  Modal.info({
    title: "复制表",
    content: h("div", {}, [
      h("p", "请输入新表名："),
      h(Input, {
        value: newTableName.value,
        onInput: (e) => {
          newTableName.value = e.target.value;
        },
      }),
    ]),
    onOk() {
      cgformCopyOnlineTable(record.id, { tableName: newTableName.value });
    },
    closable: true,
  });
};

const cgformCopyOnlineTable = (id, params) => {
  loading.value = true;
  cgformCopyOnlineTableApi(id, params).then((res) => {
    if (res.success) {
      cgformHeadList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const syncDatabaseHandler = (record) => {
  const modalUpdate = (modal, e) => {
    syncDataBaseWays.value = e && e.target.value;
    modal.update({
      title: "同步数据库",
      content: h(
        RadioGroup,
        {
          value: syncDataBaseWays.value,
          onChange: (e) => {
            modalUpdate(modal, e);
          },
        },
        {
          default: () => [
            h(Radio, { value: 1 }, { default: () => "普通同步（保留表数据）" }),
            h(
              Radio,
              { value: 2 },
              { default: () => "强制同步（删除表，重新生成）" }
            ),
          ],
        }
      ),
      onOk() {
        if (syncDataBaseWays.value === 1) {
          cgformDoDbSynchNormal(record.id);
        } else if (syncDataBaseWays.value === 2) {
          cgformDoDbSynchForce(record.id);
        }
      },
      closable: true,
    });
  };

  const modal = Modal.info({});
  modalUpdate(modal);
};

const cgformDoDbSynchNormal = (id) => {
  loading.value = true;
  cgformDoDbSynchNormalApi(id, {}).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      cgformHeadList();
    } else {
      loading.value = false;
      messageApi.error(res.message);
    }
  });
};

const cgformDoDbSynchForce = (id) => {
  loading.value = true;
  cgformDoDbSynchForceApi(id, {}).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      cgformHeadList();
    } else {
      loading.value = false;
      messageApi.error(res.message);
    }
  });
};

const rightHandler = (record) => {
  openRight.value = true;
  headInfo.value = record;
};

const refreash = (val) => {
  formState.value = val;
  pagination.value.current = 1;
};

const authorizeHandler = (record) => {
  openAuthorize.value = true;
  headInfo.value = record;
};

watchEffect(() => {
  cgformHeadList();
});
</script>
<style>
.cgform-wrapper {
  .more-action-icon {
    font-size: 10px;
  }
}
.full {
  .ant-modal {
    max-width: 100% !important;
    top: 0 !important;
    padding-bottom: 0 !important;
    margin: 0 !important;
    .ant-modal-content {
      display: flex;
      flex-direction: column;
      height: calc(100vh);
      padding: 0;
    }
    .ant-modal-body {
      flex: 1;
      padding: 0px;
      overflow: auto;
    }
  }
}
</style>
