<template>
  <div>
    <contextHolder />
    <Form ref="formRef" :model="formState" @finish="onFinish">
      <Row :gutter="24">
        <Col :span="8">
          <FormItem label="菜单名称" name="name">
            <Input
              v-model:value="formState.name"
              placeholder="请输入菜单名称"
            ></Input>
          </FormItem>
        </Col>
        <Col :span="8">
          <Button type="primary" html-type="submit">查询</Button>
          <Button style="margin: 0 8px" @click="resetHandler">重置</Button>
        </Col>
      </Row>
    </Form>

    <Table
      :dataConfig="dataConfig"
      bordered
      :refreashHandler="sysPermissionList"
      :loading="loading"
    >
      <template #tools>
        <Button type="primary" @click="addHandler">添加</Button>
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
                  <MenuItem>
                    <a href="javascript:;" @click.stop="addSubHandler(record)"
                      >添加下级</a
                    >
                  </MenuItem>
                  <MenuItem>
                    <Popconfirm
                      title="确定删除吗?"
                      okText="是"
                      cancelText="否"
                      @confirm="confirmDeleteHandler(record)"
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
    <Edit
      v-if="open"
      :open="open"
      :record="record"
      :recordList="dataConfig.dataSource"
      @setOpen="setOpen"
      @refresh="sysPermissionList"
    />
  </div>
</template>

<script setup>
import {
  Form,
  FormItem,
  Row,
  Col,
  Input,
  Button,
  Dropdown,
  Menu,
  MenuItem,
  Divider,
  message,
  Popconfirm,
} from "ant-design-vue";
import { DownOutlined } from "@ant-design/icons-vue";
import { ref, reactive, watchEffect } from "vue";

import Table from "@core/libs/table/Table.vue";
import Edit from "./Edit.vue";
import { sysPermissionListApi, sysPermissionDeleteApi } from "./api";

const [messageApi, contextHolder] = message.useMessage();

const formRef = ref();
const formState = reactive({});
const open = ref(false);
const loading = ref(true);
const record = ref({});

const backupList = [
  {
    title: "菜单名称",
    dataIndex: "name",
    width: 200,
  },
  {
    title: "菜单类型",
    dataIndex: "menuType",
    width: 80,
  },
  {
    title: "图标",
    dataIndex: "icon",
    width: 100,
  },
  {
    title: "组件",
    dataIndex: "component",
    width: 200,
  },
  {
    title: "路径",
    dataIndex: "url",
    width: 200,
  },
  {
    title: "排序",
    dataIndex: "sortNo",
    width: 80,
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 150,
  },
];

const dataConfig = reactive({
  columns: backupList,
  dataSource: [],
  backupList: [...backupList],
  checkedState: {
    checkAll: true,
    checkedList: backupList.map((item) => item.dataIndex),
  },
});

const onFinish = () => {
  sysPermissionList();
};

const addHandler = () => {
  open.value = true;
  record.value = {
    menuType: 0,
  };
};

const addSubHandler = (_record) => {
  open.value = true;
  record.value = {
    menuType: 1,
    parentId: _record.id,
  };
};

const editHandler = (_record) => {
  open.value = true;
  record.value = { ..._record };
};

const setOpen = () => {
  open.value = false;
};

const sysPermissionList = () => {
  setOpen();
  const params = {
    column: "createTime",
    order: "desc",
    ...formState,
  };
  loading.value = true;
  sysPermissionListApi(params).then((res) => {
    loading.value = false;
    if (res.success) {
      dataConfig.dataSource = res.result;
    } else {
      messageApi.error(res.message);
    }
  });
};

const resetHandler = () => {
  formRef.value.resetFields();
};

const confirmDeleteHandler = (record) => {
  loading.value = true;
  const params = {
    id: record.id,
  };
  sysPermissionDeleteApi(params)
    .then((res) => {
      if (res.success) {
        messageApi.success("删除成功");
        sysPermissionList();
      } else {
        messageApi.error(res.message);
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

watchEffect(() => {
  sysPermissionList();
});
</script>

<style scoped></style>
