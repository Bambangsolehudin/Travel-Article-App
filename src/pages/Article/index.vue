<!-- ArticlePage.vue -->
<template>
  <Layout>
    <div class="w-10/12 xl:w-8/12 mx-auto my-12">
      <!-- Header -->
      <div v-if="!isLoading" class="flex justify-between items-center">
        <a class="text-blue-800 flex items-center" href="" @click.prevent="$router.back()">
          <v-icon start>mdi-arrow-left</v-icon> Kembali
        </a>
        <v-btn color="primary" @click="openModal('create')">Add Article</v-btn>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center items-center h-[50vh]">
        <v-progress-circular indeterminate color="primary" /> Sedang Loading...
      </div>

      <!-- Empty -->
      <div v-if="articles.length === 0 && !isLoading">Tidak ada artikel.</div>

      <!-- Article List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-8">
        <div v-for="article in articles" :key="article.title" class="p-4 rounded border shadow bg-white">
          <img :src="article.cover_image_url" class="w-full h-40 object-cover rounded mb-2" />
          <div class="px-2">
            <h3 class="text-lg font-bold">{{ article.title }}</h3>
            <p class="text-sm text-gray-600">{{ formatDate(article.createdAt) }}</p>
            <div class="my-2 flex justify-end gap-2">
              <v-btn icon size="small" color="info" @click="$router.push(`/Article/${article.documentId}`)">
                <v-icon size="18">mdi-eye</v-icon>
              </v-btn>
              <v-btn icon size="small" color="warning" @click="openModal('edit', article)">
                <v-icon size="18">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon size="small" color="error" @click="deleteArticle(article.documentId)">
                <v-icon size="18">mdi-delete</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="!isLoading" class="text-center mt-4">
        <v-btn color="secondary" @click="loadMore">Load More</v-btn>
      </div>
    </div>

    <!-- Article Modal -->
    <v-dialog v-model="showModal" max-width="600">
      <v-card>
        <v-card-title>
          <span class="text-lg font-semibold">{{ isEditing ? 'Edit' : 'Add' }} Article</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="form.title" label="Title" :error-messages="errors.title" required />
          <v-textarea v-model="form.description" label="Description" rows="4" :error-messages="errors.description" required />
          <v-text-field v-model="form.cover_image_url" label="Cover Image URL" :error-messages="errors.cover_image_url" required />
          <v-select
            v-if="!isEditing"
            v-model="form.category"
            :items="categories"
            item-title="name"
            item-value="id"
            label="Category"
            :error-messages="errors.category"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeModal">Cancel</v-btn>
          <v-btn color="primary" @click="submitForm">{{ isEditing ? 'Update' : 'Create' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Error Modal -->
    <v-dialog v-model="showError" max-width="400">
      <v-card>
        <v-card-title class="text-red-600 font-semibold">Error</v-card-title>
        <v-card-text>{{ errorMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="showError = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" top right>
      {{ snackbarText }}
    </v-snackbar>
  </Layout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Layout from '../../components/Layout.vue'
import { useAuthStore } from '../../store/auth'
import type { Article } from '../../types/article'
import type { Category } from '../../types/category'
import moment from 'moment'
import { z } from 'zod'

const auth = useAuthStore()
const token = auth.token

const articles = ref<Article[]>([])
const categories = ref<Category[]>([])
const form = ref({ title: '', description: '', cover_image_url: '', category: null })
const errors = ref<Record<string, string>>({})
const showModal = ref(false)
const isEditing = ref(false)
const selectedId = ref<string | null>(null)
const page = ref(1)
const pageSize = 10
const isLoading = ref(true)
const showError = ref(false)
const errorMessage = ref('')
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const articleSchema = z.object({
  title: z.string().min(5, 'Title minimal 5 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  cover_image_url: z.string().url('URL tidak valid'),
  category: isEditing.value ? z.number({ invalid_type_error: 'Category is required' }) : z.number().optional(),
})

const formatDate = (date: string) => moment(date).format('DD MMMM YYYY, HH:mm')

const showSnackbar = (message: string, color = 'success') => {
  snackbarText.value = message
  snackbarColor.value = color
  snackbar.value = true
}

const fetchArticles = async () => {
  isLoading.value = true
  try {
    const res = await axios.get('https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles', {
      headers: { Authorization: token },
      params: { 'pagination[page]': page.value, 'pagination[pageSize]': pageSize }
    })
    articles.value.push(...res.data.data)
  } catch (err) {
    errorMessage.value = err.response?.data?.error?.message || 'Gagal memuat artikel.'
    showError.value = true
  } finally {
    isLoading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const res = await axios.get('https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/categories', {
      headers: { Authorization: token }
    })
    categories.value = res.data.data
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Gagal memuat kategori'
    showError.value = true
  }
}

const loadMore = () => {
  page.value++
  fetchArticles()
}

const openModal = (mode: 'create' | 'edit', article?: Article) => {
  isEditing.value = mode === 'edit'
  showModal.value = true
  errors.value = {}

  if (article) {
    selectedId.value = article.documentId
    form.value = { title: article?.title, description: article?.description, cover_image_url: article?.cover_image_url }
  } else {
    selectedId.value = null
    form.value = { title: '', description: '', cover_image_url: '', category: null }
  }
}

const closeModal = () => (showModal.value = false)


const submitForm = async () => {
  errors.value = {}
  const result = articleSchema.safeParse(form.value)
  if (!result.success) {
    result.error.errors.forEach((err) => {
      const field = err.path[0] as string
      errors.value[field] = err.message
    })
    showSnackbar('Validasi gagal.', 'error')
    return
  }
  console.log('hallo bandung');
  
  const tokenData = 'Bearer ' + JSON.parse(token)
  const payload = { data: { ...form.value, category: isEditing.value ? Number(form.value.category) : form.value.category } }

  try {
    if (isEditing.value && selectedId.value) {
      await axios.put(`https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles/${selectedId.value}`, payload, {
        headers: { Authorization: tokenData }
      })
    } else {
      await axios.post(`https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles`, payload, {
        headers: { Authorization: tokenData }
      })
    }

    closeModal()
    articles.value = []
    page.value = 1
    fetchArticles()
    showSnackbar(isEditing.value ? 'Artikel Updated!' : 'Artikel Created!')
  } catch (err) {
    errorMessage.value = err.response?.data?.error?.message || 'Gagal menyimpan artikel.'
    showError.value = true
    showSnackbar(errorMessage.value, 'error')
  }
}

const deleteArticle = async (id: string) => {
  if (!confirm('Yakin ingin menghapus artikel ini?')) return
  try {
    await axios.delete(`https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles/${id}`, {
      headers: { Authorization: 'Bearer ' + JSON.parse(token) }
    })
    articles.value = []
    page.value = 1
    fetchArticles()
    showSnackbar('Artikel Deleted!')
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Gagal menghapus artikel.'
    showError.value = true
    showSnackbar(errorMessage.value, 'error')
  }
}

onMounted(() => {
  fetchArticles()
  fetchCategories()
})
</script>
