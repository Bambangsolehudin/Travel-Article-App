import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import { useAuthStore } from '../store/auth' // pastikan path ini sesuai

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Middleware untuk autentikasi
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  console.log('route', to.name);
  

  const isAuthenticated = !!auth.token // Cek jika ada token di store

  // Jika route butuh login dan user belum login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/Auth/Login') // Arahkan ke halaman login
  }

  // Jika route hanya boleh diakses oleh guest (login) dan user sudah login
  if (to.meta.guestOnly && isAuthenticated) {
    return next('/') // Arahkan ke halaman beranda jika sudah login
  }

  // Jika halaman login dan sudah ada token (user sudah login)
  if (to.name === '/Auth/Login' && isAuthenticated) {
    return next('/') // Redirect ke beranda jika sudah login
  }

  next() // Lanjutkan jika tidak ada masalah
})

// Error handling dinamis untuk vite
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
