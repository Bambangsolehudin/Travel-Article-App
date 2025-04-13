<route lang="yaml">
  meta:
  guestOnly: true
</route>
<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="flex w-full bg-white rounded-2xl overflow-hidden">
      <div class="xl:w-2/12 lg:w-2/12"></div>
      <div class="w-full xl:w-3/12 lg:w-3/12 md:w-12/12 sm:w-12/12 p-6 flex flex-col justify-center">
        <div class="flex gap-2 justify-center mb-6">
          <img class="w-6 h-6 object-cover rounded-lg" src="/favicon.ico" alt="Logo" />
          <h6 class="text-lg font-semibold text-gray-800">
              B-ARTICLE
          </h6>
        </div>
        <h2 class="text-2xl text-center text-gray-700 mb-6">Login untuk memulai</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <input
                v-model="email"
                type="email"
                placeholder="Email"
                class="w-full pl-4 pr-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
            <p v-if="errors.email" class="text-sm text-red-600">{{ errors.email }}</p>
          </div>
          <div class="mb-4">
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="w-full pl-4 pr-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
            <p v-if="errors.password" class="text-sm text-red-600">{{ errors.password }}</p>
          </div>
          <button
            v-if="!isLoading"
            type="submit"
            style="background-color: darkblue;"
            class="w-full text-center text-white border py-2 rounded-lg  transition disabled:opacity-50"
          >
            Masuk
          </button>
          <button
            v-if="isLoading"
            type="submit"
            style="background-color: darkblue;"
            disabled
            class="w-full text-center text-white border py-2 rounded-lg  transition disabled:opacity-50"
          >
            Sedang Loading ...
          </button>
        </form>
        <h6 class="text-sm mt-6 text-center text-gray-400 mb-6">
          Belum punya akun? Registrasi <a href="/Auth/Register" class="text-indigo-900">disini</a>
        </h6>
      </div>
      <div class="xl:w-1/12 lg:w-2/12"></div>
      <div class="hidden md:block md:w-6/12 h-screen bg-cover bg-center bg-[url('/login.jpg')]"></div>
    </div>
  </div>

  <!-- Snackbar Alert -->
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    timeout="1000"
    top
    right
  >
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useAuthStore } from '../../store/auth'
import { z } from 'zod'
import axios from 'axios'
import { useRouter } from 'vue-router'



const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(3, { message: 'Password minimal 3 karakter' }),
})

export default defineComponent({
  
  setup() {
    const email = ref<string>('')
    const password = ref<string>('')
    const errors = reactive<{ email?: string; password?: string; general?: string }>({})
    const authStore = useAuthStore()
    const isLoading = ref(false)
    const router = useRouter()


    const snackbar = reactive({
      show: false,
      message: '',
      color: 'success',
    })


    
    const showSnackbar = (message: string, color: 'success' | 'error' = 'success') => {
      snackbar.message = message
      snackbar.color = color
      snackbar.show = true
    }

    const handleLogin = async () => {
      errors.email = ''
      errors.password = ''
      errors.general = ''

      const result = loginSchema.safeParse({ email: email.value, password: password.value })
      if (!result.success) {
        result.error.errors.forEach(err => {
          if (err.path[0] === 'email') errors.email = err.message
          if (err.path[0] === 'password') errors.password = err.message
        })
        return
      }

      try {
        isLoading.value = true
        const response = await axios.post('https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/auth/local', {
          identifier: email.value,
          password: password.value,
        })
        authStore.login({
          token : response.data.jwt,
          user : response.data.user
        })
        showSnackbar('Login successfully', 'success')
        router.push('/')
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.data?.error) {
          errors.general = err.response.data.error.message || 'Login gagal.'
        } else {
          errors.general = 'Terjadi kesalahan saat login.'
        }
        showSnackbar(err?.response?.data?.error?.message || 'Something went wrong', 'error')
      } finally {
        isLoading.value = false;
      }
    }

    return {
      email,
      password,
      errors,
      handleLogin,
      isLoading,
      snackbar,
      showSnackbar,
    }
  },
})
</script>
