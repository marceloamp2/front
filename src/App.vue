<script setup>
import { RouterView, useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import { useUserStore } from '@/stores/user.js'
import { useAuthStore } from '@/stores/auth.js'

const userStore = useUserStore()
const authStore = useAuthStore()

const route = useRoute()
</script>

<template>
  <div v-if="route.path.includes('admin') && userStore.user && authStore.token">
    <Navbar />
    <Sidebar />
    <div class="p-4 sm:ml-64">
      <div class="mt-14">
        <RouterView />
      </div>
    </div>
  </div>
  <div v-else>
    <RouterView />
  </div>
</template>

<style scoped></style>
