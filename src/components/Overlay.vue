<script setup>
const props = defineProps({
  showOverlay: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div
    v-if="props.showOverlay"
    id="overlay"
    class="bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40"
  ></div>
</template>

<style scoped></style>
