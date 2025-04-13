<route lang="yaml">
    meta:
        requiresAuth: true
</route>
<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-gray-800">
    <!-- Header -->
    <header class="px-8 py-5 text-white shadow-lg shadow-b bg-white">
      <div class="flex justify-between items-center">
        <router-link to="/" class="flex items-center space-x-4">
          <img class="w-6 h-6 object-cover rounded-lg" src="/favicon.ico" alt="Logo" />
          <h6 class="text-lg font-semibold text-gray-800">
            B-ARTICLE
          </h6>
        </router-link>

        <div class="flex items-center space-x-4">
          <div
            v-for="(item, index) in routingData"
            :key="index"
            @click="handleClick(item)"
            class="flex items-center space-x-2 text-red-800 font-semibold  hover:underline"
          >
            <v-icon color="error" size="16">mdi-logout</v-icon>
            {{ item.name }}
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow container">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="shadow-xl p-4 text-white text-center">
      <p class="text-sm text-slate-800 dark:text-white">&copy; 2025 Bambang Solehudin</p>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const auth = useAuthStore()

    const routingData = [
      { name: 'Logout', action: true },
    ]
    const handleClick = (item: { name: string, action?: boolean }) => {
      if (item.action && item.name === 'Logout') {
        auth.logout()
        router.push('/Auth/Login')
      }
    }
    return { route, routingData, handleClick }
  }
})
</script>