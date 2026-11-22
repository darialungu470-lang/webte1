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

      <div class="form-field">
        <label for="task-title">Názov</label>
        <input id="task-title" type="text" v-model="task.title" maxlength="200" required>
        <p v-if="errors.title" class="field-error" role="alert"> {{ errors.title }} </p>
      </div>

      <div class="form-field">
        <label for="task-description">Popis</label>
        <textarea id="task-description" v-model="task.description" maxlength="1000"></textarea>
        <p v-if="errors.description" class="field-error" role="alert"> {{ errors.description }} </p>
      </div>

      <div class="form-dates">
        <div class="form-field">
          <label for="task-start">Začiatok</label>
          <input id="task-start" type="datetime-local" v-model="task.date_from" required>
          <p v-if="errors.date_from" class="field-error" role="alert"> {{ errors.date_from }} </p>
        </div>
      </div>

      <div class="form-dates">
        <div class="form-field">
          <label for="task-end">Koniec</label>
          <input id="task-end" type="datetime-local" v-model="task.date_to" required>
          <p v-if="errors.date_to" class="field-error" role="alert"> {{ errors.date_to }} </p>
        </div>
      </div>

      <label v-if="editingTask">
        <input type="checkbox" v-model="task.is_finished">
        Dokončená
      </label>

      <button type="submit" :disabled="saving" class="form-save"> {{ saving ? 'Ukladám…' : 'Uložiť' }} </button>
      <button type="button" :disabled="saving" @click="emit('close')" class="form-cancel"> Zrušiť </button>
    </form>
  </section>
</template>

<style scoped>ň
.task-form {
  min-width: 0;
  padding-top: 1rem;
  border-top: 1px solid #eadfe4;
}

.task-form h2 {
  margin: 0 0 1rem;
  font-size: 1.35rem;
}

.task-form form {
  display: grid;
  gap: 0.85rem;
}

.form-field {
  display: grid;
  gap: 0.35rem;
  min-width: 0;
}

.form-field label {
  font-weight: 600;
}

.form-dates {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
  gap: 0.75rem;
}

.form-field input,
.form-field textarea {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 0.6rem 0.7rem;
  border: 1px solid #d4b7c4;
  border-radius: 0.5rem;
  background: #fff;
  color: inherit;
  font: inherit;
}

.form-field textarea {
  min-height: 5rem;
  resize: vertical;
}

.form-field input:focus,
.form-field textarea:focus {
  outline: 2px solid #b51766;
  outline-offset: 2px;
  caret-color: #b51766;
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.form-actions button {
  padding: 0.55rem 1rem;
  border: 0;
  border-radius: 0.5rem;
  font: inherit;
  font-weight: 600;
}

.form-save {
  margin: 1rem 0.5rem;
  padding: 0.5rem 1.5rem;
  background: #b51766;
  color: #fff;
  border-radius: 15px;
  border: none;
  font-family: 'Serif';
  font-size: 14px;

  transition: all 0.3s;
}

.form-cancel {
  margin: 1rem 0.5rem;
  padding: 0.5rem 1.5rem;
  background: #fbd5e5;
  color: #72123b;
  border-radius: 15px;
  border: none;
  font-family: 'Serif';
  font-size: 14px;

  transition: all 0.3s;
}

.form-actions button:disabled {
  opacity: 0.6;
}

.form-cancel:hover, .form-save:hover {
  box-shadow: 0 0 10px rgb(255, 233, 111);
}

.field-error {
  margin: 0;
  color: #a51d36;
  font-size: 0.875rem;
}

</style>