import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', {
  state: () => {
    return {
      token: localStorage.getItem('token') ? localStorage.getItem('token') : null
    }
  },
  actions: {
    storeToken(payload) {
      this.token = payload
      localStorage.setItem('token', this.token)
    },
    deleteToken() {
      this.token = null
      localStorage.removeItem('token')
    }
  }
})
