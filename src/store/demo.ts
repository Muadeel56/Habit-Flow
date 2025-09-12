import { defineStore } from 'pinia'

export const useDemoStore = defineStore('demo', {
  state: () => ({
    count: 0,
    message: 'Hello from Pinia!',
    user: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  }),

  getters: {
    doubleCount: (state) => state.count * 2,
    greeting: (state) => `Welcome, ${state.user.name}!`
  },

  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    updateMessage(newMessage: string) {
      this.message = newMessage
    },
    updateUser(userData: { name: string; email: string }) {
      this.user = { ...this.user, ...userData }
    }
  }
})
