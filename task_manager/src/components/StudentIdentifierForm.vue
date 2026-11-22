<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  loading: Boolean,
})

const emit = defineEmits(['update:modelValue', 'load']);
</script>

<template>
  <form @submit.prevent="emit('load')" class = "identifier-form">

    <div>
      <label for="student-name">Identifikátor študenta</label>

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

    <button type="submit" :disabled="loading" class = "btn-load">
      {{ loading ? 'Načítavam…' : 'Načítať úlohy' }}
    </button>
  </form>
</template>
