<template>
  <div class="menu-wrapper">
    <Menu
      v-model:openKeys="state.openKeys"
      v-model:selectedKeys="state.selectedKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="state.collapsed"
      :items="menus"
      @select="menuSelect"
    ></Menu>
  </div>
</template>

<script setup>
import { Menu } from "ant-design-vue";
import { reactive, watch, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const state = reactive({
  selectedKeys: [],
  openKeys: [],
});

const recursionMenu = (_menus) => {
  _menus.forEach((menu) => {
    if (menu.children) {
      recursionMenu(menu.children);
    }
    menu.key = menu.path;
    menu.icon = "";
    menu.label = menu.meta.title;
    menu.title = menu.meta.title;
    delete menu.component;
  });
};

const rawMenus = JSON.parse(localStorage.getItem("MENUS") || "[]");
recursionMenu(rawMenus);
const menus = ref(rawMenus);

const menuSelect = ({ item, key }) => {
  router.push({ path: key });
};

watch(
  () => router.currentRoute.value,
  (newVal) => {
    state.selectedKeys = [newVal.path];
    state.openKeys = [newVal.matched[0]?.path];
  },
  {
    immediate: true,
  }
);
</script>

<style scoped>
.menu-wrapper {
  padding: 10px;
}
</style>
