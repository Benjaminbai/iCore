<template>
  <contextHolder />
  <div class="cgreport-wrapper">
    <Form ref="formRef" :model="formState" @finish="onFinish">
      <Row :gutter="24">
        <Col :span="8">
          <FormItem label="报表名称" name="name">
            <Input
              v-model:value="formState.name"
              placeholder="请输入报表名称"
            ></Input>
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="报表编码" name="code">
            <Input
              v-model:value="formState.code"
              placeholder="请输入报表编码"
            ></Input>
          </FormItem>
        </Col>
        <Col :span="8">
          <Button type="primary" html-type="submit">搜索</Button>
          <Button style="margin: 0 8px" @click="resetForm">重置</Button>
        </Col>
      </Row>
    </Form>

    <Table
      :dataConfig="dataConfig"
      bordered
      :rowSelection="rowSelection"
      :refreashHandler="cgreportHeadList"
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
                <MenuItem @click="batchDeleteHandler">删除</MenuItem>
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
          <span>
            <a @click.stop="editHandler(record)">编辑 </a>
            <Divider type="vertical" />
            <Dropdown>
              <a href="javascript:;"
                >更多 <DownOutlined class="more-action-icon"
              /></a>

              <template #overlay>
                <Menu>
                  <MenuItem @click="deleteHandler(record)">删除</MenuItem>
                </Menu>
              </template>
            </Dropdown>
          </span>
        </template>
      </template>
    </Table>
    <Edit :open="open" @setOpen="setOpen" :headInfo="headInfo" />
  </div>
</template>
<script setup>
import {
  Form,
  FormItem,
  Input,
  Button,
  Row,
  Col,
  Divider,
  Dropdown,
  Menu,
  MenuItem,
  message,
  Modal,
  Space,
} from "ant-design-vue";
import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { reactive, ref, createVNode, watchEffect } from "vue";

import { Table } from "../../libs";
import Edit from "./edit/Edit.vue";
import {
  cgreportHeadListApi,
  cgreportHeadDeleteApi,
  cgreportHeadDeleteBatchApi,
} from "./api";

const [messageApi, contextHolder] = message.useMessage();
const formRef = ref();
const formState = reactive({});
const open = ref(false);
const selectedKeys = ref([]);

const backupList = [
  {
    title: "报表名字",
    dataIndex: "name",
    width: 150,
  },
  {
    title: "报表编码",
    dataIndex: "code",
    width: 150,
  },
  {
    title: "报表SQL",
    dataIndex: "cgrSql",
    width: 300,
  },
  {
    title: "数据源",
    dataIndex: "dbSource",
    width: 150,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    width: 150,
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 150,
  },
];
const datasource = [];
const dataConfig = reactive({
  columns: backupList,
  dataSource: datasource,
  backupList: [...backupList],
  checkedState: {
    checkAll: true,
    checkedList: backupList.map((item) => item.dataIndex),
  },
  selectedKeys,
});
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: ["10", "20", "50"],
  showSizeChanger: true,
});
const loading = ref(false);
const headInfo = ref({});

const rowSelection = {
  onChange: (selectedRowKeys) => {
    selectedKeys.value = selectedRowKeys;
  },
};

const cgreportHeadList = () => {
  const params = {
    column: "createTime",
    order: "desc",
    pageNo: pagination.value.current,
    pageSize: pagination.value.pageSize,
    name: formState.name && `*${formState.name}*`,
    code: formState.code && `*${formState.code}*`,
  };
  loading.value = true;
  cgreportHeadListApi(params).then((res) => {
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

const tableChangeHandler = (_pagination) => {
  const { current, pageSize, total } = _pagination;
  pagination.value.current = current;
  pagination.value.pageSize = pageSize;
  pagination.value.total = total;
};

const onFinish = () => {
  pagination.value.current = 1;
};

const resetForm = () => {
  formRef.value.resetFields();
  pagination.value.current = 1;
};

const deleteHandler = (record) => {
  Modal.confirm({
    title: "是否确认删除？",
    icon: createVNode(ExclamationCircleOutlined),
    okText: "确认",
    cancelText: "取消",
    onOk() {
      cgreportHeadDelete(record.id);
    },
  });
};

const cgreportHeadDelete = (id) => {
  loading.value = true;
  cgreportHeadDeleteApi({ id }).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      cgreportHeadList();
    } else {
      loading.value = false;
      messageApi.error(res.message);
    }
  });
};

const batchDeleteHandler = () => {
  Modal.confirm({
    title: "是否确认删除？",
    icon: createVNode(ExclamationCircleOutlined),
    okText: "确认",
    cancelText: "取消",
    onOk() {
      cgreportHeadDeleteBatch();
    },
  });
};

const cgreportHeadDeleteBatch = () => {
  loading.value = true;
  const ids = selectedKeys.value.join(",");
  cgreportHeadDeleteBatchApi({ ids }).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      selectedKeys.value = [];
      cgreportHeadList();
    } else {
      loading.value = false;
      messageApi.error(res.message);
    }
  });
};

const addHandler = () => {
  open.value = true;
  headInfo.value = {};
};

const editHandler = (record) => {
  open.value = true;
  headInfo.value = record;
};
const setOpen = () => {
  open.value = false;
  cgreportHeadList();
};

watchEffect(() => {
  cgreportHeadList();
});
</script>
<style scoped>
.more-action-icon {
  font-size: 10px;
}
</style>
