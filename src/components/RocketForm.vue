<template>
    <div class="form-overlay">
      <div class="form-container">
        <h2 class="form-title">Add New Rocket</h2>
        <label for="">Name</label>
        <input v-model="rocket.name" placeholder="Name" class="form-input" />
        <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
  
        <label for="">Description</label>
        <textarea v-model="rocket.description" placeholder="Description" class="form-textarea"></textarea>
        <p v-if="errors.description" class="error-message">{{ errors.description }}</p>
  
        <label for="">Image URL</label>
        <input v-model="rocket.flickr_images[0]" placeholder="Image URL" class="form-input" />
        <p v-if="errors.flickr_images" class="error-message">{{ errors.flickr_images }}</p>
  
        <label for="">Cost per Launch</label>
        <input type="number" min="0" v-model="rocket.cost_per_launch" placeholder="Cost per Launch" class="form-input" />
        <p v-if="errors.cost_per_launch" class="error-message">{{ errors.cost_per_launch }}</p>
  
        <label for="">Country</label>
        <input v-model="rocket.country" placeholder="Country" class="form-input" />
        <p v-if="errors.country" class="error-message">{{ errors.country }}</p>
  
        <label for="">First Flight</label>
        <input v-model="rocket.first_flight" placeholder="First Flight" class="form-input" />
        <p v-if="errors.first_flight" class="error-message">{{ errors.first_flight }}</p>
  
        <div class="form-buttons">
          <button @click="close" class="form-cancel-button">Cancel</button>
          <button @click="save" class="form-save-button">Save</button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import type { Rocket } from '../types/rocket';
  
  export default defineComponent({
    emits: ['save', 'close'],
    props: {
      name: String,
    },
    setup(props, { emit }) {
      const rocket = ref<Rocket>({
        id: String(Date.now()),
        name: '',
        description: '',
        flickr_images: [''],
        cost_per_launch: 0,
        country: '',
        first_flight: '',
      });
  
      const errors = ref({
        name: '',
        description: '',
        flickr_images: '',
        cost_per_launch: '',
        country: '',
        first_flight: '',
      });
  
      const close = () => {
        emit('close');
      };
  
      const validate = () => {
        errors.value = {
          name: !rocket.value.name ? 'Name is required' : '',
          description: !rocket.value.description ? 'Description is required' : '',
          flickr_images: !rocket.value.flickr_images[0] ? 'Image URL is required' : '',
          cost_per_launch: rocket.value.cost_per_launch === 0 ? 'Cost per Launch is required' : '',
          country: !rocket.value.country ? 'Country is required' : '',
          first_flight: !rocket.value.first_flight ? 'First Flight is required' : '',
        };
  
        return Object.values(errors.value).every((error) => !error);
      };
  
      const save = () => {
        if (!validate()) {
          return;
        }
  
        emit('save', { ...rocket.value });
        rocket.value = {
          id: String(Date.now()),
          name: '',
          description: '',
          flickr_images: [''],
          cost_per_launch: 0,
          country: '',
          first_flight: '',
        };
        errors.value = {
          name: '',
          description: '',
          flickr_images: '',
          cost_per_launch: '',
          country: '',
          first_flight: '',
        };
      };
  
      return {
        rocket,
        close,
        save,
        errors,
      };
    },
  });
  </script>
  
  <style scoped>
  .form-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .form-container {
    background-color: white;
    padding: 20px;
    border-radius: 4px;
    width: 400px;
    max-height: 90vh; /* Tambahkan max-height */
    overflow-y: auto; /* Tambahkan overflow-y */
  }
  
  .form-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .form-input,
  .form-textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  .form-textarea {
    height: 100px;
  }
  
  .form-buttons {
    display: flex;
    justify-content: flex-end;
  }
  
  .form-cancel-button,
  .form-save-button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
  }
  
  .form-cancel-button {
    background-color: #ddd;
  }
  
  .form-save-button {
    background-color: #007bff;
    color: white;
  }
  
  .error-message {
    color: red;
    font-size: 12px;
    margin-bottom: 10px;
  }
  </style>