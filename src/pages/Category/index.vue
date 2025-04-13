<template>
  <Layout>
    <div v-if="isLoading" class="w-10/12 xl:w-8/12 lg:w-8/12 md:w-10/12 mx-auto my-8">
      <Span class="text-center">Sedang Loading ... </Span>
    </div>
    <div v-else class="w-10/12 xl:w-8/12 lg:w-8/12 md:w-10/12 mx-auto my-8">
      <div class="flex justify-between items-center mb-4">
        <a class="text-blue-800 flex items-center" href="" @click.prevent="$router.back()">
          <v-icon start>mdi-arrow-left</v-icon> Kembali
        </a>
        <h2 class="text-xl font-bold">Category List</h2>
        <v-btn color="primary" @click="openModal()"> <v-icon >mdi-plus</v-icon></v-btn>
      </div>

      <table class="w-full text-left  rounded-md ">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-2 py-2">Name</th><th class="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat._id" class="border-b">
            <td class="px-2">{{ cat.name }}</td>
            <td class="px-2">
              <v-btn size="md" class="py-1 px-1" icon color="info" @click="openModal(cat)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn size="sm" class="py-1 px-1" icon color="error" @click="deleteCategory(cat.documentId)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <v-dialog v-model="modal" max-width="500">
      <v-card>
        <v-card-title>{{ editId ? 'Edit' : 'Create' }} Category</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitForm">
            <v-text-field
              v-model="form.name"
              :error-messages="errors.name"
              label="Category Name"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click.prevent="modal = false">Cancel</v-btn>
          <v-btn color="primary" @click.prevent="submitForm">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar Alert -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="1500"
      top
      right
    >
      {{ snackbar.message }}
    </v-snackbar>
  </Layout>
</template>
  
  <script lang="ts">
  import { defineComponent, ref, reactive, onMounted } from 'vue'
  import axios from 'axios'
  import { z } from 'zod'
  import Layout from '../../components/Layout.vue'
  import { Category } from '../../types/category'
  
  const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
  })
  
  export default defineComponent({
    components: { Layout },
    setup() {

      // STATE
      const token = localStorage.getItem('token') || ''
      const categories = ref<Category[]>([])
      const isLoading = ref(false)
      // Edit
      const modal = ref(false)
      const editId = ref<string | null>(null)
      // validasi Z
      const form = reactive({ name: '' })
      const errors = reactive<{ name: string[] }>({ name: [] })
      // Notif Snackbar state
      const snackbar = reactive({
        show: false,
        message: '',
        color: 'success',
      })
  

      // FUNCTION
      function getBearerToken(rawToken: string) {
        return `Bearer ${rawToken.replace(/"/g, '')}`;
      }
      const showSnackbar = (message: string, color: 'success' | 'error' = 'success') => {
        snackbar.message = message
        snackbar.color = color
        snackbar.show = true
      }
      const fetchCategories = async () => {
        isLoading.value = true
        try {
          const res = await axios.get('https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/categories', {
            headers: { Authorization: token }
          })
          categories.value = res.data.data
        } catch (err) {
          console.error('Fetch error:', err)
          showSnackbar('Failed to load categories', 'error')
        } finally {
          isLoading.value = false
        }
      }
      const openModal = (category?: Category) => {
        if (category) {
          editId.value = category.documentId
          form.name = category.name
        } else {
          editId.value = null
          form.name = ''
        }
        clearErrors()
        modal.value = true
      }
      const clearErrors = () => {
        errors.name = []
      }
      const submitForm = async () => {
        isLoading.value = true
        clearErrors()
        const validation = categorySchema.safeParse(form)
        if (!validation.success) {
          const fieldErrors = validation.error.flatten().fieldErrors
          errors.name = fieldErrors.name || []
          return
        }
        const payload = {
          data: { name: form.name }
        }
  
        try {
          if (editId.value) {
            await axios.put(`https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/categories/${editId.value}`, payload, {
              headers: { Authorization: getBearerToken(token) }
            })
            showSnackbar('Category updated successfully', 'success')
          } else {
            await axios.post('https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/categories', payload, {
              headers: { Authorization: getBearerToken(token) }
            })
            showSnackbar('Category created successfully', 'success')
          }
  
          modal.value = false
          fetchCategories()
        } catch (err) {
          console.error('Error:', err)
          showSnackbar('Failed to submit category', 'error')
        } finally {
          isLoading.value = false
        }
      }
      const deleteCategory = async (id: string) => {
        isLoading.value = true;
        try {
          await axios.delete(`https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/categories/${id}`, {
            headers: { Authorization: getBearerToken(token) }
          })
          showSnackbar('Category deleted successfully', 'success')
          fetchCategories()
        } catch (err) {
          console.error('Delete error:', err)
          showSnackbar('Failed to delete category', 'error')
        } finally {
          isLoading.value = false;
        }
      }
      onMounted(fetchCategories)
  
      return {
        categories,
        modal,
        form,
        errors,
        editId,
        snackbar,
        openModal,
        submitForm,
        deleteCategory,
        showSnackbar,
        isLoading,
        getBearerToken
      }
    }
  })
  </script>
  