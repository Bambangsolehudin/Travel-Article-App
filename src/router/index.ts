import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/index.vue'
import Login from '../pages/Auth/Login.vue'
import Register from '../pages/Auth/Register.vue'
import Article from '../pages/Article/index.vue'
import DetailArticle from '../pages/Article/[id].vue'
import Category from '../pages/Category/index.vue'
import Comment from '../pages/Comment/index.vue'






import { useAuthStore } from '@/store/auth'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/Article',
    name: 'Article',
    component: Article,
    meta: { requiresAuth: true }
  },
  {
    path: '/Article/:id',
    name: 'DetailArticle',
    component: DetailArticle,
    meta: { requiresAuth: true }
  },
  {
    path: '/Category',
    name: 'Category',
    component: Category,
    meta: { requiresAuth: true }
  },
  {
    path: '/Comment',
    name: 'Comment',
    component: Comment,
    meta: { requiresAuth: true }
  },
  {
    path: '/Auth/Login',
    name: 'Login',
    component: Login
  },
  {
    path: '/Auth/Register',
    name: 'Register',
    component: Register
  },
  // tambahin route lain di sini
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Middleware untuk ngecek token
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // Debug log
  console.log('Navigating to:', to.path)
  console.log('Meta:', to.meta)

  if (to.meta.requiresAuth && !auth.token) {
    next('/Auth/Login')
  } else {
    next()
  }
})

export default router
