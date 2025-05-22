<template>
  <contextHolder />
  <FullModal
    title="编辑"
    :open="open"
    destroyOnClose
    @cancel="emit('setOpen')"
    :footer="null"
  >
    <Space style="margin-bottom: 10px">
      <Button type="primary" @click="addHandler">新增</Button>
      <Dropdown>
        <template #overlay>
          <Menu>
            <MenuItem @click="batchDelHandler">批量删除</MenuItem>
          </Menu>
        </template>
        <Button v-show="selectedKeys.length > 0">
          批量操作
          <DownOutlined />
        </Button>
      </Dropdown>
    </Space>
    <Table
      :columns="columns"
      :dataSource="dataSource"
      rowKey="id"
      :rowSelection="rowSelection"
      :pagination="pagination"
      @change="tableChangeHandler"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'buttonStatus'">
          <span>
            {{
              statusOptions.find((item) => item.value == record.buttonStatus)
                .label
            }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <span>
            <a @click="handleEdit(record)">编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="您确定要删除该按钮吗?"
              okText="是"
              cancelText="否"
              @confirm="cgformButtonDeleteBatch(record.id)"
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        </template>
      </template>
    </Table>
  </FullModal>
  <Modal
    v-model:open="openEdit"
    title="编辑"
    @ok="handleOkEdit"
    okText="保存"
    cancelText="取消"
  >
    <Form
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
      ref="formRef"
    >
      <FormItem label="按钮编码" name="buttonCode">
        <Input v-model:value="formState.buttonCode" />
      </FormItem>
      <FormItem label="按钮名称" name="buttonName">
        <Input v-model:value="formState.buttonName" />
      </FormItem>
      <FormItem label="按钮样式">
        <Select v-model:value="formState.buttonStyle">
          <SelectOption value="link">Link</SelectOption>
          <SelectOption value="button">Button</SelectOption>
          <SelectOption value="form">Form</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="按钮类型">
        <Select v-model:value="formState.optType">
          <SelectOption value="js">Js</SelectOption>
          <SelectOption value="action">Action</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="排序">
        <InputNumber v-model:value="formState.orderNum" :min="0" />
      </FormItem>
      <FormItem label="表达式">
        <Input v-model:value="formState.exp" />
      </FormItem>
      <FormItem
        label="按钮图标"
        v-if="formState.buttonStyle && formState.buttonStyle !== 'link'"
      >
        <Input v-model:value="formState.buttonIcon" />
      </FormItem>
      <FormItem label="按钮状态">
        <RadioGroup v-model:value="formState.buttonStatus">
          <Radio
            v-for="item in statusOptions"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</Radio
          >
        </RadioGroup>
      </FormItem>
    </Form>
  </Modal>
</template>

<script setup>
import {
  message,
  Table,
  Divider,
  Dropdown,
  Menu,
  MenuItem,
  Button,
  Space,
  Modal,
  Form,
  FormItem,
  Input,
  RadioGroup,
  Radio,
  Select,
  SelectOption,
  InputNumber,
  Popconfirm,
} from "ant-design-vue";
import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { ref, onMounted, createVNode } from "vue";

import FullModal from "@core/libs/fullModal/FullModal.vue";
import {
  cgformButtonListApi,
  cgformButtonAddApi,
  cgformButtonEditApi,
  cgformButtonDeleteBatchApi,
} from "../api";

const columns = [
  {
    title: "按钮编码",
    dataIndex: "buttonCode",
  },
  {
    title: "按钮名称",
    dataIndex: "buttonName",
  },
  {
    title: "按钮样式",
    dataIndex: "buttonStyle",
  },
  {
    title: "按钮类型",
    dataIndex: "optType",
  },
  {
    title: "排序",
    dataIndex: "orderNum",
  },
  {
    title: "按钮图标",
    dataIndex: "buttonIcon",
  },
  {
    title: "表达式",
    dataIndex: "exp",
  },
  {
    title: "按钮状态",
    dataIndex: "buttonStatus",
  },
  {
    title: "操作",
    dataIndex: "action",
  },
];

const rules = {
  buttonCode: [
    {
      required: true,
      message: "请输入按钮编码",
      trigger: "change",
    },
  ],
  buttonName: [
    {
      required: true,
      message: "请输入按钮名称",
      trigger: "change",
    },
  ],
};

const statusOptions = [
  {
    label: "激活",
    value: "1",
  },
  {
    label: "未激活",
    value: "0",
  },
];

const [messageApi, contextHolder] = message.useMessage();
const emit = defineEmits(["setOpen"]);
const { open, headInfo } = defineProps(["open", "headInfo"]);
const selectedKeys = ref([]);
const dataSource = ref([]);
const rowSelection = {
  onChange: (selectedRowKeys) => {
    selectedKeys.value = selectedRowKeys;
  },
};
const openEdit = ref(false);
const formState = ref({});
const formRef = ref(null);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: ["10", "20", "50"],
  showSizeChanger: true,
});

const labelCol = {
  style: {
    width: "150px",
  },
};
const wrapperCol = {
  span: 14,
};

onMounted(() => {
  cgformButtonList();
});

const cgformButtonList = () => {
  const params = {
    column: "orderNum",
    order: "asc",
    pageNo: pagination.value.current,
    pageSize: pagination.value.pageSize,
  };
  cgformButtonListApi(headInfo.id, params).then((res) => {
    if (res.success) {
      dataSource.value = res.result.records;
      pagination.value.current = res.result.current;
      pagination.value.pageSize = res.result.size;
      pagination.value.total = res.result.total;
    } else {
      messageApi.error(res.message);
    }
  });
};

const addHandler = () => {
  openEdit.value = true;
  formState.value = {};
};

const handleOkEdit = () => {
  formRef.value
    .validate()
    .then(() => {
      formState.id ? cgformButtonEdit() : cgformButtonAdd();
    })
    .catch((error) => {
      console.log("error", error);
    });
};

const cgformButtonAdd = () => {
  const params = {
    ...formState.value,
    cgformHeadId: headInfo.id,
  };
  cgformButtonAddApi(params).then((res) => {
    if (res.success) {
      openEdit.value = false;
      messageApi.success(res.message);
      cgformButtonList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const handleEdit = (record) => {
  formState.value = {
    ...record,
  };
  openEdit.value = true;
};

const cgformButtonEdit = () => {
  const params = {
    ...formState.value,
    cgformHeadId: headInfo.id,
  };
  cgformButtonEditApi(params).then((res) => {
    if (res.success) {
      openEdit.value = false;
      messageApi.success(res.message);
      cgformButtonList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const cgformButtonDeleteBatch = (ids) => {
  const params = {
    ids,
  };
  cgformButtonDeleteBatchApi(params).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      selectedKeys.value = [];
      cgformButtonList();
    } else {
      messageApi.error(res.message);
    }
  });
};

const batchDelHandler = () => {
  Modal.confirm({
    title: "确认删除吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "",
    okText: "确定",
    cancelText: "取消",
    onOk() {
      cgformButtonDeleteBatch(selectedKeys.value.join(","));
    },
  });
};

const tableChangeHandler = (_pagination) => {
  const { current, pageSize, total } = _pagination;
  pagination.value.current = current;
  pagination.value.pageSize = pageSize;
  pagination.value.total = total;
  cgformButtonList();
};
</script>
