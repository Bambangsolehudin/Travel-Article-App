<template>
  <Layout>
    <div class="mt-10 mx-auto px-6 max-w-screen-lg">
      <!-- Welcome Section -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-indigo-800">Selamat Datang di B-ARTICLE 🎉</h1>
        <p class="text-gray-600 mt-2">Kelola kategori, artikel, dan komentar dengan mudah!</p>
      </div>

      <!-- Grid Menu -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          class="bg-white hover:bg-indigo-600 hover:text-white text-indigo-800 border rounded-lg p-6 flex flex-col items-center justify-center shadow transition-all duration-300 cursor-pointer"
          @click.prevent="$router.push('/Category')"
        >
          <v-icon size="32" class="mb-2">mdi-folder</v-icon>
          <p class="text-base font-semibold">Category</p>
        </div>

        <div
          class="bg-white hover:bg-indigo-500 hover:text-white text-indigo-700 border rounded-lg p-6 flex flex-col items-center justify-center shadow transition-all duration-300 cursor-pointer"
          @click.prevent="$router.push('/Article')"
        >
          <v-icon size="32" class="mb-2">mdi-file-document-edit</v-icon>
          <p class="text-base font-semibold">Article</p>
        </div>

        <div
          class="bg-white hover:bg-indigo-500 hover:text-white text-indigo-700 border rounded-lg p-6 flex flex-col items-center justify-center shadow transition-all duration-300 cursor-pointer"
          @click.prevent="$router.push('/Comment')"
        >
          <v-icon size="32" class="mb-2">mdi-comment-text</v-icon>
          <p class="text-base font-semibold">Comment</p>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'


</script>
