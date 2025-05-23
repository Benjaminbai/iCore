<template>
  <Modal
    width="100%"
    wrap-class-name="full-modal"
    v-bind="props"
    :class="{ nopadding: props.nopadding }"
  >
    <template v-for="slot in Object.keys(slots)" #[slot]="scope">
      <slot :name="slot" v-bind="scope || {}"></slot>
    </template>
  </Modal>
</template>
<script setup>
import { useSlots } from "vue";
import { Modal } from "ant-design-vue";
const slots = useSlots();
const props = defineProps(["nopadding"]);
</script>
<style>
.full-modal {
  .ant-modal {
    max-width: 100% !important;
    top: 0 !important;
    padding-bottom: 0 !important;
    margin: 0 !important;
    .ant-modal-content {
      display: flex;
      flex-direction: column;
      height: calc(100vh);
    }
    .ant-modal-body {
      flex: 1;
      padding: 10px;
      overflow: auto;
    }
    &.nopadding {
      .ant-modal-content {
        padding: 0;
      }
      .ant-modal-body {
        padding: 0;
      }
    }
  }
}
</style>
