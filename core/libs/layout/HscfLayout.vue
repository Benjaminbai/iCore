<template>
  <Layout class="layout-wrapper">
    <LayoutSider class="layout-sider" v-model:collapsed="collapsed" collapsible>
      <Logo />
      <Menu />
    </LayoutSider>
    <Layout>
      <LayoutHeader class="layout-header">
        <UserInfo />
      </LayoutHeader>
      <Layout style="padding: 0 24px">
        <LayoutContent class="layout-content">
          <RouterView />
        </LayoutContent>
        <LayoutFooter class="layout-footer"></LayoutFooter>
      </Layout>
    </Layout>
  </Layout>
</template>
<script setup>
import {
  Layout,
  LayoutHeader,
  LayoutSider,
  LayoutContent,
  LayoutFooter,
} from "ant-design-vue";
import { ref } from "vue";
import { RouterView } from "vue-router";
import { Logo, Menu, UserInfo } from "../../libs";

const collapsed = ref(false);
</script>
<style scoped>
.layout-wrapper {
  height: 100%;

  .ant-layout-header {
    line-height: unset;
    overflow-y: auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .layout-sider {
    width: 200px;
  }

  .layout-content {
    padding: 0 50px;
    height: 100%;
    padding-top: 10px;
    overflow: auto;

    .layout-bread {
      height: 40px;
      margin-bottom: 20px;
    }
  }

  .layout-footer {
    height: 100px;
  }

  :deep(.ant-layout-sider-trigger) {
    position: relative;
  }
}
</style>
