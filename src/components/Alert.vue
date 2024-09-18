<script setup>
const props = defineProps({
  alert: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div
    v-if="props.alert.status !== '' && props.alert.message !== ''"
    :class="[
      props.alert.status === 'success'
        ? 'text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400'
        : 'text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400'
    ]"
    class="p-4 mb-4 text-sm text-green-800 rounded-lg"
    role="alert"
  >
    <span class="font-medium" v-html="props.alert.message"></span>
  </div>
</template>

<style scoped></style>
