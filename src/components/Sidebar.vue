<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Overlay from '@/components/Overlay.vue'
import { useSidebarStore } from '@/stores/sidebar.js'

const route = useRoute()
const openRegisters = ref(false)
const currentRouteName = ref('')
const sidebarStore = useSidebarStore()

onMounted(() => {
  setMenu()
})

watch(route, async (newRoute) => {
  currentRouteName.value = newRoute.name

  openRegisters.value =
    currentRouteName.value === 'users' ||
    currentRouteName.value === 'roles' ||
    currentRouteName.value === 'suppliers' ||
    currentRouteName.value === 'expenses' ||
    currentRouteName.value === 'inputs' ||
    currentRouteName.value === 'services' ||
    currentRouteName.value === 'customers'
})

const setMenu = () => {
  currentRouteName.value = route.name

  openRegisters.value =
    currentRouteName.value === 'users' ||
    currentRouteName.value === 'roles' ||
    currentRouteName.value === 'suppliers' ||
    currentRouteName.value === 'expenses' ||
    currentRouteName.value === 'inputs' ||
    currentRouteName.value === 'services' ||
    currentRouteName.value === 'customers'
}
</script>

<template>
  <Overlay :show-overlay="sidebarStore.showSidebar" />

  <aside
    :class="[sidebarStore.showSidebar ? '' : '-translate-x-full']"
    class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <ul class="space-y-2 text-sm font-medium">
        <li>
          <RouterLink
            :class="[
              currentRouteName === 'dashboard'
                ? 'text-sky-700 hover:text-sky-800'
                : 'text-gray-700 hover:text-gray-800'
            ]"
            class="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            to="/admin/dashboard"
            @click="sidebarStore.showSidebar = false"
          >
            <svg
              :class="[
                currentRouteName === 'dashboard'
                  ? 'text-sky-700 group-hover:text-sky-800'
                  : 'text-gray-700 group-hover:text-gray-800'
              ]"
              class="flex-shrink-0 w-4 h-4 transition duration-75 dark:text-gray-400 dark:group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm320 96c0-26.9-16.5-49.9-40-59.3V88c0-13.3-10.7-24-24-24s-24 10.7-24 24V292.7c-23.5 9.5-40 32.5-40 59.3c0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
              />
            </svg>
            <span class="ms-3">Dashboard</span>
          </RouterLink>
        </li>
        <li>
          <button
            :class="[
              currentRouteName === 'users' ||
              currentRouteName === 'roles' ||
              currentRouteName === 'suppliers' ||
              currentRouteName === 'expenses' ||
              currentRouteName === 'inputs' ||
              currentRouteName === 'services' ||
              currentRouteName === 'customers'
                ? 'text-sky-700 hover:text-sky-800'
                : 'text-gray-700 hover:text-gray-800'
            ]"
            class="flex items-center p-2 w-full rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            type="button"
            @click="openRegisters = !openRegisters"
          >
            <svg
              :class="[
                currentRouteName === 'users' ||
                currentRouteName === 'roles' ||
                currentRouteName === 'suppliers' ||
                currentRouteName === 'expenses' ||
                currentRouteName === 'inputs' ||
                currentRouteName === 'services' ||
                currentRouteName === 'customers'
                  ? 'text-sky-700 group-hover:text-sky-800'
                  : 'text-gray-700 group-hover:text-gray-800'
              ]"
              aria-hidden="true"
              class="flex-shrink-0 w-4 h-4 transition duration-75 dark:text-gray-400 dark:group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z"
              />
            </svg>
            <span class="ms-3">Cadastros</span>
            <svg
              :class="[
                currentRouteName === 'services'
                  ? 'text-sky-700 group-hover:text-sky-800'
                  : 'text-gray-700 group-hover:text-gray-800'
              ]"
              aria-hidden="true"
              class="flex-shrink-0 w-3 h-3 ml-4 transition duration-75 dark:text-gray-400 dark:group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
              />
            </svg>
          </button>
          <ul v-show="openRegisters" class="py-2 space-y-2">
            <li>
              <RouterLink
                :class="[
                  currentRouteName === 'users'
                    ? 'text-sky-700 hover:text-sky-800'
                    : 'text-gray-700 hover:text-gray-800'
                ]"
                class="flex items-center p-2 pl-11 w-full rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                to="/admin/users"
                @click="sidebarStore.showSidebar = false"
              >
                Usuários
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :class="[
                  currentRouteName === 'roles'
                    ? 'text-sky-700 hover:text-sky-800'
                    : 'text-gray-700 hover:text-gray-800'
                ]"
                class="flex items-center p-2 pl-11 w-full rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                to="/admin/roles"
                @click="sidebarStore.showSidebar = false"
              >
                Cargos
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :class="[
                  currentRouteName === 'suppliers'
                    ? 'text-sky-700 hover:text-sky-800'
                    : 'text-gray-700 hover:text-gray-800'
                ]"
                class="flex items-center p-2 pl-11 w-full rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                to="/admin/suppliers"
                @click="sidebarStore.showSidebar = false"
              >
                Fornecedores
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :class="[
                  currentRouteName === 'expenses'
                    ? 'text-sky-700 hover:text-sky-800'
                    : 'text-gray-700 hover:text-gray-800'
                ]"
                class="flex items-center p-2 pl-11 w-full rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                to="/admin/expenses"
                @click="sidebarStore.showSidebar = false"
              >
                Despesas
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :class="[
                  currentRouteName === 'inputs'
                    ? 'text-sky-700 hover:text-sky-800'
                    : 'text-gray-700 hover:text-gray-800'
                ]"
                class="flex items-center p-2 pl-11 w-full rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                to="/admin/inputs"
                @click="sidebarStore.showSidebar = false"
              >
                Insumos
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :class="[
                  currentRouteName === 'services'
                    ? 'text-sky-700 hover:text-sky-800'
                    : 'text-gray-700 hover:text-gray-800'
                ]"
                class="flex items-center p-2 pl-11 w-full rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                to="/admin/services"
                @click="sidebarStore.showSidebar = false"
              >
                Serviços
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :class="[
                  currentRouteName === 'customers'
                    ? 'text-sky-700 hover:text-sky-800'
                    : 'text-gray-700 hover:text-gray-800'
                ]"
                class="flex items-center p-2 pl-11 w-full rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                to="/admin/customers"
                @click="sidebarStore.showSidebar = false"
              >
                Clientes
              </RouterLink>
            </li>
          </ul>
        </li>
        <li>
          <RouterLink
            :class="[
              currentRouteName === 'stocks'
                ? 'text-sky-700 hover:text-sky-800'
                : 'text-gray-700 hover:text-gray-800'
            ]"
            class="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            to="/admin/stocks"
            @click="sidebarStore.showSidebar = false"
          >
            <svg
              :class="[
                currentRouteName === 'stocks'
                  ? 'text-sky-700 group-hover:text-sky-800'
                  : 'text-gray-700 group-hover:text-gray-800'
              ]"
              class="flex-shrink-0 w-4 h-4 transition duration-75 dark:text-gray-400 dark:group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 576 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M290.8 48.6l78.4 29.7L288 109.5 206.8 78.3l78.4-29.7c1.8-.7 3.8-.7 5.7 0zM136 92.5V204.7c-1.3 .4-2.6 .8-3.9 1.3l-96 36.4C14.4 250.6 0 271.5 0 294.7V413.9c0 22.2 13.1 42.3 33.5 51.3l96 42.2c14.4 6.3 30.7 6.3 45.1 0L288 457.5l113.5 49.9c14.4 6.3 30.7 6.3 45.1 0l96-42.2c20.3-8.9 33.5-29.1 33.5-51.3V294.7c0-23.3-14.4-44.1-36.1-52.4l-96-36.4c-1.3-.5-2.6-.9-3.9-1.3V92.5c0-23.3-14.4-44.1-36.1-52.4l-96-36.4c-12.8-4.8-26.9-4.8-39.7 0l-96 36.4C150.4 48.4 136 69.3 136 92.5zM392 210.6l-82.4 31.2V152.6L392 121v89.6zM154.8 250.9l78.4 29.7L152 311.7 70.8 280.6l78.4-29.7c1.8-.7 3.8-.7 5.7 0zm18.8 204.4V354.8L256 323.2v95.9l-82.4 36.2zM421.2 250.9c1.8-.7 3.8-.7 5.7 0l78.4 29.7L424 311.7l-81.2-31.1 78.4-29.7zM523.2 421.2l-77.6 34.1V354.8L528 323.2v90.7c0 3.2-1.9 6-4.8 7.3z"
              />
            </svg>
            <span class="flex-1 ms-3 whitespace-nowrap">Estoque</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :class="[
              currentRouteName === 'stock-movements'
                ? 'text-sky-700 hover:text-sky-800'
                : 'text-gray-700 hover:text-gray-800'
            ]"
            class="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            to="/admin/stock-movements"
            @click="sidebarStore.showSidebar = false"
          >
            <svg
              :class="[
                currentRouteName === 'stock-movements'
                  ? 'text-sky-700 group-hover:text-sky-800'
                  : 'text-gray-700 group-hover:text-gray-800'
              ]"
              class="flex-shrink-0 w-4 h-4 transition duration-75 dark:text-gray-400 dark:group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 0 0 0 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1 17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L48.4 288c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"
              />
            </svg>
            <span class="flex-1 ms-3 whitespace-nowrap">Movimentações estoque</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :class="[
              currentRouteName === 'bills-to-pays'
                ? 'text-sky-700 hover:text-sky-800'
                : 'text-gray-700 hover:text-gray-800'
            ]"
            class="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            to="/admin/bills-to-pays"
            @click="sidebarStore.showSidebar = false"
          >
            <svg
              :class="[
                currentRouteName === 'bills-to-pays'
                  ? 'text-sky-700 group-hover:text-sky-800'
                  : 'text-gray-700 group-hover:text-gray-800'
              ]"
              class="flex-shrink-0 w-4 h-4 transition duration-75 dark:text-gray-400 dark:group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 384 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M14 2.2C22.5-1.7 32.5-.3 39.6 5.8L80 40.4 120.4 5.8c9-7.7 22.3-7.7 31.2 0L192 40.4 232.4 5.8c9-7.7 22.3-7.7 31.2 0L304 40.4 344.4 5.8c7.1-6.1 17.1-7.5 25.6-3.6s14 12.4 14 21.8V488c0 9.4-5.5 17.9-14 21.8s-18.5 2.5-25.6-3.6L304 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L192 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L80 471.6 39.6 506.2c-7.1 6.1-17.1 7.5-25.6 3.6S0 497.4 0 488V24C0 14.6 5.5 6.1 14 2.2zM96 144c-8.8 0-16 7.2-16 16s7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96zM80 352c0 8.8 7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96c-8.8 0-16 7.2-16 16zM96 240c-8.8 0-16 7.2-16 16s7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96z"
              />
            </svg>
            <span class="flex-1 ms-3 whitespace-nowrap">Contas a pagar</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :class="[
              currentRouteName === 'cash-flows'
                ? 'text-sky-700 hover:text-sky-800'
                : 'text-gray-700 hover:text-gray-800'
            ]"
            class="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            to="/admin/cash-flows"
            @click="sidebarStore.showSidebar = false"
          >
            <svg
              :class="[
                currentRouteName === 'cash-flows'
                  ? 'text-sky-700 group-hover:text-sky-800'
                  : 'text-gray-700 group-hover:text-gray-800'
              ]"
              class="flex-shrink-0 w-4 h-4 transition duration-75 dark:text-gray-400 dark:group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M64 0C46.3 0 32 14.3 32 32V96c0 17.7 14.3 32 32 32h80v32H87c-31.6 0-58.5 23.1-63.3 54.4L1.1 364.1C.4 368.8 0 373.6 0 378.4V448c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V378.4c0-4.8-.4-9.6-1.1-14.4L488.2 214.4C483.5 183.1 456.6 160 425 160H208V128h80c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H64zM96 48H256c8.8 0 16 7.2 16 16s-7.2 16-16 16H96c-8.8 0-16-7.2-16-16s7.2-16 16-16zM64 432c0-8.8 7.2-16 16-16H432c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16zm48-168a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm120-24a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zM160 344a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM328 240a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zM256 344a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM424 240a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zM352 344a24 24 0 1 1 0-48 24 24 0 1 1 0 48z"
              />
            </svg>
            <span class="flex-1 ms-3 whitespace-nowrap">Caixa</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :class="[
              currentRouteName === 'orders'
                ? 'text-sky-700 hover:text-sky-800'
                : 'text-gray-700 hover:text-gray-800'
            ]"
            class="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            to="/admin/orders"
            @click="sidebarStore.showSidebar = false"
          >
            <svg
              :class="[
                currentRouteName === 'orders'
                  ? 'text-sky-700 group-hover:text-sky-800'
                  : 'text-gray-700 group-hover:text-gray-800'
              ]"
              class="flex-shrink-0 w-4 h-4 transition duration-75 dark:text-gray-400 dark:group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 384 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM80 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm16 96H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm0 32v64H288V256H96zM240 416h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
              />
            </svg>
            <span class="flex-1 ms-3 whitespace-nowrap">Pedidos</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :class="[
              currentRouteName === 'reports'
                ? 'text-sky-700 hover:text-sky-800'
                : 'text-gray-700 hover:text-gray-800'
            ]"
            class="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            to="/admin/reports"
            @click="sidebarStore.showSidebar = false"
          >
            <svg
              :class="[
                currentRouteName === 'reports'
                  ? 'text-sky-700 group-hover:text-sky-800'
                  : 'text-gray-700 group-hover:text-gray-800'
              ]"
              class="flex-shrink-0 w-4 h-4 transition duration-75 dark:text-gray-400 dark:group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"
              />
            </svg>
            <span class="flex-1 ms-3 whitespace-nowrap">Relatórios</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped></style>
