<script setup>

// Receive the student identifier and loading state from the parent.
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  loading: Boolean,
})

// Support v-model and notify the parent when the form is submitted.
const emit = defineEmits(['update:modelValue', 'load']);
</script>

<template>
  <!-- Prevent the browser from reloading the page on form submission. -->
  <form @submit.prevent="emit('load')" class = "identifier-form">

    <div>
      <label for="student-name">Identifikátor študenta</label>

      <!-- Sync the input with the parent and disable it while tasks are loading. -->
      <input
        id="student-name"
        type="text"
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
        maxlength="100"
        required
        :disabled="loading"
        class = "identifier-name"
      >
    </div>

    <!-- Show loading feedback and prevent another submission during the request. -->
    <button type="submit" :disabled="loading" class = "btn-load">
      {{ loading ? 'Načítavam…' : 'Načítať úlohy' }}
    </button>
  </form>
</template>
