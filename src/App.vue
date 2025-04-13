<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useAuthStore } from './store/auth'

export default defineComponent({
  setup() {
    const authStore = useAuthStore()

    // Muat user data saat aplikasi pertama kali dimuat
    onMounted(() => {
      authStore.loadUser()
    })

    return {
      authStore,
    }
  },
})
</script>
