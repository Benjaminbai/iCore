<template>
  <contextHolder />
  <FullModal
    title="编辑"
    :open="open"
    destroyOnClose
    @cancel="emit('setOpen')"
    @ok="onSubmit"
    okText="保存"
    cancelText="取消"
  >
    <Spin :spinning="loading">
      <Form
        ref="formRef"
        :model="requestParams.head"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <Row>
          <Col :span="8">
            <FormItem
              label="表名"
              :rules="[
                { required: true, message: '请输入表名', trigger: 'submit' },
              ]"
              :validateStatus="tableNameValidate.status"
              :help="tableNameValidate.message"
              name="tableName"
            >
              <Input
                v-model:value="requestParams.head.tableName"
                placeholder="请输入表名"
                @blur="sysDuplicateCheck"
              ></Input>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem
              label="表描述"
              :rules="[{ required: true, message: '请输入表描述' }]"
              name="tableTxt"
            >
              <Input
                v-model:value="requestParams.head.tableTxt"
                placeholder="请输入表描述"
              ></Input>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="表类型">
              <Select
                v-model:value="requestParams.head.tableType"
                placeholder="请选择表类型"
              >
                <SelectOption :value="1">单表</SelectOption>
                <SelectOption :value="2">主表</SelectOption>
                <SelectOption :value="3">附表</SelectOption>
              </Select>
              <Row
                v-if="requestParams.head.tableType === 3"
                justify="space-between"
                align="middle"
                style="margin-top: 20px"
              >
                <Col :span="16">
                  <RadioGroup v-model:value="requestParams.head.relationType">
                    <Radio :value="0">一对多</Radio>
                    <Radio :value="1">一对一</Radio>
                  </RadioGroup>
                </Col>
                <Col :span="8">
                  <InputNumber v-model:value="requestParams.head.tabOrderNum">
                    <template #addonBefore> 序号 </template>
                  </InputNumber>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="表单分类">
              <Select
                v-model:value="requestParams.head.formCategory"
                placeholder="请选择表单分类"
              >
                <SelectOption value="demo">官方示例</SelectOption>
                <SelectOption value="bpm">流程表单</SelectOption>
                <SelectOption value="temp">测试表单</SelectOption>
                <SelectOption value="bdfl_include">导入表单</SelectOption>
              </Select>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="主键策略">
              <Select
                v-model:value="requestParams.head.idType"
                placeholder="请选择主键策略"
              >
                <SelectOption value="UUID">ID_WORKER(分布式自增)</SelectOption>
              </Select>
            </FormItem>
          </Col>
          <Col :span="8" v-if="requestParams.head.tableType === 1">
            <FormItem label="是否树">
              <Select
                v-model:value="requestParams.head.isTree"
                placeholder="请选择是否树"
              >
                <SelectOption value="Y">是</SelectOption>
                <SelectOption value="N">否</SelectOption>
              </Select>
            </FormItem>
          </Col>
          <Col :span="8" v-if="requestParams.head.isTree === 'Y'">
            <FormItem label="树表单ID">
              <Input
                v-model:value="requestParams.head.treeParentIdField"
                placeholder="请输入树表单ID"
              ></Input>
            </FormItem>
          </Col>
          <Col :span="8" v-if="requestParams.head.isTree === 'Y'">
            <FormItem
              label="树开表单列"
              :rules="[{ required: true, message: '请输入树开表单列' }]"
            >
              <Input
                v-model:value="requestParams.head.treeFiledname"
                placeholder="请输入树开表单列"
              ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Tabs v-model:activeKey="activeKey">
        <TabPane key="1" tab="数据库属性">
          <DbProperties ref="dbPropertiesRef" />
        </TabPane>
        <TabPane key="2" tab="页面属性">
          <PageProperties />
        </TabPane>
        <TabPane key="3" tab="校验字段">
          <ValidField />
        </TabPane>
        <TabPane key="4" tab="外键">
          <ForeignKeys />
        </TabPane>
        <TabPane key="5" tab="索引">
          <DbIndex />
        </TabPane>
      </Tabs>
    </Spin>
  </FullModal>
</template>

<script setup>
import { reactive, ref, provide, onMounted } from "vue";
import {
  Form,
  FormItem,
  Input,
  Row,
  Col,
  TabPane,
  Tabs,
  Select,
  SelectOption,
  RadioGroup,
  Radio,
  InputNumber,
  message,
  Spin,
} from "ant-design-vue";

import DbProperties from "./DbProperties.vue";
import PageProperties from "./PageProperties.vue";
import ValidField from "./ValidField.vue";
import ForeignKeys from "./ForeignKeys.vue";
import DbIndex from "./DbIndex.vue";
import {
  sysDuplicateCheckApi,
  cgformFieldListByHeadIdApi,
  cgformIndexListByHeadIdApi,
  cgformEditAllApi,
  cgformAddAllApi,
} from "../api";
import FullModal from "@core/libs/fullModal/FullModal.vue";

const [messageApi, contextHolder] = message.useMessage();
const { open, headInfo } = defineProps(["open", "headInfo"]);
const emit = defineEmits(["setOpen"]);
const tableNameValidate = reactive({
  status: "",
  message: "",
});
const loading = ref(false);

const head = {
  tableName: "",
  tableTxt: "",
  tableType: 1,
  formCategory: "temp",
  idType: "UUID",
  isTree: "N",
  treeParentIdField: "",
  treeFiledname: "",
  relationType: 0,
};

const fields = [
  {
    dbFieldName: "id",
    dbFieldTxt: "主键",
    dbLength: 36,
    dbPointLength: 0,
    fieldDefaultValue: "",
    dbType: "String",
    dbIsKey: 1,
    dbIsNull: 0,
    dbIsPersist: 1,
    id: 1,
  },
  {
    dbFieldName: "create_by",
    dbFieldTxt: "创建人",
    dbLength: 50,
    dbPointLength: 0,
    fieldDefaultValue: "",
    dbType: "String",
    dbIsKey: 0,
    dbIsNull: 1,
    dbIsPersist: 1,
    id: 2,
  },
  {
    dbFieldName: "create_time",
    dbFieldTxt: "创建日期",
    dbLength: 0,
    dbPointLength: 0,
    fieldDefaultValue: "",
    dbType: "Datetime",
    dbIsKey: 0,
    dbIsNull: 1,
    dbIsPersist: 1,
    id: 3,
  },
  {
    dbFieldName: "update_by",
    dbFieldTxt: "更新人",
    dbLength: 50,
    dbPointLength: 0,
    fieldDefaultValue: "",
    dbType: "String",
    dbIsKey: 0,
    dbIsNull: 1,
    dbIsPersist: 1,
    id: 4,
  },
  {
    dbFieldName: "update_time",
    dbFieldTxt: "更新日期",
    dbLength: 0,
    dbPointLength: 0,
    fieldDefaultValue: "",
    dbType: "Datetime",
    dbIsKey: 0,
    dbIsNull: 1,
    dbIsPersist: 1,
    id: 5,
  },
];

const requestParams = ref({
  deleteFieldIds: [],
  deleteIndexIds: [],
  fields,
  head: JSON.parse(JSON.stringify(head)),
  indexs: [],
});

const activeKey = ref("1");
const formRef = ref(null);

provide("requestParams", requestParams);

const inTransHandler = (arr) => {
  arr.forEach((item) => {
    item.fake_id = item.id ? item.id : new Date().getTime();
    // 数据库属性tab
    item.dbIsKey = item.dbIsKey ? true : false;
    item.dbIsNull = item.dbIsNull ? true : false;
    item.dbIsPersist = item.dbIsPersist ? true : false;
    // 页面属性tab
    item.isShowForm = item.isShowForm ? true : false;
    item.isShowList = item.isShowList ? true : false;
    item.sortFlag = item.sortFlag ? true : false;
    item.isReadOnly = item.isReadOnly ? true : false;
    item.isQuery = item.isQuery ? true : false;
    // 校验字段
    item.fieldMustInput = item.fieldMustInput ? true : false;
    // 索引tab
    item.indexField = item.indexField ? item.indexField.split(",") : [];
  });
};
inTransHandler(requestParams.value.fields);

const deTransHandler = () => {
  const arr = JSON.parse(JSON.stringify(requestParams.value.fields));
  const arr2 = JSON.parse(JSON.stringify(requestParams.value.indexs));
  arr.forEach((item) => {
    // 数据库属性tab
    item.dbIsKey = item.dbIsKey ? 1 : 0;
    item.dbIsNull = item.dbIsNull ? 1 : 0;
    item.dbIsPersist = item.dbIsPersist ? 1 : 0;
    // 页面属性tab
    item.isShowForm = item.isShowForm ? 1 : 0;
    item.isShowList = item.isShowList ? 1 : 0;
    item.sortFlag = item.sortFlag ? 1 : 0;
    item.isReadOnly = item.isReadOnly ? 1 : 0;
    item.isQuery = item.isQuery ? 1 : 0;
    // 校验字段
    item.fieldMustInput = item.fieldMustInput ? 1 : 0;
    // 索引tab
    item.indexField = item.indexField ? item.indexField.join(",") : "";
  });
  arr2.forEach((item) => {
    item.indexField = item.indexField ? item.indexField.join(",") : "";
  });

  const params = {
    ...requestParams.value,
    fields: arr,
    indexs: arr2,
  };
  return params;
};

const sysDuplicateCheck = async () => {
  if (!requestParams.value.head.tableName) return;
  const res = await sysDuplicateCheckApi({
    tableName: "onl_cgform_head",
    fieldName: "table_name",
    fieldVal: requestParams.value.head.tableName,
  });
  if (!res.success) {
    tableNameValidate.status = "error";
    tableNameValidate.message = "表名已存在";
  } else {
    tableNameValidate.status = "";
    tableNameValidate.message = "";
  }
};

const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      const params = deTransHandler();
      headInfo.id ? cgformEditAll(params) : cgformAddAll(params);
    })
    .catch((error) => {
      loading.value = false;
      const table_name = error.errorFields.filter(
        (v) => v.name[0] === "tableName"
      );
      if (table_name.length > 0) {
        tableNameValidate.status = "error";
        tableNameValidate.message = table_name[0].errors[0];
      }
    });
};

const cgformFieldListByHeadId = (headId) => {
  cgformFieldListByHeadIdApi({ headId }).then((res) => {
    if (res.success) {
      inTransHandler(res.result);
      requestParams.value.fields = res.result;
    } else {
      messageApi.error(res.message);
    }
  });
};

const cgformIndexListByHeadId = (headId) => {
  cgformIndexListByHeadIdApi({ headId }).then((res) => {
    if (res.success) {
      inTransHandler(res.result);
      requestParams.value.indexs = res.result;
    } else {
      messageApi.error(res.message);
    }
  });
};

const cgformEditAll = (params) => {
  loading.value = true;
  cgformEditAllApi(params).then((res) => {
    loading.value = false;
    if (res.success) {
      messageApi.success(res.message);
      emit("setOpen", false);
    } else {
      messageApi.error(res.message);
    }
  });
};

const cgformAddAll = (params) => {
  loading.value = true;
  cgformAddAllApi(params).then((res) => {
    loading.value = false;
    if (res.success) {
      messageApi.success(res.message);
      emit("setOpen", false);
    } else {
      messageApi.error(res.message);
    }
  });
};

onMounted(() => {
  requestParams.value = {
    deleteFieldIds: [],
    deleteIndexIds: [],
    fields,
    head: JSON.parse(JSON.stringify(head)),
    indexs: [],
  };
  if (headInfo.id) {
    requestParams.value.head = headInfo;
    cgformFieldListByHeadId(headInfo.id);
    cgformIndexListByHeadId(headInfo.id);
  }
});
</script>

<style scoped></style>
