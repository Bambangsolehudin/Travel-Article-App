<route lang="yaml">
  meta:
    requiresAuth: true
</route>
<template>
  <div class="max-w-3xl mx-auto px-6">
    <h1 class="text-2xl font-bold mb-6 text-center mt-10">Rocket List</h1>
    <RocketForm v-if="showForm" @save="addRocket" @close="closeForm" />
    <div class="flex justify-end mb-4">
      <div @click="openForm" class="bg-indigo-600 text-white shadow-lg cursor-pointer px-4 py-2 rounded shadow">+ Add Rocket</div>
    </div>
    <input v-model="filterText" placeholder="Filter rockets by Name" class="w-full py-2 px-2 border border-gray-300 rounded mb-4" />
    <LoadingSpinner v-if="loading" />
    <div v-else-if="error" class="text-center text-red-500">
      Error loading rockets.
      <button @click="fetchRockets" class="bg-red-500 text-white px-4 py-2 rounded mt-2">Retry</button>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
      <div v-for="rocket in filteredRockets" :key="rocket.id" class="border rounded shadow hover:bg-black hover:text-white">
        <router-link :to="`/RocketDetail/${rocket.id}`" class="block">
          <img :src="rocket.flickr_images[0]" alt="Rocket Image" class="w-full h-40 object-cover rounded mb-4" />
          <div class="px-4 py-4">
            <h2 class="text-lg font-semibold mb-2">{{ rocket.name }}</h2>
            <p class="text-sm hover:text-white text-gray-600 line-clamp-3">{{ rocket.description }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { getRockets } from '../services/rocketService';
import type { Rocket } from '../types/rocket';
import RocketForm from '../components/RocketForm.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import { useAuthStore } from '../store/auth'


export default defineComponent({
  components: {
    RocketForm,
    LoadingSpinner
  },
  setup() {
    const rockets = ref<Rocket[]>([]);
    const loading = ref(true);
    const error = ref(false);
    const filterText = ref('');
    const showForm = ref(false);
    const auth = useAuthStore()

    const fetchRockets = async () => {
      console.log('auth', auth.user);
      
      loading.value = true;
      error.value = false;
      try {
        rockets.value = await getRockets();
        loading.value = false;
      } catch (err) {
        console.log(err);
        error.value = true;
        loading.value = false;
      }
    };

    const filteredRockets = computed(() => {
      return rockets.value.filter((rocket) =>
        rocket.name.toLowerCase().includes(filterText.value.toLowerCase())
      );
    });

    const addRocket = (newRocket: Rocket) => {
      rockets.value.push(newRocket);
      showForm.value = false;
    };
    const openForm = () => {
      showForm.value = true;
    };
    const closeForm = () => {
      showForm.value = false;
    };

    onMounted(fetchRockets);

    return {
      rockets,
      loading,
      error,
      fetchRockets,
      filteredRockets,
      filterText,
      addRocket,
      showForm,
      openForm,
      closeForm,
    };
  },
});
</script>