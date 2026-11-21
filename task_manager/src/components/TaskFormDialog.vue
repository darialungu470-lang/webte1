<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  saving: Boolean,
  editingTask: {
    type: Object,
    default: null,
  },
  initialTaskDates: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'save'])

const task = reactive({
  title: props.editingTask?.title ?? '',
  description: props.editingTask?.description ?? '',
  date_from: toLocalInputValue(props.editingTask?.date_from ?? props.initialTaskDates?.start),
  date_to: toLocalInputValue(props.editingTask?.date_to ?? props.initialTaskDates?.end),
  is_finished: props.editingTask?.is_finished ?? false,
})

const errors = reactive({
  title: '',
  description: '',
  date_from: '',
  date_to: '',
})

watch(
  () => props.initialTaskDates,
  (dates) => {
    if (!dates || props.editingTask || props.saving) return

    task.date_from = toLocalInputValue(dates.start)
    task.date_to = toLocalInputValue(dates.end)
    errors.date_from = ''
    errors.date_to = ''
  },
)


function toLocalInputValue(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const offsetMs = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

function submitTask() {
  if (props.saving) return

  const title = task.title.trim()

  errors.title = ''
  errors.description = ''
  errors.date_from = ''
  errors.date_to = ''

  if (!title) {
    errors.title = 'Zadajte názov úlohy.'
  } else if (title.length > 200) {
    errors.title = 'Názov môže mať najviac 200 znakov.'
  }

  if (task.description.length > 1000) {
    errors.description = 'Popis môže mať najviac 1000 znakov.'
  }

  if (!task.date_from) {
    errors.date_from = 'Zadajte začiatok úlohy.'
  }

  if (!task.date_to) {
    errors.date_to = 'Zadajte koniec úlohy.'
  } else if (task.date_from && task.date_from > task.date_to) {
    errors.date_to = 'Koniec úlohy nesmie byť pred jej začiatkom.'
  }

  if (Object.values(errors).some(Boolean)) return

  emit('save', { ...task, title })
}
</script>

<template>
  <section aria-labelledby="task-form-title">
    <h2 id="task-form-title">
      {{ editingTask ? 'Upraviť úlohu' : 'Nová úloha' }}
    </h2>

    <form novalidate @submit.prevent="submitTask">
      <label for="task-title">Názov</label>
      <input id="task-title" type="text" v-model="task.title" maxlength="200" required>
      <p v-if="errors.title" class="field-error" role="alert"> {{ errors.title }} </p>

      <label for="task-description">Popis</label>
      <textarea id="task-description" v-model="task.description" maxlength="1000"></textarea>
      <p v-if="errors.description" class="field-error" role="alert"> {{ errors.description }} </p>

      <label for="task-start">Začiatok</label>
      <input id="task-start" type="datetime-local" v-model="task.date_from" required>
      <p v-if="errors.date_from" class="field-error" role="alert"> {{ errors.date_from }} </p>

      <label for="task-end">Koniec</label>
      <input id="task-end" type="datetime-local" v-model="task.date_to" required>
      <p v-if="errors.date_to" class="field-error" role="alert"> {{ errors.date_to }} </p>

      <label v-if="editingTask">
        <input type="checkbox" v-model="task.is_finished">
        Dokončená
      </label>

      <button type="submit" :disabled="saving"> {{ saving ? 'Ukladám…' : 'Uložiť' }} </button>
      <button type="button" :disabled="saving" @click="emit('close')"> Zrušiť </button>
    </form>
  </section>
</template>