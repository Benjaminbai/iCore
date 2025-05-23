<template>
  <RouterView v-if="route.path === '/login'" />
  <HscfLayout v-else />
</template>

<script setup>
import { RouterView, useRoute } from "vue-router";
import { HscfLayout } from "@core/index";

const route = useRoute();
</script>
