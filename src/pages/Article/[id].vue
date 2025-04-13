<template>
  <Layout>
    <div class="max-w-3xl px-4 my-8 mx-auto p-4">
      <div v-if="isLoading" class="text-center text-gray-500">Loading...</div>
      <div v-else-if="article" class="space-y-4">
        <a class="text-blue-800 flex items-center" href="" @click.prevent="$router.back()">
          <v-icon start>mdi-arrow-left</v-icon> Kembali
        </a>
        <h1 class="text-3xl font-bold mt-4">{{ article.title }}</h1>
        <img
          :src="article.cover_image_url"
          alt="cover"
          class="w-full rounded-lg max-h-96 object-cover"
        />
        <span class="text-md text-gray-600">{{ formatDate(article.createdAt) }}</span>
        <!-- <p class="text-sm text-gray-500">
          Kategori: {{ article.category.name }} | Diposting: {{ formatDate(article.createdAt) }}
        </p> -->
        <div class="prose max-w-none my-6">
          {{ article.description }}
        </div>
      </div>
      <div v-else class="text-red-500">Artikel tidak ditemukan.</div>
      <div>
        {{ article?.description }}
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import moment from 'moment'
import { useAuthStore } from '../../store/auth'
import { Article } from '../../types/article'
import Layout from '../../components/Layout.vue';


export default defineComponent({
  components: { Layout },
  setup() {
    const route = useRoute()
    const auth = useAuthStore()
    const token = auth.token

    const article = ref<Article | null>(null)
    const isLoading = ref(true)

    const fetchArticleDetail = async () => {
      try {
        isLoading.value = true
        const id = route.params.id

        const res = await axios.get(`https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles/${id}`, {
          headers: {
            Authorization: 'Bearer ' + JSON.parse(token),
          },
          params: {
            populate: '*'
          }
        })
        
        

        const data = res.data.data
        
        article.value = {
          id: data.id,
          title: data.title,
          description: data.description,
          cover_image_url: data.cover_image_url,
          createdAt: data.createdAt,
          documentId: data.documentId,
          category: null,
        }

        console.log('detail', article);

      } catch (error) {
        console.error('Gagal mengambil detail artikel:', error)
      } finally {
        isLoading.value = false
      }
    }

    const formatDate = (date: string) => {
      return moment(date).format('DD MMMM YYYY, HH:mm')
    }

    onMounted(fetchArticleDetail)

    return {
      article,
      isLoading,
      formatDate
    }
  }
})
</script>
