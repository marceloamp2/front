<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Pagination from '@/components/Pagination.vue'
import { Modal } from 'flowbite'
import api from '@/settings/api.js'
import { useAuthStore } from '@/stores/auth.js'
import { useLoadingStore } from '@/stores/loading.js'
import Alert from '@/components/Alert.vue'

const loadingStore = useLoadingStore()
const authStore = useAuthStore()
const createEditModal = ref({})
const createEditModalElement = ref(null)
const deleteModal = ref({})
const deleteModalElement = ref(null)
const filtersModal = ref({})
const filtersModalElement = ref(null)
const modalTitle = ref('')
const expenses = ref([])
const expense = ref({
  id: '',
  name: '',
  type: ''
})
const filters = ref({
  search: null,
  types: []
})
const errors = ref({})
const alert = ref({
  status: '',
  message: ''
})

onMounted(async () => {
  createEditModal.value = new Modal(createEditModalElement.value)
  deleteModal.value = new Modal(deleteModalElement.value)
  filtersModal.value = new Modal(filtersModalElement.value)
  await getExpenses()
})

const getExpenses = async (page) => {
  try {
    filtersModal.value.hide()

    let url

    loadingStore.loading = !filters.value.search

    if (page) {
      url = `${api.baseUrl}/api/expenses?paginate=true&page=${page}`
    } else if (filters.value.search) {
      url = `${api.baseUrl}/api/expenses?paginate=true&filters[search]=${filters.value.search}`
    } else if (filters.value.types.length > 0) {
      const queryString = filters.value.types
        .map((type) => `filters[types][]=${encodeURIComponent(type)}`)
        .join('&')

      url = `${api.baseUrl}/api/expenses?paginate=true&${queryString}`
    } else {
      url = `${api.baseUrl}/api/expenses?paginate=true`
    }

    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authStore.token}`
      }
    })

    expenses.value = response.data

    loadingStore.loading = false
  } catch (e) {
    loadingStore.loading = false
    showAlertError(e)
  }
}

const openCreateExpenseModal = () => {
  expense.value.id = ''
  expense.value.name = ''
  expense.value.type = ''
  errors.value = {}
  modalTitle.value = 'Incluir despesa'
  createEditModal.value.show()
}

const openEditExpenseModal = (data) => {
  expense.value.id = data.id
  expense.value.name = data.name
  expense.value.type = data.type
  errors.value = {}
  modalTitle.value = 'Editar despesa'
  createEditModal.value.show()
}

const formValidate = () => {
  errors.value = {}

  if (!expense.value.name) {
    errors.value.name = 'O nome é obrigatório'
  }

  if (!expense.value.type) {
    errors.value.type = 'O tipo é obrigatório'
  }

  return Object.keys(errors.value).length <= 0
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

const showAlertSuccess = (message) => {
  alert.value.status = 'success'
  alert.value.message = message

  setTimeout(function () {
    alert.value.status = ''
    alert.value.message = ''
  }, 5000)
}
const storeUpdateExpense = async () => {
  try {
    loadingStore.loading = true

    if (formValidate()) {
      createEditModal.value.hide()

      let response

      if (expense.value.id) {
        const url = `${api.baseUrl}/api/expenses/${expense.value.id}`

        response = await axios.put(url, expense.value, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${authStore.token}`
          }
        })
      } else {
        const url = `${api.baseUrl}/api/expenses`

        response = await axios.post(url, expense.value, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${authStore.token}`
          }
        })
      }

      showAlertSuccess(response.data.message)

      await getExpenses(expenses.value.current_page)
    }

    loadingStore.loading = false
  } catch (e) {
    loadingStore.loading = false
    showAlertError(e)
  }
}

const openDeleteExpenseModal = (data) => {
  expense.value.id = data.id
  deleteModal.value.show()
}

const openFiltersModal = () => {
  modalTitle.value = 'Filtros'
  filtersModal.value.show()
}

const deleteExpense = async () => {
  try {
    loadingStore.loading = true

    deleteModal.value.hide()

    const url = `${api.baseUrl}/api/expenses/${expense.value.id}`

    const response = await axios.delete(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authStore.token}`
      }
    })

    showAlertSuccess(response.data.message)

    await getExpenses(expenses.value.current_page)

    loadingStore.loading = false
  } catch (e) {
    loadingStore.loading = false
    showAlertError(e)
  }
}
</script>
<template>
  <Alert :alert="alert" />

  <h1 class="py-3 text-sm font-medium">Despesas</h1>

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
              type="text"
              @keyup="getExpenses(null)"
            />
          </div>
        </form>
        <div
          class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0"
        >
          <button
            class="flex items-center justify-center text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-sky-600 dark:hover:bg-sky-700 focus:outline-none dark:focus:ring-sky-800"
            type="button"
            @click="openFiltersModal"
          >
            <svg
              class="h-3.5 w-3.5 mr-2"
              fill="currentColor"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"
              />
            </svg>
            Filtrar
          </button>
        </div>
      </div>
      <div
        class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0"
      >
        <button
          class="flex items-center justify-center text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-sky-600 dark:hover:bg-sky-700 focus:outline-none dark:focus:ring-sky-800"
          type="button"
          @click="openCreateExpenseModal"
        >
          <svg
            class="h-3.5 w-3.5 mr-2"
            fill="currentColor"
            viewBox="0 0 448 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path
              d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
            />
          </svg>
          Incluir
        </button>
      </div>
    </div>

    <!--    Start table-->
    <div v-if="!loadingStore.loading" class="overflow-x-auto">
      <table
        v-if="expenses.data && expenses.data.length > 0"
        class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th class="px-4 py-3" scope="col">Nome</th>
            <th class="px-4 py-3" scope="col">Tipo</th>
            <th class="px-4 py-3 text-right" scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="expense in expenses.data"
            :key="expense.id"
            class="border-b hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-700"
          >
            <td class="px-4 py-3">{{ expense.name }}</td>
            <td class="px-4 py-3">{{ expense.type === 'fixed' ? 'Fixa' : 'Variável' }}</td>
            <td class="px-4 py-3 flex items-center justify-end">
              <button
                class="text-blue-700 mr-3"
                type="button"
                @click="openEditExpenseModal(expense)"
              >
                <svg
                  class="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                  <path
                    d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"
                  />
                </svg>
              </button>
              <button class="text-red-700" type="button" @click="openDeleteExpenseModal(expense)">
                <svg
                  class="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                  <path
                    d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="flex items-center justify-center h-28">
        <p>Não existem registros</p>
      </div>
    </div>

    <Pagination v-if="!loadingStore.loading" :registers="expenses" @go-to-page="getExpenses" />
  </div>
  <!--    End table-->

  <!--  Start modal save/edit-->
  <div
    ref="createEditModalElement"
    aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    tabindex="-1"
  >
    <div class="relative p-4 w-full max-w-2xl max-h-full">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <div
          class="flex items-center justify-between p-4 md:p-4 border-b rounded-t dark:border-gray-600"
        >
          <h3 class="font-semibold text-gray-900 dark:text-white">{{ modalTitle }}</h3>
          <button
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            type="button"
            @click="createEditModal.hide"
          >
            <svg
              aria-hidden="true"
              class="w-3 h-3"
              fill="none"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <div class="p-4 md:p-5">
          <p class="text-xs text-red-500 text-right mb-3">Campos com * são obrigatórios</p>
          <form>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-2">
              <div class="mb-5">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  for="name"
                  >Nome <span class="text-red-500">*</span></label
                >
                <input
                  id="name"
                  v-model="expense.name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="text"
                />
                <p v-if="errors.name" class="mt-2 text-sm text-red-600 dark:text-red-500">
                  {{ errors.name }}
                </p>
              </div>

              <div class="mb-5">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  for="type"
                  >Tipo <span class="text-red-500">*</span></label
                >
                <select
                  id="type"
                  v-model="expense.type"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="fixed">Fixa</option>
                  <option value="variable">Variável</option>
                </select>
                <p v-if="errors.type" class="mt-2 text-sm text-red-600 dark:text-red-500">
                  {{ errors.type }}
                </p>
              </div>
            </div>
          </form>
        </div>
        <div
          class="flex items-center p-4 md:p-4 border-t border-gray-200 rounded-b dark:border-gray-600"
        >
          <button
            class="text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
            type="button"
            @click="storeUpdateExpense"
          >
            Salvar
          </button>
          <button
            class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            type="button"
            @click="createEditModal.hide"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
  <!--  End modal save/edit-->

  <!--  Start modal filters-->
  <div
    ref="filtersModalElement"
    aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    tabindex="-1"
  >
    <div class="relative p-4 w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <div
          class="flex items-center justify-between p-4 md:p-4 border-b rounded-t dark:border-gray-600"
        >
          <h3 class="font-semibold text-gray-900 dark:text-white">{{ modalTitle }}</h3>
          <button
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            type="button"
            @click="filtersModal.hide"
          >
            <svg
              aria-hidden="true"
              class="w-3 h-3"
              fill="none"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <div class="p-4 md:p-5">
          <p class="text-sm font-medium text-gray-900 dark:text-gray-300 mb-4">Tipo</p>
          <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <div class="flex items-center">
                <input
                  id="fixed"
                  v-model="filters.types"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  type="checkbox"
                  value="fixed"
                />
                <label class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300" for="fixed"
                  >Fixa</label
                >
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <input
                  id="variable"
                  v-model="filters.types"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  type="checkbox"
                  value="variable"
                />
                <label
                  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  for="variable"
                  >Variável</label
                >
              </div>
            </li>
          </ul>
        </div>
        <div
          class="flex items-center p-4 md:p-4 border-t border-gray-200 rounded-b dark:border-gray-600"
        >
          <button
            class="text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
            type="button"
            @click="getExpenses(null)"
          >
            Aplicar
          </button>
          <button
            class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            type="button"
            @click="filtersModal.hide"
          >
            Cancelar
          </button>
          <button
            class="flex items-center justify-end w-full text-sm font-medium text-red-700"
            @click="filters.types = []"
          >
            <svg
              class="h-3.5 w-3.5 mr-2"
              fill="currentColor"
              viewBox="0 0 576 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M290.7 57.4L57.4 290.7c-25 25-25 65.5 0 90.5l80 80c12 12 28.3 18.7 45.3 18.7H288h9.4H512c17.7 0 32-14.3 32-32s-14.3-32-32-32H387.9L518.6 285.3c25-25 25-65.5 0-90.5L381.3 57.4c-25-25-65.5-25-90.5 0zM297.4 416H288l-105.4 0-80-80L227.3 211.3 364.7 348.7 297.4 416z"
              />
            </svg>
            Limpar
          </button>
        </div>
      </div>
    </div>
  </div>
  <!--  End modal filters-->

  <!--  Start modal delete-->
  <div
    ref="deleteModalElement"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    tabindex="-1"
  >
    <div class="relative p-4 w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <button
          class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          type="button"
          @click="deleteModal.hide"
        >
          <svg
            aria-hidden="true"
            class="w-3 h-3"
            fill="none"
            viewBox="0 0 14 14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="p-4 md:p-5 text-center">
          <svg
            aria-hidden="true"
            class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
            fill="none"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
          <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Você quer apagar o registro?
          </h3>
          <button
            class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
            type="button"
            @click="deleteExpense"
          >
            Apagar
          </button>
          <button
            class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            type="button"
            @click="deleteModal.hide"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
  <!--  End modal delete-->
</template>

<style scoped></style>
