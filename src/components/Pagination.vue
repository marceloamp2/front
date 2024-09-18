<script setup>
const props = defineProps({
  registers: {
    required: true,
    type: Object
  }
})

const emit = defineEmits(['goToPage'])
const goToPage = (page) => {
  emit('goToPage', page)
}
</script>
<template>
  <nav
    v-if="props.registers.per_page < props.registers.total"
    aria-label="Table navigation"
    class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
  >
    <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
      Página
      <span class="text-gray-900 dark:text-white">{{ props.registers.current_page }}</span>
      de
      <span class="text-gray-900 dark:text-white">{{ props.registers.last_page }}</span>
    </span>
    <ul class="inline-flex items-stretch -space-x-px">
      <li>
        <a
          class="cursor-pointer flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          @click="goToPage(1)"
        >
          <span class="sr-only">Previous</span>
          <svg
            class="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path
              d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L301.3 256 438.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"
            />
          </svg>
        </a>
      </li>
      <li
        v-if="
          props.registers.current_page === props.registers.last_page &&
          props.registers.per_page * 2 < props.registers.total
        "
      >
        <a
          class="cursor-pointer flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          @click="goToPage(props.registers.current_page - 2)"
          >{{ props.registers.current_page - 2 }}</a
        >
      </li>
      <li v-if="props.registers.current_page > 1">
        <a
          class="cursor-pointer flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          @click="goToPage(props.registers.current_page - 1)"
          >{{ props.registers.current_page - 1 }}</a
        >
      </li>
      <li>
        <a
          class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >{{ props.registers.current_page }}</a
        >
      </li>
      <li v-if="props.registers.current_page !== props.registers.last_page">
        <a
          class="cursor-pointer flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          @click="goToPage(props.registers.current_page + 1)"
          >{{ props.registers.current_page + 1 }}</a
        >
      </li>
      <li
        v-if="
          props.registers.current_page === 1 && props.registers.per_page * 2 < props.registers.total
        "
      >
        <a
          class="cursor-pointer flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          @click="goToPage(props.registers.current_page + 2)"
          >{{ props.registers.current_page + 2 }}</a
        >
      </li>
      <li>
        <a
          class="cursor-pointer flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          @click="goToPage(props.registers.last_page)"
        >
          <span class="sr-only">Next</span>
          <svg
            class="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path
              d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"
            />
          </svg>
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>
