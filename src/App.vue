<template>
  <RouterView v-if="route.path === '/login'" />
  <HscfLayout v-else />
</template>

<script setup>
import { RouterView, useRoute } from "vue-router";
import HscfLayout from "@core/libs/layout/HscfLayout.vue";

const route = useRoute();
</script>
