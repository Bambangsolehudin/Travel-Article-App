<template>
  <Layout>
    <div class="container my-8 mx-auto w-11/12 xl:w-8/12 lg:w-8/12 md:w-8/12">
      <!-- Komentar -->
      <!-- <div v-if="isLoading" class="w-10/12 xl:w-8/12 lg:w-8/12 md:w-10/12 mx-auto my-8">
        <Span class="text-center">Sedang Loading ... </Span>
      </div> -->
      <div>
        <a class="text-blue-800 flex items-center" href="" @click.prevent="$router.back()">
          <v-icon start>mdi-arrow-left</v-icon> Kembali
        </a>
        <h2 class="text-2xl font-semibold my-4">Comments</h2>
  
        <!-- Form komentar baru -->
        <div class="mb-6">
          <v-textarea
            v-model="newComment"
            label="Tulis komentar..."
            outlined
            rows="3"
            color="darkblue darken-3"
            class="mb-2"
            :error-messages="commentErrors.newComment"
          />

          <v-autocomplete
            v-model="selectedArticle"
            v-model:search-input="searchTitle"
            :items="articles"
            item-title="title"
            item-value="id"
            label="Pilih Judul Artikel"
            outlined
            dense
            color="primary"
            :loading="loadingArticles"
            @update:search-input="fetchArticles"
            :error-messages="commentErrors.selectedArticle"
          />


          <button
            @click="addComment"
            style="background-color: darkblue;"
            class=" text-white px-4 py-2 rounded"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Loading..' : 'Kirim' }} 
          </button>
        </div>
  
        <!-- Daftar komentar -->
        <div v-if="comments.length > 0">
          <div
            v-for="(comment, index) in comments"
            :key="index"
            class="px-4 py-4 mb-4 border rounded-md bg-gray-50"
          >
            <p class="text-gray-800 mb-2">{{ comment.content }}</p>
            <p class="text-sm text-gray-500 mb-2">{{ formatDate(comment.createdAt) }}</p>
            <div class="flex gap-2">
              <v-btn
                color="orange"
                density="compact"
                size="small"
                class="text-white"
                @click="startEditingComment(comment)"
              >
                Edit
              </v-btn>

              <v-btn
                color="red"
                variant="text"
                density="compact"
                size="small"
                @click="deleteComment(comment.documentId)"
              >
                Hapus
              </v-btn>

            </div>
          </div>
        </div>

        <div class="text-center mt-4">
            <v-btn color="secondary" @click="loadMore">Load More</v-btn>
        </div>
      </div>
    </div>
      <!-- Modal Edit Komentar -->
    <v-dialog v-model="editDialog" max-width="600px" persistent transition="dialog-bottom-transition">
      <v-card>
        <v-card-title class="text-lg font-semibold">Edit Komentar</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="editingCommentContent"
            label="Edit komentar..."
            rows="4"
            outlined
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" text @click="cancelEdit">Batal</v-btn>
          <v-btn color="primary" @click="updateComment">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="1000"
      top
      right
    >
      {{ snackbarText }}
    </v-snackbar>
  </Layout>
</template>
  
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue'
  import { z } from 'zod'


//   import { useRoute } from 'vue-router'
  import axios from 'axios'
  import moment from 'moment'
  import { useAuthStore } from '../../store/auth'
  import Layout from '../../components/Layout.vue'
  import type { Article } from '../../types/article'
  import type { Comment } from '../../types/comment'

  

  
  export default defineComponent({
    components: { Layout },

    setup() {
    //   const route = useRoute()
      const auth = useAuthStore()
      const token = auth.token
  
      const comments = ref<Comment[]>([])
      const newComment = ref('')
      const article = ref('')
      const page = ref(1)
      const editingComment = ref<Comment | null>(null)
      const editingCommentContent = ref('')
      // article
      const articles = ref<Article[]>([])
      const selectedArticle = ref<number | null>(null)
      const searchTitle = ref('')

      //Notif
      const snackbar = ref(false)
      const snackbarText = ref('')
      const snackbarColor = ref('success')

      // edit modal
      const editDialog = ref(false)

      const isLoading = ref(false)


      const commentSchema = z.object({
        newComment: z.string().min(1, 'Komentar tidak boleh kosong'),
        selectedArticle: z.number().min(1, 'Pilih salah satu artikel'),
      })

      const commentErrors = ref<Record<string, string[]>>({})

      const validateComment = () => {
        const result = commentSchema.safeParse({
          newComment: newComment.value,
          selectedArticle: selectedArticle.value,
        })

        if (!result.success) {
          const fieldErrors: Record<string, string[]> = {}
          result.error.errors.forEach((err) => {
            const field = err.path[0] as string
            if (!fieldErrors[field]) fieldErrors[field] = []
            fieldErrors[field].push(err.message)
          })
          commentErrors.value = fieldErrors
          return false
        }

        commentErrors.value = {}
        return true
      }

      
      const showSnackbar = (message: string, color: string = 'success') => {
        snackbarText.value = message
        snackbarColor.value = color
        snackbar.value = true
      }
  
      const loadMore = () => {
        page.value++
        fetchComments()
      }
      const fetchComments = async () => {
        isLoading.value = true;
        try {
          const res = await axios.get(`https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/comments`, {
            headers: { Authorization: 'Bearer ' + JSON.parse(token) },
            params: {
              'pagination[page]': page.value,
              'pagination[pageSize]': 10
            }
  
          })
          comments.value.push(...res.data.data)
        } catch (error) {
          console.error('Gagal menambahkan komentar:', error)
          showSnackbar(error?.response?.data?.error?.message || 'Something went wrong', 'error')
        } finally {
          isLoading.value= false
        }
        // const id = route.params.id
      }
  
      const addComment = async () => {
        isLoading.value = true
        if (!validateComment()) return

        try {
          await axios.post(
            'https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/comments',
            {
              data: {
                content: newComment.value,
                article: selectedArticle.value,
              }
            },
            {
              headers: { Authorization: 'Bearer ' + JSON.parse(token) }
            }
          )

          newComment.value = ''
          selectedArticle.value = null
          showSnackbar('Comment Created!')
          fetchComments()
        } catch (error) {
          console.error('Gagal menambahkan komentar:', error)
          showSnackbar(error?.response?.data?.error?.message || 'Something went wrong', 'error')
        } finally {
          isLoading.value= false
        }
      }

      const startEditingComment = (comment: Comment) => {
        editingComment.value = comment
        editingCommentContent.value = comment.content
        editDialog.value = true
      }
  
      const cancelEdit = () => {
        editingComment.value = null
        editingCommentContent.value = ''
        editDialog.value = false
      }
  
      const updateComment = async () => {
        isLoading.value = true

        if (!editingComment.value) return

        try {
          await axios.put(
            `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/comments/${editingComment.value.id}`,
            {
              data: {
                content: editingCommentContent.value
              }
            },
            {
              headers: { Authorization: 'Bearer ' + JSON.parse(token) }
            }
          )

          cancelEdit()
          showSnackbar('Comment Updated!')
          fetchComments()
        } catch (error) {
          console.error('Gagal mengupdate komentar:', error)
          showSnackbar(error?.response?.data?.error?.message || 'Something went wrong', 'error')
        } finally {
          isLoading.value = false;
        }
      }

  
      const deleteComment = async (id: number) => {
        isLoading.value = true
        try {
          await axios.delete(
            `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/comments/${id}`,
            {
              headers: { Authorization: 'Bearer ' + JSON.parse(token) }
            }
          )
          showSnackbar('Comment Deleted!')
          fetchComments()
        } catch (error) {
          console.error('Gagal menghapus komentar:', error)
          showSnackbar(error?.response?.data?.error?.message || 'Something went wrong', 'error')
        } finally {
          isLoading.value = false
        }
      }

  
      const formatDate = (dateStr: string) => {
        return moment(dateStr).format('DD MMM YYYY, HH:mm')
      }

      const fetchArticles = async () => {
          isLoading.value = true
          try {
            const response = await axios.get('https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles', {
              headers: { Authorization: 'Bearer ' + JSON.parse(token) },
              params: {
                populate: '*',
                
                filters: {
                  title: { $containsi: searchTitle.value },
                }
              }
            })

            articles.value = response.data.data.map((item: Article) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              cover_image_url: item.cover_image_url,
              category: item.category || 0,
              documentId: item.id,
              createdAt: item.createdAt
            }))
          } catch (error) {
            console.error('Error fetching articles:', error)
          } finally {
            isLoading.value = false
          }
  }
  
      onMounted(() => {
        fetchComments();
        fetchArticles();
      })
  
      return {
        comments,
        newComment,
        editingComment,
        editingCommentContent,
        addComment,
        startEditingComment,
        updateComment,
        deleteComment,
        cancelEdit,
        formatDate,
        article,
        loadMore,
        articles,
        selectedArticle,
        snackbar,
        snackbarText,
        snackbarColor,
        showSnackbar,
        editDialog,
        commentErrors,
        isLoading,
      }
    }
  })
  </script>
  