import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify' // ← pastikan ada
import router from './router'
import './style.css'
import { useAuthStore } from '../src/store/auth'



// Buat aplikasi Vue
const app = createApp(App)

// Inisialisasi Pinia store dan router
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(vuetify) // ← ini WAJIB untuk bisa pakai komponen <v-...>

// Panggil loadUser di store untuk memuat user dan token saat aplikasi dimulai
const authStore = useAuthStore()
authStore.loadUser()

// Mount aplikasi
app.mount('#app')
