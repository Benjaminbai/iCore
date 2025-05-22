<template>
  <contextHolder />
  <Modal
    width="60%"
    :open="UserContext.openTrash"
    title="用户回收站"
    @cancel="UserContext.openTrash = false"
    :footer="null"
  >
    <Dropdown>
      <template #overlay>
        <Menu>
          <MenuItem @click="batchDeleteHandler">批量删除</MenuItem>
          <MenuItem @click="batchPutRecycleBin">批量取回</MenuItem>
        </Menu>
      </template>
      <Button v-show="selectedKeys.length > 0" style="margin-bottom: 10px">
        批量操作
        <DownOutlined />
      </Button>
    </Dropdown>

    <Table
      :columns="columns"
      :dataSource="dataSource"
      :rowSelection="rowSelection"
      rowKey="id"
    >
      <template v-slot:bodyCell="{ column = {}, record = {} }">
        <template v-if="column.dataIndex === 'avatar'">
          <Avatar
            shape="square"
            :src="
              record?.avatar?.startsWith('http')
                ? record.avatar
                : sysCommonStaticApi.url + record.avatar
            "
          ></Avatar>
        </template>
        <template v-if="column.dataIndex === 'sex'">
          <span>{{ record.sex === 1 ? "男" : "女" }}</span>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div>
            <Popconfirm
              title="确定取回吗?"
              okText="是"
              cancelText="否"
              @confirm="putBackHandler(record.id)"
            >
              <Button type="link" :icon="h(UndoOutlined)">取回</Button>
            </Popconfirm>

            <Divider type="vertical" />
            <Popconfirm
              title="确定彻底删除吗?"
              okText="是"
              cancelText="否"
              @confirm="phiscyDeleteHandler(record.id)"
            >
              <Button type="link" :icon="h(ScissorOutlined)" danger
                >彻底删除</Button
              >
            </Popconfirm>
          </div>
        </template>
      </template>
    </Table>
  </Modal>
</template>

<script setup>
import {
  Modal,
  Dropdown,
  Menu,
  MenuItem,
  Button,
  Table,
  Popconfirm,
  Divider,
  message,
  Avatar,
} from "ant-design-vue";
import { inject, onMounted, ref, h } from "vue";
import {
  DownOutlined,
  ScissorOutlined,
  UndoOutlined,
} from "@ant-design/icons-vue";

import {
  sysUserRecycleBinApi,
  sysUserPutRecycleBinApi,
  sysUserDeleteRecycleBinApi,
  sysCommonStaticApi,
} from "./api";

const UserContext = inject("UserContext");
const [messageApi, contextHolder] = message.useMessage();

const selectedKeys = ref([]);
const rowSelection = {
  onChange: (selectedRowKeys) => {
    selectedKeys.value = selectedRowKeys;
  },
};
const columns = [
  {
    title: "用户账号",
    dataIndex: "username",
    width: "20%",
  },
  {
    title: "用户姓名",
    dataIndex: "realname",
    width: "20%",
  },
  {
    title: "头像",
    dataIndex: "avatar",
    width: "10%",
  },
  {
    title: "性别",
    dataIndex: "sex",
    width: "10%",
  },
  {
    title: "操作",
    dataIndex: "action",
  },
];

const dataSource = ref([]);

const sysUserRecycleBin = () => {
  const params = {
    pageNo: 1,
    pageSize: 10,
  };
  sysUserRecycleBinApi(params).then((res) => {
    if (res.success) {
      dataSource.value = res.result;
    } else {
      messageApi.error(res.message);
    }
  });
};

const putBackHandler = (id) => {
  sysUserPutRecycleBin(id);
};

const sysUserPutRecycleBin = (id) => {
  const params = {
    userIds: id,
  };
  sysUserPutRecycleBinApi(params).then((res) => {
    if (res.success) {
      sysUserRecycleBin();
      UserContext.value.sysUserListAll();
    } else {
      messageApi.error(res.message);
    }
  });
};

const phiscyDeleteHandler = (id) => {
  sysUserDeleteRecycleBin(id);
};

const sysUserDeleteRecycleBin = (id) => {
  const params = {
    userIds: id,
  };
  sysUserDeleteRecycleBinApi(params).then((res) => {
    if (res.success) {
      sysUserRecycleBin();
    } else {
      messageApi.error(res.message);
    }
  });
};

const batchPutRecycleBin = () => {
  const params = {
    userIds: selectedKeys.value.join(","),
  };
  sysUserPutRecycleBinApi(params).then((res) => {
    if (res.success) {
      selectedKeys.value = [];
      sysUserRecycleBin();
      UserContext.value.sysUserListAll();
    } else {
      messageApi.error(res.message);
    }
  });
};

const batchDeleteHandler = () => {
  const params = {
    userIds: selectedKeys.value.join(","),
  };
  sysUserDeleteRecycleBinApi(params).then((res) => {
    if (res.success) {
      selectedKeys.value = [];
      sysUserRecycleBin();
      UserContext.value.sysUserListAll();
    } else {
      messageApi.error(res.message);
    }
  });
};

onMounted(() => {
  sysUserRecycleBin();
});
</script>
