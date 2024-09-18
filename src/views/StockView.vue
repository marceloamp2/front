<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Pagination from '@/components/Pagination.vue'
import api from '@/settings/api.js'
import { useAuthStore } from '@/stores/auth.js'
import { useLoadingStore } from '@/stores/loading.js'
import Alert from '@/components/Alert.vue'

const loadingStore = useLoadingStore()
const authStore = useAuthStore()
const stocks = ref([])
const filters = ref({
  search: null
})
const alert = ref({
  status: '',
  message: ''
})

onMounted(async () => {
  await getStocks()
})

const getStocks = async (page) => {
  try {
    let url

    loadingStore.loading = !filters.value.search

    if (page) {
      url = `${api.baseUrl}/api/stocks?paginate=true&page=${page}`
    } else if (filters.value.search) {
      url = `${api.baseUrl}/api/stocks?paginate=true&filters[search]=${filters.value.search}`
    } else {
      url = `${api.baseUrl}/api/stocks?paginate=true`
    }

    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authStore.token}`
      }
    })

    stocks.value = response.data

    loadingStore.loading = false
  } catch (e) {
    loadingStore.loading = false
    showAlertError(e)
  }
}

const showAlertError = (e) => {
  alert.value.status = 'error'

  let errors = Object.values(e.response.data.errors)

  errors.map((error) => {
    alert.value.message += error[0] + '<br>'
  })

  setTimeout(function () {
    alert.value.status = ''
    alert.value.message = ''
  }, 10000)
}
</script>
<template>
  <Alert :alert="alert" />

  <h1 class="py-3 text-sm font-medium">Estoque</h1>

  <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
    <div v-if="loadingStore.loading" class="text-center py-5">
      <svg
        aria-hidden="true"
        class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-sky-600"
        fill="none"
        viewBox="0 0 100 101"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span class="sr-only">Loading...</span>
    </div>

    <div
      v-if="!loadingStore.loading"
      class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4"
    >
      <div class="w-full md:w-1/2 flex flex-wrap sm:flex-nowrap">
        <form class="flex flex-wrap items-center w-full sm:w-1/2">
          <label class="sr-only" for="simple-search">Buscar por nome</label>
          <div class="relative w-full mb-3 sm:mb-0 sm:mr-2">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                <path
                  d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                />
              </svg>
            </div>
            <input
              v-model="filters.search"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Buscar por nome"
              type="search"
              @input="getStocks(null)"
              @keyup="getStocks(null)"
            />
          </div>
        </form>
      </div>
    </div>

    <!--    Start table-->
    <div v-if="!loadingStore.loading" class="overflow-x-auto">
      <table
        v-if="stocks.data && stocks.data.length > 0"
        class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th class="px-4 py-3" scope="col">Insumo</th>
            <th class="px-4 py-3" scope="col">Quantidade</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="stock in stocks.data"
            :key="stock.id"
            class="border-b hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-700"
          >
            <td class="px-4 py-3">{{ stock.input.name }}</td>
            <td class="px-4 py-3">{{ stock.quantity }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="flex items-center justify-center h-28">
        <p>Não existem registros</p>
      </div>
    </div>

    <Pagination v-if="!loadingStore.loading" :registers="stocks" @go-to-page="getStocks" />
  </div>
  <!--    End table-->
</template>

<style scoped></style>
