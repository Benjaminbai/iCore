<template>
  <Tinymce :init="editorInitData" v-model="contentValue" :disabled="disabled" />
</template>

<script setup>
import Tinymce from "@tinymce/tinymce-vue";
import "tinymce/tinymce";
import "tinymce/themes/silver";
import "tinymce/icons/default/icons";
import "tinymce/models/dom";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/preview";
import "tinymce/plugins/image";

import { computed } from "vue";

const toolbar =
  "undo redo styles  bold italic alignleft aligncenter alignright alignjustify bullist numlist outdent indent lists image link fullscreen";
const plugins = ["fullscreen", "link", "lists", "preview", "image"];

const editorInitData = {
  promotion: false, // 这个要加上，不然富文本会出现更新按钮的
  branding: false, // 去掉编辑器右下角的广告
  height: 400,
  width: "100%",
  language: "zh_CN", // 汉化
  base_url: "./tinymce", //根路径
  language_url: "/tinymce/langs/zh_CN.js",
  skin: "oxide",
  skin_url: "/tinymce/skins/ui/oxide",
  plugins: plugins, // 插件配置
  toolbar: toolbar, // 工具栏
  menubar: false,
  statusbar: false, //下方行选择器
  images_upload_handler: async (blobInfo) => {
    const resp = await uploadExpFile({
      files: [blobInfo.blob()],
    });
    return resp.data;
  },
};

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["update:modelValue"]);
const contentValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emits("update:modelValue", val);
  },
});
</script>
