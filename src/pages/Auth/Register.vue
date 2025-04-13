<route lang="yaml">
    meta:
    guestOnly: true
</route>
<template>
  <div className="flex min-h-screen items-center justify-center">
    <div className="flex w-full bg-white rounded-2xl overflow-hidden">
      <div className="xl:w-2/12 lg:w-2/12"></div>
      
      <div className="w-full xl:w-3/12 lg:w-3/12 md:w-12/12 sm:w-12/12 p-6 flex flex-col justify-center">
        <div class="flex gap-2 justify-center mb-6">
          <img class="w-6 h-6 object-cover rounded-lg" src="/favicon.ico" alt="Logo" />
          <h6 class="text-lg font-semibold text-gray-800">
            B-ARTICLE
          </h6>
        </div>
  
        <h2 className="text-2xl text-center text-gray-700 mb-6">Silahkan Registrasi</h2>

        <form @submit.prevent="handleSubmit">
          <div className="mb-4 relative">
            <input
              v-model="form.email"
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
            <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
          </div>

          <div className="mb-4 relative">
            <input
              v-model="form.username"
              type="text"
              placeholder="Username"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
            <p v-if="errors.username" class="text-sm text-red-500">{{ errors.username }}</p>
          </div>

          <div className="mb-4 relative">
            <input
              v-model="form.password"
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
            <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
          </div>

          <button
            v-if="!isLoading"
            type="submit"
            style="background-color: darkblue;"
            class="w-full text-center text-white border py-2 rounded-lg  transition disabled:opacity-50"
          >
            Registrasi
          </button>
          <button
            v-else
            style="background-color: darkblue;"
            disabled
            class="w-full text-center text-white border py-2 rounded-lg  transition disabled:opacity-50"
          >
            Sedang Loading ...
          </button>

        </form>

        <h6 className="text-sm mt-6 text-center text-gray-400 mb-6">
          sudah punya akun? Login <a href="/Auth/Login" className="text-indigo-900">disini</a>
        </h6>
      </div>

      <div className="xl:w-1/12 lg:w-2/12"></div>

      <div className="hidden md:block md:w-6/12 h-screen bg-cover bg-center bg-[url('/login.jpg')]"></div>
    </div>
  </div>

  
  <!-- Snackbar Alert -->
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    timeout="2000"
    top
    right
  >
    {{ snackbar.message }}
  </v-snackbar>
</template>
  
<script lang="ts" setup>
  import { ref, reactive } from 'vue'
  // import { useRouter } from 'vue-router'
  import { z } from 'zod'
  import axios from 'axios'
  import type { RegisterForm } from '../../types/registerForm'
  
  // const router = useRouter()
  const isLoading = ref(false)
  const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
  })

  
  
  const form = ref<RegisterForm>({
    email: '',
    username: '',
    password: ''
  })
  
  const errors = ref<{ [key: string]: string }>({})
  
  const schema = z.object({
    email: z.string().email({ message: 'Email tidak valid' }),
    username: z.string().min(3, { message: 'Username minimal 3 karakter' }),
    password: z.string().min(3, { message: 'Password minimal 3 karakter' }),
  })

  const showSnackbar = (message: string, color: 'success' | 'error' = 'success') => {
      snackbar.message = message
      snackbar.color = color
      snackbar.show = true
  }
  
  const handleSubmit = async () => {
    isLoading.value = true
    const result = schema.safeParse(form.value)
    if (!result.success) {
      const errMap: { [key: string]: string } = {}
      result.error.errors.forEach(err => {
        const field = err.path[0] as string
        errMap[field] = err.message
      })
      errors.value = errMap
      return
    }
  
    try {
      const data  = await axios.post('https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/auth/local/register', {
        email: form.value.email,
        username: form.value.username,
        password: form.value.password
      })
      console.log(data);
      
      showSnackbar('Registration successfully, Lets Login..', 'success')
      // await router.push('/Auth/Login')

      form.value = {
        email: '',
        username: '',
        password: ''
      }
  
    } catch (err: unknown) {
        let apiMessage = 'Terjadi kesalahan saat login.';

        if (axios.isAxiosError(err)) {
          apiMessage = err.response?.data?.error?.message || apiMessage;
        }

        showSnackbar(apiMessage, 'error');
      } finally {
      isLoading.value = false
    }
  }
  </script>
  