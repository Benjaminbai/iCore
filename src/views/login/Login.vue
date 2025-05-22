<template>
  <context-holder />
  <div class="login-wrapper">
    <Row class="login-container">
      <Col :span="14" class="login-form">
        <div style="width: 60%">
          <h2>Login to Space</h2>
          <Form ref="formRef" :model="formState" name="basic" :rules="rules">
            <FormItem name="username">
              <Input
                v-model:value="formState.username"
                :bordered="false"
                class="login-input"
                size="large"
              />
            </FormItem>

            <FormItem name="password">
              <InputPassword
                v-model:value="formState.password"
                :bordered="false"
                class="login-input"
                size="large"
              />
            </FormItem>
            <FormItem name="captcha">
              <Row :gutter="20">
                <Col :span="14">
                  <Input
                    v-model:value="formState.captcha"
                    :bordered="false"
                    class="login-input"
                    size="large"
                  />
                </Col>
                <Col :span="10">
                  <img
                    class="check-code"
                    :src="randCodeData.randCodeImage"
                    @click="handleChangeCheckCode"
                  />
                </Col>
              </Row>
              <Space> </Space>
            </FormItem>

            <FormItem name="remember">
              <Flex justify="space-between" align="center">
                <Checkbox v-model:checked="formState.remember"
                  >Remember me</Checkbox
                >
                <Button type="link" style="padding-right: 0"
                  >Forgot password?</Button
                >
              </Flex>
            </FormItem>

            <FormItem :wrapper-col="{ offset: 0, span: 12 }">
              <Button
                type="primary"
                html-type="submit"
                block
                shape="round"
                @click="onSubmit"
                :loading="loading"
                >Submit</Button
              >
            </FormItem>
          </Form>
        </div>
      </Col>
      <Col
        :span="10"
        class="login-image"
        :style="{
          background: `url(${LoginBg}) no-repeat`,
          backgroundSize: 'cover',
        }"
      ></Col>
    </Row>
  </div>
</template>

<script setup>
import {
  Row,
  Col,
  Form,
  FormItem,
  Input,
  InputPassword,
  Button,
  Checkbox,
  Flex,
  Space,
  message,
} from "ant-design-vue";
import { reactive, onMounted, toRaw, ref } from "vue";
import { useRouter } from "vue-router";

import LoginBg from "@/static/login-bg.jpeg";
import { getInputCodeApi, loginApi } from "@core/axios/User";
import { getUserPermissionByToken } from "@core/router/dynamic";

const [messageApi, contextHolder] = message.useMessage();

const rules = {
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "change",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "change",
    },
  ],
  captcha: [
    {
      required: true,
      message: "请输入验证码",
      trigger: "change",
    },
  ],
};

const router = useRouter();

const formRef = ref();
const loading = ref(false);
const formState = reactive({
  username: "",
  password: "",
  remember: true,
  captcha: "",
});
const randCodeData = reactive({
  randCodeImage: "",
  requestCodeSuccess: false,
  checkKey: null,
});

onMounted(() => {
  handleChangeCheckCode();
});

const handleChangeCheckCode = () => {
  formState.captcha = "";
  randCodeData.checkKey = 1629428467008;
  getInputCodeApi(randCodeData.checkKey).then((res) => {
    randCodeData.randCodeImage = res.result;
    randCodeData.requestCodeSuccess = true;
  });
};

const onSubmit = () => {
  formRef.value
    .validate()
    .then(async () => {
      loading.value = true;
      const res = await loginApi({
        ...toRaw(formState),
        checkKey: randCodeData.checkKey,
      });
      if (res.code === 200) {
        localStorage.setItem("LOCALINFO", JSON.stringify(res.result));
        await getUserPermissionByToken();
        router.push("/home");
      } else {
        messageApi.error(res.message);
      }
    })
    .catch((error) => {
      console.log("error", error);
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style scoped>
.login-wrapper {
  height: 100vh;
  background-color: #e0e5ec;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-container {
    width: 65%;
    height: 600px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    h2 {
      margin-bottom: 50px;
    }

    .login-form {
      display: flex;
      justify-content: center;
      align-items: center;

      .login-input {
        background-color: #f7f8fb;
      }
    }

    .login-image {
      background-color: #eee;
    }
  }
}
</style>
