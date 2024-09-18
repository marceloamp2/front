import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => {
    return {
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    }
  },
  actions: {
    storeUser(payload) {
      this.user = payload
      localStorage.setItem('user', JSON.stringify(payload))
    },
    deleteUser() {
      this.user = null
      localStorage.removeItem('user')
    }
  }
})
