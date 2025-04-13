import { defineStore } from 'pinia'

interface User {
  id: number
  username: string
  email: string
}

interface AuthPayload {
  token: string
  user: User
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
  }),
  actions: {
    login(payload: AuthPayload) {
      localStorage.setItem('token', JSON.stringify(payload.token))
      localStorage.setItem('user', JSON.stringify(payload.user))
      this.token = payload.token
      this.user = payload.user
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    loadUser() {
      const userData = localStorage.getItem('user')
      const tokenData = localStorage.getItem('token')

      if (userData && tokenData) {
        this.user = JSON.parse(userData)
        this.token = tokenData
      }
    },
  },
  getters: {
    isAuthenticated: (state) => state.user !== null,
  },
})
