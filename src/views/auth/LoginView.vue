<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import api from '@/settings/api.js'
import { useAuthStore } from '@/stores/auth.js'
import { useUserStore } from '@/stores/user.js'
import { useLoadingStore } from '@/stores/loading.js'
import Alert from '@/components/Alert.vue'

const loadingStore = useLoadingStore()
const errors = ref({})
const alert = ref({
  status: '',
  message: ''
})
const email = ref()
const password = ref()
const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

onMounted(() => {
  loadingStore.loading = false
})

const formValidate = () => {
  errors.value = {}

  if (!email.value) {
    errors.value.email = 'O email é obrigatório'
  }

  if (!password.value) {
    errors.value.password = 'A senha é obrigatória'
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

const login = async () => {
  try {
    loadingStore.loading = true

    if (formValidate()) {
      let url = `${api.baseUrl}/api/auth/login`

      let response = await axios.post(
        url,
        {
          email: email.value,
          password: password.value
        },
        {
          headers: {
            Accept: 'application/json'
          }
        }
      )

      authStore.storeToken(response.data.data)

      url = `${api.baseUrl}/api/auth/user`

      response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${response.data.data}`
        }
      })

      userStore.storeUser(response.data.data)

      await router.push('/admin/dashboard')

      loadingStore.loading = false
    }
  } catch (e) {
    loadingStore.loading = false
    showAlertError(e)
  }
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 bg-sky-800 dark:bg-gray-900 h-screen"
  >
    <h1
      v-if="!loadingStore.loading"
      class="flex items-center justify-center mb-8 text-3xl font-semibold lg:mb-10 text-white dark:text-white"
    >
      <span>Lunê Gravações</span>
    </h1>

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
      class="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800"
    >
      <Alert :alert="alert" />

      <h2 class="text-xl font-bold text-gray-900 dark:text-white">Login</h2>
      <form action="#" class="mt-8 space-y-6">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="email"
            >Email</label
          >
          <input
            id="email"
            v-model="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            name="email"
            required
            type="email"
          />
          <p v-if="errors.email" class="mt-2 text-sm text-red-600 dark:text-red-500">
            {{ errors.email }}
          </p>
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="password"
            >Senha</label
          >
          <input
            id="password"
            v-model="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            name="password"
            required
            type="password"
            @keyup.enter="login"
          />
          <p v-if="errors.password" class="mt-2 text-sm text-red-600 dark:text-red-500">
            {{ errors.password }}
          </p>
        </div>
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="remember"
              aria-describedby="remember"
              class="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              name="remember"
              required
              type="checkbox"
            />
          </div>
          <div class="ml-3 text-sm">
            <label class="font-medium text-gray-900 dark:text-white" for="remember"
              >Lembra-me</label
            >
          </div>
          <a class="ml-auto text-sm text-primary-700 hover:underline dark:text-primary-500" href="#"
            >Esqueceu a senha?</a
          >
        </div>
        <button
          class="flex items-center justify-center text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-sky-600 dark:hover:bg-sky-700 focus:outline-none dark:focus:ring-sky-800"
          type="button"
          @click="login"
        >
          <svg
            class="h-3.5 w-3.5 mr-2"
            fill="currentColor"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path
              d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
            />
          </svg>
          Entrar
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
