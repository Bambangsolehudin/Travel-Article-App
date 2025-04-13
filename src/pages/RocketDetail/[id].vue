<template>
  <div class="max-w-3xl mx-auto py-6 px-6">
    <LoadingSpinner v-if="loading" />
    <div v-else-if="error" class="text-center text-red-500">Error loading rocket details.</div>
    <div v-else-if="rocket" class="bg-white shadow-lg rounded-lg px-6 py-6">
      <h1 class="text-2xl font-bold text-center mb-4">
        <span @click="goBack" class="text-gray-500 cursor-pointer text-sm">&larr; &nbsp; Kembali</span> 
        {{ rocket.name }}
      </h1>
      <hr class="my-4" />
      <img :src="rocket.flickr_images[0]" alt="Rocket Image" class="w-full h-64 object-cover rounded mb-4" />
      <p class="text-gray-700 mb-4">{{ rocket.description }}</p>
      <div class="bg-gray-100 py-4 px-4 rounded">
        <p><strong>Cost per launch:</strong> {{ rocket.cost_per_launch }}</p>
        <p><strong>Country:</strong> {{ rocket.country }}</p>
        <p><strong>First flight:</strong> {{ rocket.first_flight }}</p>
      </div>
    </div>
    <div v-else class="text-center text-gray-500">Rocket not found.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; 
import { getRockets } from '../../services/rocketService'; 
import type { Rocket } from '../../types/rocket'; 

const route = useRoute();
const router = useRouter();
const rocketId = route.params.id;
const rocket = ref<Rocket | null>(null);
const loading = ref(true);
const error = ref(false);


const goBack = () => {
  router.back();
};

onMounted(async () => {
  loading.value = true;
  error.value = false;
  try {
    const rockets = await getRockets();
    rocket.value = rockets.find((r) => r.id === rocketId) || null;
    loading.value = false;
  } catch (err) {
    console.log(err);
    error.value = true;
    loading.value = false;
  }
});
</script>