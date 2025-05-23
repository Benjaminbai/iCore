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
        :model="cgreportContext.head"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <Row>
          <Col :span="8">
            <FormItem
              label="报表编码"
              name="code"
              :rules="[{ required: true, message: '请输入报表编码' }]"
              :validateStatus="tableNameValidate.status"
              :help="tableNameValidate.message"
            >
              <Input
                v-model:value="cgreportContext.head.code"
                placeholder="请输入报表编码"
                @blur="sysDuplicateCheck"
              ></Input>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem
              label="报表名称"
              name="name"
              :rules="[{ required: true, message: '请输入报表名称' }]"
            >
              <Input
                v-model:value="cgreportContext.head.name"
                placeholder="请输入报表名称"
              ></Input>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="动态数据源">
              <Select
                v-model:value="cgreportContext.head.dbSource"
                placeholder="请输入动态数据源"
              >
                <SelectOption value="local_mysql">本地测试库</SelectOption>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="24">
          <Col :span="16">
            <FormItem
              label="报表SQL"
              name="cgrSql"
              :rules="[{ required: true, message: '请输入报表SQL' }]"
              :labelCol="{ style: { width: '12.7%' } }"
              :wrapperCol="{ style: { width: '100%' } }"
            >
              <codemirror
                v-model="cgreportContext.head.cgrSql"
                placeholder="Code goes here..."
                style="
                  height: 378px;
                  border: 1px solid #f0f0f0;
                  border-radius: 8px;
                "
                :autofocus="true"
                :indent-with-tab="true"
                :tab-size="2"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <Card>
              <Space direction="vertical">
                <Button type="primary" id="SQL-btn" @click="sqlHandler"
                  >SQL解析</Button
                >
                <div style="font-weight: 500; margin: 10px 0">使用指南</div>
                <div>您可以键入“”作为一个参数，这里abc是参数的名称。例如：</div>
                <div>select * from table where id = ${abc}。</div>
                <div>
                  select * from table where id like
                  concat('%',${abc},'%')。(mysql模糊查询)
                </div>
                <div>
                  select * from table where id like
                  '%'||${abc}||'%'。(oracle模糊查询)
                </div>
                <div>
                  select * from table where id like
                  '%'+${abc}+'%'。(sqlserver模糊查询)
                </div>
                <div style="color: red">
                  注：参数只支持动态报表，popup暂不支持
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>
      <Tabs v-model:activeKey="activeKey">
        <TabPane key="1" tab="动态报表配置明细">
          <ReportConfig />
        </TabPane>
        <TabPane key="2" tab="报表参数">
          <ReportParams />
        </TabPane>
      </Tabs>
    </Spin>
  </FullModal>
</template>

<script setup>
import { reactive, ref, provide, watch } from "vue";
import {
  Form,
  FormItem,
  Input,
  Row,
  Col,
  TabPane,
  Tabs,
  Spin,
  Select,
  SelectOption,
  message,
  Button,
  Card,
  Space,
} from "ant-design-vue";
import { Codemirror } from "vue-codemirror";

import { FullModal } from "../../../libs";
import ReportConfig from "./ReportConfig.vue";
import ReportParams from "./ReportParams.vue";
import {
  cgreportParamListByHeadIdApi,
  cgreportItemListByHeadIdApi,
  sysDuplicateCheckApi,
  cgreportHeadParseSqlApi,
  cgreportHeadAddApi,
  cgreportHeadEditAllApi,
} from "../api";

const { open, headInfo } = defineProps(["open", "headInfo"]);
const emit = defineEmits(["setOpen"]);
const [messageApi, contextHolder] = message.useMessage();

const activeKey = ref("1");
const loading = ref(false);
const formRef = ref(null);

const cgreportContext = ref({
  head: headInfo,
  items: [],
  params: [],
});
provide("cgreportContext", cgreportContext);

const tableNameValidate = reactive({
  status: "",
  message: "",
});

const sysDuplicateCheck = async () => {
  if (!cgreportContext.value.head.code) return;
  const res = await sysDuplicateCheckApi({
    tableName: "onl_cgreport_head",
    fieldName: "code",
    fieldVal: cgreportContext.value.head.code,
  });
  if (!res.success) {
    tableNameValidate.status = "error";
    tableNameValidate.message = "编码已存在";
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
      loading.value = true;
      headInfo.id ? cgreportHeadEditAll(params) : cgreportHeadAdd(params);
    })
    .catch((error) => {
      console.log(error);
      loading.value = false;
      const code = error.errorFields.filter((v) => v.name[0] === "code");
      if (code.length > 0) {
        tableNameValidate.status = "error";
        tableNameValidate.message = code[0].errors[0];
      }
    });
};

const inTransHandler = (arr) => {
  arr.forEach((item) => {
    item.isShow = item.isShow ? true : false;
    item.isSearch = item.isSearch ? true : false;
    item.isTotal = item.isTotal ? true : false;
    item.fake_id = item.id ? item.id : new Date().getTime();
  });
};

const deTransHandler = () => {
  const arr = JSON.parse(JSON.stringify(cgreportContext.value.items));
  arr.forEach((item) => {
    item.isShow = item.isShow ? 1 : 0;
    item.isSearch = item.isSearch ? 1 : 0;
    item.isTotal = item.isTotal ? 1 : 0;
  });
  const params = {
    ...cgreportContext.value,
    items: arr,
  };
  return params;
};

const cgreportParamListByHeadId = (headId) => {
  cgreportParamListByHeadIdApi({ headId }).then((res) => {
    if (res.success) {
      cgreportContext.value.params = res.result;
    } else {
      messageApi.error(res.message);
    }
  });
};

const cgreportItemListByHeadId = (headId) => {
  cgreportItemListByHeadIdApi({ headId }).then((res) => {
    if (res.success) {
      inTransHandler(res.result);
      cgreportContext.value.items = res.result;
    } else {
      messageApi.error(res.message);
    }
  });
};

const sqlHandler = () => {
  formRef.value
    .validate("cgrSql")
    .then(() => {
      cgreportHeadParseSql();
    })
    .catch((error) => {
      console.log(error);
    });
};

const cgreportHeadParseSql = () => {
  cgreportHeadParseSqlApi({
    sql: cgreportContext.value.head.cgrSql,
  }).then((res) => {
    if (res.success) {
      messageApi.success(res.message);
      inTransHandler(res.result.fields);
      cgreportContext.value.items = res.result.fields;
      cgreportContext.value.params = res.result.params;
    } else {
      messageApi.error(res.message);
    }
  });
};

const cgreportHeadAdd = (data) => {
  cgreportHeadAddApi(data)
    .then((res) => {
      if (res.success) {
        messageApi.success(res.message);
        emit("setOpen", false);
      } else {
        messageApi.error(res.message);
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const cgreportHeadEditAll = (data) => {
  cgreportHeadEditAllApi(data)
    .then((res) => {
      if (res.success) {
        messageApi.success(res.message);
        emit("setOpen", false);
      } else {
        messageApi.error(res.message);
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

watch(
  () => headInfo,
  (val) => {
    if (val.id) {
      cgreportContext.value.head = val;
      cgreportItemListByHeadId(val.id);
      cgreportParamListByHeadId(val.id);
    } else {
      cgreportContext.value = {
        head: {},
        items: [],
        params: [],
      };
    }
  }
);
</script>

<style scoped></style>
