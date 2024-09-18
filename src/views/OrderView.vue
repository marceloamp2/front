<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import Pagination from '@/components/Pagination.vue'
import { Modal } from 'flowbite'
import api from '@/settings/api.js'
import { useAuthStore } from '@/stores/auth.js'
import { useLoadingStore } from '@/stores/loading.js'
import Alert from '@/components/Alert.vue'
import formatCurrency from '../helpers/formatCurrency.js'
import { Money3 } from 'v-money3'
import Design from '@/components/Design.vue'

const loadingStore = useLoadingStore()
const authStore = useAuthStore()
const createEditModal = ref({})
const createEditModalElement = ref(null)
const deleteModal = ref({})
const deleteModalElement = ref(null)
const filtersModal = ref({})
const filtersModalElement = ref(null)
const modalTitle = ref('')
const orders = ref([])
const order = ref({
  id: '',
  total_value: '',
  sedex: 0,
  discount: 0,
  note: '',
  status: '',
  customer_id: '',
  payment_method_id: '',
  company_id: '',
  projects: []
})
const customers = ref([])
const paymentMethods = ref([])
const companies = ref([])
const services = ref([])
const filters = ref({
  search: null,
  status: []
})
const errors = ref({})
const alert = ref({
  status: '',
  message: ''
})
const moneyConfig = ref({
  masked: false,
  prefix: 'R$ ',
  suffix: '',
  thousands: '.',
  decimal: ',',
  precision: 2,
  disableNegative: false,
  disabled: false,
  min: null,
  max: null,
  allowBlank: false,
  minimumNumberOfCharacters: 0,
  shouldRound: true,
  focusOnRight: false
})

onMounted(async () => {
  createEditModal.value = new Modal(createEditModalElement.value)
  deleteModal.value = new Modal(deleteModalElement.value)
  filtersModal.value = new Modal(filtersModalElement.value)
  loadingStore.loading = true
  await getOrders()
  await getCustomers()
  await getPaymentMethods()
  await getCompanies()
  await getServices()
  loadingStore.loading = false
})

const totalValueCalculated = computed(() => {
  let total = 0

  if (order.value.projects.length > 0) {
    order.value.projects.map((project) => {
      if (project.services.length > 0) {
        project.services.map((service) => {
          total += Number(service.quantity) * Number(service.unitary_value)
        })
      }
    })
  }

  return Number(total) + Number(order.value.sedex) - Number(order.value.discount)
})

const getOrders = async (page) => {
  try {
    filtersModal.value.hide()

    let url

    loadingStore.loading = !filters.value.search

    if (page) {
      url = `${api.baseUrl}/api/orders?paginate=true&page=${page}`
    } else if (filters.value.search) {
      url = `${api.baseUrl}/api/orders?paginate=true&filters[search]=${filters.value.search}`
    } else if (filters.value.status.length > 0) {
      const queryString = filters.value.status
        .map((type) => `filters[status][]=${encodeURIComponent(type)}`)
        .join('&')

      url = `${api.baseUrl}/api/orders?paginate=true&${queryString}`
    } else {
      url = `${api.baseUrl}/api/orders?paginate=true`
    }

    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authStore.token}`
      }
    })

    orders.value = response.data

    loadingStore.loading = false
  } catch (e) {
    loadingStore.loading = false
    showAlertError(e)
  }
}

const getCustomers = async () => {
  try {
    let url

    url = `${api.baseUrl}/api/customers?paginate=false`

    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authStore.token}`
      }
    })

    customers.value = response.data
  } catch (e) {
    showAlertError(e)
  }
}

const getCompanies = async () => {
  try {
    let url

    url = `${api.baseUrl}/api/companies?paginate=false`

    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authStore.token}`
      }
    })

    companies.value = response.data
  } catch (e) {
    showAlertError(e)
  }
}

const getPaymentMethods = async () => {
  try {
    let url

    url = `${api.baseUrl}/api/payment-methods?paginate=false`

    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authStore.token}`
      }
    })

    paymentMethods.value = response.data
  } catch (e) {
    showAlertError(e)
  }
}

const getServices = async () => {
  try {
    let url

    url = `${api.baseUrl}/api/services?paginate=false`

    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authStore.token}`
      }
    })

    services.value = response.data
  } catch (e) {
    showAlertError(e)
  }
}

const openCreateOrderModal = () => {
  order.value.id = ''
  order.value.total_value = ''
  order.value.sedex = 0
  order.value.discount = 0
  order.value.note = ''
  order.value.status = ''
  order.value.customer_id = ''
  order.value.payment_method_id = ''
  order.value.company_id = ''
  order.value.projects = []
  errors.value = {}
  modalTitle.value = 'Incluir pedido'
  createEditModal.value.show()
}

const openEditOrderModal = (data) => {
  order.value.id = data.id
  order.value.total_value = data.total_value
  order.value.sedex = data.sedex
  order.value.discount = data.discount
  order.value.note = data.note
  order.value.status = data.status
  order.value.customer_id = data.customer_id
  order.value.payment_method_id = data.payment_method_id
  order.value.company_id = data.company_id
  order.value.projects = data.projects
  errors.value = {}
  modalTitle.value = 'Editar pedido'
  createEditModal.value.show()
}

const formValidate = () => {
  errors.value = {}

  if (!order.value.company_id) {
    errors.value.company_id = 'A empresa é obrigatória'
  }

  if (!totalValueCalculated.value) {
    errors.value.total_value = 'O valor total é obrigatório'
  }

  if (!order.value.sedex) {
    errors.value.sedex = 'O sedex é obrigatório'
  }

  if (!order.value.discount) {
    errors.value.discount = 'O desconto é obrigatório'
  }

  if (!order.value.customer_id) {
    errors.value.customer_id = 'O cliente é obrigatório'
  }

  if (!order.value.payment_method_id) {
    errors.value.payment_method_id = 'O método de pagamento é obrigatório'
  }

  if (order.value.projects.length === 0) {
    errors.value.projects = 'Inclua pelo menos um projeto'
  }

  if (order.value.projects.length > 0) {
    order.value.projects.map((project) => {
      if (!project.brand) {
        errors.value.brand = 'A marca é obrigatória'
      }

      if (project.services.length > 0) {
        project.services.map((service) => {
          if (service.id === '' || service.quantity === '' || service.unitary_value === '') {
            errors.value.project_service = 'Preencha todos os valores do serviço'
          }

          if (service.quantity === 0) {
            errors.value.project_service = 'Quantidade do serviço não pode ser zero'
          }
        })
      } else {
        errors.value.projects = 'Inclua pelo menos um serviço'
      }
    })
  }

  if (order.value.projects.length > 0) {
    order.value.projects.map((project) => {
      if (project.images.length === 0) {
        errors.value.project_image = 'Inclua pelo menos um desenho no projeto'
      }
    })
  }

  return Object.keys(errors.value).length <= 0
}

const saveImages = (payload, index) => {
  order.value.projects[index].images = payload
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
const storeUpdateOrder = async () => {
  try {
    loadingStore.loading = true

    if (formValidate()) {
      createEditModal.value.hide()

      let response

      order.value.total_value = totalValueCalculated.value

      if (order.value.id) {
        const url = `${api.baseUrl}/api/orders/${order.value.id}`

        response = await axios.put(url, order.value, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${authStore.token}`
          }
        })
      } else {
        const url = `${api.baseUrl}/api/orders`

        response = await axios.post(url, order.value, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${authStore.token}`
          }
        })
      }

      showAlertSuccess(response.data.message)

      await getOrders(orders.value.current_page)
    }

    loadingStore.loading = false
  } catch (e) {
    loadingStore.loading = false
    showAlertError(e)
  }
}

const openDeleteOrderModal = (data) => {
  order.value.id = data.id
  deleteModal.value.show()
}

const openFiltersModal = () => {
  modalTitle.value = 'Filtros'
  filtersModal.value.show()
}

const deleteOrder = async () => {
  try {
    loadingStore.loading = true

    deleteModal.value.hide()

    const url = `${api.baseUrl}/api/orders/${order.value.id}`

    const response = await axios.delete(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authStore.token}`
      }
    })

    showAlertSuccess(response.data.message)

    await getOrders(orders.value.current_page)

    loadingStore.loading = false
  } catch (e) {
    loadingStore.loading = false
    showAlertError(e)
  }
}

const translateStatus = (status) => {
  switch (status) {
    case 'waiting':
      return 'Aguardando'
    case 'in_production':
      return 'Em producção'
    case 'delivered':
      return 'Entregue'
    case 'cancelled':
      return 'Cancelado'
  }
}

const newProject = () => {
  order.value.projects.push({
    brand: '',
    services: [],
    images: []
  })
}

const deleteProject = (index) => {
  order.value.projects.splice(index, 1)
}

const newSelectedService = (index) => {
  order.value.projects[index].services.push({
    id: '',
    quantity: 0,
    unitary_value: ''
  })
}

const deleteServiceInProject = (indexProject, indexService) => {
  order.value.projects[indexProject].services.splice(indexService, 1)
}

const getUnitaryValueServiceByQuantity = (indexProject, indexService) => {
  const selectedServiceInProject = order.value.projects[indexProject].services[indexService]

  const service = services.value.find((service) => service.id === selectedServiceInProject.id)

  const serviceValueRanges = service.service_value_ranges

  serviceValueRanges.map((serviceValueRange) => {
    if (
      selectedServiceInProject.quantity >= serviceValueRange.from &&
      selectedServiceInProject.quantity <= serviceValueRange.to
    ) {
      selectedServiceInProject.unitary_value = serviceValueRange.unitary_value
    }

    if (selectedServiceInProject.quantity > serviceValueRange.to) {
      selectedServiceInProject.unitary_value = serviceValueRanges.at(-1).unitary_value
    }
  })
}
</script>
<template>
  <Alert :alert="alert" />

  <h1 class="py-3 text-sm font-medium">Pedidos</h1>

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
          <label class="sr-only" for="simple-search">Buscar por cliente</label>
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
              placeholder="Buscar por cliente"
              type="text"
              @keyup="getOrders(null)"
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
          @click="openCreateOrderModal"
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
        v-if="orders.data && orders.data.length > 0"
        class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th class="px-4 py-3" scope="col">Data</th>
            <th class="px-4 py-3" scope="col">Cliente</th>
            <th class="px-4 py-3" scope="col">Status</th>
            <th class="px-4 py-3" scope="col">Observação</th>
            <th class="px-4 py-3" scope="col">Pagamento</th>
            <th class="px-4 py-3" scope="col">Sedex</th>
            <th class="px-4 py-3" scope="col">Desconto</th>
            <th class="px-4 py-3" scope="col">Valor total</th>
            <th class="px-4 py-3 text-right" scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orders.data"
            :key="order.id"
            class="border-b hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-700"
          >
            <td class="px-4 py-3">{{ order.created_at }}</td>
            <td class="px-4 py-3">
              {{
                order.customer.person_type === 'pf'
                  ? order.customer.natural_person.name
                  : order.customer.legal_person.company
              }}
            </td>
            <td class="px-4 py-3">
              <span
                :class="{
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300':
                    order.status === 'waiting',
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300':
                    order.status === 'in_production',
                  'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300':
                    order.status === 'delivered',
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300':
                    order.status === 'cancelled'
                }"
                class="text-xs font-medium me-2 px-2.5 py-0.5 rounded-full"
                >{{ translateStatus(order.status) }}
              </span>
            </td>
            <td class="px-4 py-3">{{ order.note }}</td>
            <td class="px-4 py-3">{{ order.payment_method.label }}</td>
            <td class="px-4 py-3">{{ formatCurrency(order.sedex) }}</td>
            <td class="px-4 py-3">{{ formatCurrency(order.discount) }}</td>
            <td class="px-4 py-3">{{ formatCurrency(order.total_value) }}</td>
            <td class="px-4 py-3 flex items-center justify-end">
              <button class="text-blue-700 mr-3" type="button" @click="openEditOrderModal(order)">
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
              <button class="text-red-700" type="button" @click="openDeleteOrderModal(order)">
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

    <Pagination v-if="!loadingStore.loading" :registers="orders" @go-to-page="getOrders" />
  </div>
  <!--    End table-->

  <!--  Start modal save/edit-->
  <div
    ref="createEditModalElement"
    aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    tabindex="-1"
  >
    <div class="relative p-4 w-full max-w-4xl max-h-full">
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
            <div class="mb-10">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-2">
                <div class="mb-5">
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    for="customer-id"
                    >Empresa <span class="text-red-500">*</span></label
                  >
                  <select
                    id="customer-id"
                    v-model="order.company_id"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">Selecione</option>
                    <option v-for="company in companies" :key="company.id" :value="company.id">
                      {{ company.legal_person.company }}
                    </option>
                  </select>
                  <p v-if="errors.company_id" class="mt-2 text-sm text-red-600 dark:text-red-500">
                    {{ errors.company_id }}
                  </p>
                </div>

                <div class="mb-5">
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    for="customer-id"
                    >Cliente <span class="text-red-500">*</span></label
                  >
                  <select
                    id="customer-id"
                    v-model="order.customer_id"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">Selecione</option>
                    <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                      {{
                        customer.person_type === 'pf'
                          ? customer.natural_person.name
                          : customer.legal_person.company
                      }}
                    </option>
                  </select>
                  <p v-if="errors.customer_id" class="mt-2 text-sm text-red-600 dark:text-red-500">
                    {{ errors.customer_id }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-2">
                <div class="mb-5">
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    for="sedex"
                    >Sedex <span class="text-red-500">*</span></label
                  >
                  <money3
                    id="sedex"
                    v-model="order.sedex"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    v-bind="moneyConfig"
                  ></money3>
                  <p v-if="errors.sedex" class="mt-2 text-sm text-red-600 dark:text-red-500">
                    {{ errors.sedex }}
                  </p>
                </div>

                <div class="mb-5">
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    for="discount"
                    >Desconto <span class="text-red-500">*</span></label
                  >
                  <money3
                    id="discount"
                    v-model="order.discount"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    v-bind="moneyConfig"
                  ></money3>
                  <p v-if="errors.discount" class="mt-2 text-sm text-red-600 dark:text-red-500">
                    {{ errors.discount }}
                  </p>
                </div>

                <div class="mb-5">
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    for="total-value"
                    >Valor total <span class="text-red-500">*</span></label
                  >
                  <money3
                    id="total-value"
                    :model-value="totalValueCalculated"
                    class="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    readonly="true"
                    v-bind="moneyConfig"
                  ></money3>
                  <p v-if="errors.total_value" class="mt-2 text-sm text-red-600 dark:text-red-500">
                    {{ errors.total_value }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-2">
                <div class="mb-5">
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    for="name"
                    >Observação <span class="text-red-500">*</span></label
                  >
                  <input
                    id="name"
                    v-model="order.note"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                  />
                  <p v-if="errors.note" class="mt-2 text-sm text-red-600 dark:text-red-500">
                    {{ errors.note }}
                  </p>
                </div>

                <div class="mb-5">
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    for="payment-method-id"
                    >Forma de pagamento <span class="text-red-500">*</span></label
                  >
                  <select
                    id="payment-method-id"
                    v-model="order.payment_method_id"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">Selecione</option>
                    <option
                      v-for="paymentMethod in paymentMethods"
                      :key="paymentMethod.id"
                      :value="paymentMethod.id"
                    >
                      {{ paymentMethod.label }}
                    </option>
                  </select>
                  <p
                    v-if="errors.payment_method_id"
                    class="mt-2 text-sm text-red-600 dark:text-red-500"
                  >
                    {{ errors.payment_method_id }}
                  </p>
                </div>
              </div>
            </div>

            <!--  Start projects-->
            <div class="mb-5">
              <button
                class="flex items-center justify-center text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-sky-600 dark:hover:bg-sky-700 focus:outline-none dark:focus:ring-sky-800"
                type="button"
                @click="newProject"
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
                Incluir projeto
              </button>
            </div>

            <p v-if="errors.projects" class="my-2 text-sm text-red-600 dark:text-red-500">
              {{ errors.projects }}
            </p>
            <p v-if="errors.project_image" class="my-2 text-sm text-red-600 dark:text-red-500">
              {{ errors.project_image }}
            </p>
            <p v-if="errors.project_service" class="my-2 text-sm text-red-600 dark:text-red-500">
              {{ errors.project_service }}
            </p>
            <p v-if="errors.brand" class="my-2 text-sm text-red-600 dark:text-red-500">
              {{ errors.brand }}
            </p>

            <div v-if="order.projects.length > 0">
              <div v-for="(project, indexProject) in order.projects" :key="indexProject">
                <div
                  class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden mb-5 p-4"
                >
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-2">
                    <div class="mb-5">
                      <label
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        for="brand"
                        >Marca <span class="text-red-500">*</span></label
                      >
                      <input
                        id="brand"
                        v-model="project.brand"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text"
                      />
                    </div>
                    <div class="mb-5 text-right">
                      <button
                        class="text-red-700 mt-3"
                        type="button"
                        @click="deleteProject(indexProject)"
                      >
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
                    </div>
                  </div>

                  <!--  Start services-->
                  <div class="mb-10">
                    <div class="mb-5">
                      <button
                        class="flex items-center justify-center text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-sky-600 dark:hover:bg-sky-700 focus:outline-none dark:focus:ring-sky-800"
                        type="button"
                        @click="newSelectedService(indexProject)"
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
                        Incluir serviço
                      </button>
                    </div>

                    <div class="overflow-x-auto mb-5">
                      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead
                          class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
                        >
                          <tr>
                            <th class="w-2/6 px-4 py-3" scope="col">Serviço</th>
                            <th class="w-1/6 px-4 py-3" scope="col">Quantidade</th>
                            <th class="w-2/6 px-4 py-3" scope="col">Valor unitário</th>
                            <th class="w-1/6 px-4 py-3 text-right" scope="col">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(selectedService, indexService) in project.services"
                            :key="indexService"
                            class="border-b hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-700"
                          >
                            <td class="px-4 py-3">
                              <select
                                id="input-id"
                                v-model="selectedService.id"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                @change="
                                  getUnitaryValueServiceByQuantity(indexProject, indexService)
                                "
                              >
                                <option value="">Selecione</option>
                                <option
                                  v-for="service in services"
                                  :key="service.id"
                                  :value="service.id"
                                >
                                  {{ service.name }}
                                </option>
                              </select>
                            </td>
                            <td class="px-4 py-3">
                              <input
                                v-model="selectedService.quantity"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                min="1"
                                type="number"
                                @input="
                                  getUnitaryValueServiceByQuantity(indexProject, indexService)
                                "
                              />
                            </td>
                            <td class="px-4 py-3">
                              <money3
                                v-model="selectedService.unitary_value"
                                class="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                readonly="true"
                                v-bind="moneyConfig"
                              ></money3>
                            </td>
                            <td class="px-4 py-3 flex items-center justify-end">
                              <button
                                class="text-red-700 mt-3"
                                type="button"
                                @click="deleteServiceInProject(indexProject, indexService)"
                              >
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
                    </div>
                  </div>
                  <!--  End services-->

                  <Design @save-images="saveImages($event, indexProject)" />
                </div>
              </div>
            </div>
            <!--    End projects-->
          </form>
        </div>
        <div
          class="flex items-center p-4 md:p-4 border-t border-gray-200 rounded-b dark:border-gray-600"
        >
          <button
            class="text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
            type="button"
            @click="storeUpdateOrder"
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
          <p class="text-sm font-medium text-gray-900 dark:text-gray-300 mb-4">Status</p>
          <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <div class="flex items-center">
                <input
                  id="waiting"
                  v-model="filters.status"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  type="checkbox"
                  value="waiting"
                />
                <label
                  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  for="waiting"
                  >Aguardando</label
                >
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <input
                  id="in-production"
                  v-model="filters.status"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  type="checkbox"
                  value="in_production"
                />
                <label
                  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  for="in-production"
                  >Em produção</label
                >
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <input
                  id="delivered"
                  v-model="filters.status"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  type="checkbox"
                  value="delivered"
                />
                <label
                  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  for="delivered"
                  >Entregue</label
                >
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <input
                  id="cancelled"
                  v-model="filters.status"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  type="checkbox"
                  value="cancelled"
                />
                <label
                  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  for="cancelled"
                  >Cancelado</label
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
            @click="getOrders(null)"
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
            @click="filters.status = []"
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
            @click="deleteOrder"
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
