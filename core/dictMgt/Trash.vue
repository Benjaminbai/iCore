<template>
  <contextHolder />
  <Modal
    width="60%"
    :open="DictContext.openTrash"
    title="编辑字典"
    @cancel="DictContext.openTrash = false"
    :footer="null"
  >
    <Dropdown style="margin-bottom: 10px">
      <template #overlay>
        <Menu>
          <MenuItem @click="sysDictDeleteRecycleBin">批量删除</MenuItem>
          <MenuItem @click="sysDictPutRecycleBin">批量取回</MenuItem>
        </Menu>
      </template>
      <Button v-show="selectedKeys.length > 0">
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
        <template v-if="column.dataIndex === 'action'">
          <div>
            <Popconfirm
              title="确定删除吗?"
              okText="是"
              cancelText="否"
              @confirm="putBackHandler(record.id)"
            >
              <Button type="link" :icon="h(UndoOutlined)">取回</Button>
            </Popconfirm>

            <Divider type="vertical" />
            <Popconfirm
              title="确定删除吗?"
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
} from "ant-design-vue";
import { inject, onMounted, ref, h } from "vue";
import {
  DownOutlined,
  ScissorOutlined,
  UndoOutlined,
} from "@ant-design/icons-vue";

import {
  sysDictDeleteListApi,
  sysDictBackApi,
  sysDictDeletePhysicApi,
  sysDictPutRecycleBinApi,
  sysDictDeleteRecycleBinApi,
} from "./api";

const DictContext = inject("DictContext");
const [messageApi, contextHolder] = message.useMessage();

const selectedKeys = ref([]);
const rowSelection = {
  onChange: (selectedRowKeys) => {
    selectedKeys.value = selectedRowKeys;
  },
};
const columns = [
  {
    title: "字典名称",
    dataIndex: "dictName",
    width: "20%",
  },
  {
    title: "字典编码",
    dataIndex: "dictCode",
    width: "20%",
  },
  {
    title: "描述",
    dataIndex: "description",
    width: "20%",
  },
  {
    title: "操作",
    dataIndex: "action",
  },
];

const dataSource = ref([]);

const sysDictDeleteList = () => {
  sysDictDeleteListApi().then((res) => {
    if (res.success) {
      dataSource.value = res.result;
    } else {
      messageApi.error(res.message);
    }
  });
};

const putBackHandler = (id) => {
  sysDictBack(id);
};

const sysDictBack = (id) => {
  sysDictBackApi(id).then((res) => {
    if (res.success) {
      sysDictDeleteList();
      DictContext.value.sysDictList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const phiscyDeleteHandler = (id) => {
  sysDictDeletePhysic(id);
};

const sysDictDeletePhysic = (id) => {
  sysDictDeletePhysicApi(id).then((res) => {
    if (res.success) {
      sysDictDeleteList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const sysDictPutRecycleBin = () => {
  const params = {
    ids: selectedKeys.value.join(","),
  };
  sysDictPutRecycleBinApi(params).then((res) => {
    if (res.success) {
      selectedKeys.value = [];
      sysDictDeleteList();
      DictContext.value.sysDictList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const sysDictDeleteRecycleBin = () => {
  const params = {
    ids: selectedKeys.value.join(","),
  };
  sysDictDeleteRecycleBinApi(params).then((res) => {
    if (res.success) {
      selectedKeys.value = [];
      sysDictDeleteList();
      DictContext.value.sysDictList();
    } else {
      messageApi.error(res.message);
    }
  });
};

onMounted(() => {
  sysDictDeleteList();
});
</script>
