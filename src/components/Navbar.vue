<script setup>
import { useUserStore } from '@/stores/user.js'
import { useAuthStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted, ref } from 'vue'
import { useSidebarStore } from '@/stores/sidebar.js'

const authStore = useAuthStore()
const userStore = useUserStore()
const sidebarStore = useSidebarStore()
const router = useRouter()
const buttonSidebar = ref(null)
const buttonDropdown = ref(null)
const showUserDropdown = ref(false)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event) => {
  if (buttonDropdown.value && !buttonDropdown.value.contains(event.target)) {
    showUserDropdown.value = false
  }

  if (event.target.id === 'overlay') {
    sidebarStore.showSidebar = false
  }
}

const logout = async () => {
  authStore.deleteToken()
  userStore.deleteUser()
  await router.push('/')
}
</script>

<template>
  <nav
    class="fixed top-0 z-50 w-full bg-sky-800 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start rtl:justify-end">
          <button
            ref="buttonSidebar"
            aria-controls="logo-sidebar"
            class="bg-sky-800 inline-flex items-center p-2 text-sm text-white rounded-lg sm:hidden dark:text-gray-400"
            type="button"
            @click="sidebarStore.showSidebar = !sidebarStore.showSidebar"
          >
            <span class="sr-only">Open sidebar</span>
            <svg
              aria-hidden="true"
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                fill-rule="evenodd"
              ></path>
            </svg>
          </button>
          <RouterLink class="flex ms-2 md:me-24" to="/admin/dashboard">
            <span
              class="text-white self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white"
              >Lunê Gravações</span
            >
          </RouterLink>
        </div>
        <div class="flex items-center">
          <div class="flex items-center ms-3 relative">
            <div>
              <button
                ref="buttonDropdown"
                aria-expanded="false"
                class="text-white flex items-center font-medium"
                type="button"
                @click="showUserDropdown = !showUserDropdown"
              >
                <span class="text-sm">{{ userStore.user.name }}</span>
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-3 h-3 ml-2 transition duration-75 dark:text-gray-400 dark:group-hover:text-white"
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
            </div>
            <div
              :class="[showUserDropdown ? 'block' : 'hidden']"
              class="absolute top-4 right-0 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
            >
              <div class="px-4 py-3" role="none">
                <p class="text-sm text-gray-900 dark:text-white" role="none">
                  {{ userStore.user.role.name }}
                </p>
                <p
                  class="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                  role="none"
                >
                  {{ userStore.user.email }}
                </p>
              </div>
              <ul class="py-1" role="none">
                <li>
                  <a
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    href="#"
                    role="menuitem"
                    >Perfil</a
                  >
                </li>
                <li>
                  <a
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    href="#"
                    role="menuitem"
                    @click="logout"
                    >Sair</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
