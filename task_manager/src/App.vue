<script setup>
import { computed, ref } from 'vue'
import TaskCalendar from './components/TaskCalendar.vue'
import TaskList from './components/TaskList.vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import TaskFormDialog from './components/TaskFormDialog.vue'
import StudentIdentifierForm from './components/StudentIdentifierForm.vue'
import { getTodos, createTodo, updateTodo, setTodoFinished, deleteTodo, resetTodos } from './services/todoApi.js'
import { formatDate } from './utils/dates.js'

const loadedStudentName = ref('')
const saving = ref(false)

const activeTab = ref('calendar');

const editingTask = ref(null);

const studentName = ref('');
const todos = ref([]);
const loading = ref(false);

const errorMessage = ref('');
const successMessage = ref('');

const isTaskFormOpen = ref(false);
const selectedTaskId = ref(null);

const initialTaskDates = ref(null);


function isOverdue(todo) {
  return !todo.is_finished && new Date(todo.date_to).getTime() < Date.now()
}

const selectedTask = computed(() =>
  todos.value.find((todo) => String(todo.id) === selectedTaskId.value),
)

function editSelectedTask() {
  if (!selectedTask.value) return

  openEditTask(selectedTask.value)
  selectedTaskId.value = null
}

async function loadTodos() {
  if (loading.value || saving.value) return

  errorMessage.value = ''
  successMessage.value = ''

  const name = studentName.value.trim()

  if (!name || name.length > 100 || name.includes('/')) {
    errorMessage.value = 'Zadajte identifikátor bez lomky, najviac 100 znakov.'
    return
  }

  loading.value = true

  try {
    todos.value = await getTodos(name)
    successMessage.value = `Úlohy boli načítané. Počet úloh: ${todos.value.length}.`
    todos.value = await getTodos(name)
    loadedStudentName.value = name
  } catch (error) {
    errorMessage.value = error instanceof TypeError
      ? 'Nepodarilo sa pripojiť k serveru. Skúste to znova.'
      : 'Úlohy sa nepodarilo načítať. Skúste to znova.'
  } finally {
    loading.value = false
  }
}

async function saveTask(taskData) {
  if (saving.value || loading.value) return

  errorMessage.value = ''
  successMessage.value = ''

  const name = loadedStudentName.value
  if (!name) {
    errorMessage.value = 'Najprv načítajte zoznam úloh.'
    return
  }

  saving.value = true

  try {
    const todoToEdit = editingTask.value

    const payload = {
      title: taskData.title,
      description: taskData.description,
      date_from: new Date(taskData.date_from).toISOString(),
      date_to: new Date(taskData.date_to).toISOString(),
      is_finished: taskData.is_finished,
    }

    if (todoToEdit) {
      await updateTodo(name, todoToEdit.id, payload)
    } else {
      await createTodo(name, payload)
    }

    isTaskFormOpen.value = false
    successMessage.value = todoToEdit
      ? 'Úloha bola upravená.'
      : 'Úloha bola vytvorená.'

    try {
      todos.value = await getTodos(name)
    } catch {
      errorMessage.value = 'Úloha bola uložená, ale zoznam sa nepodarilo obnoviť. Kliknite na „Načítať úlohy“.'
    }
  } catch (error) {
    errorMessage.value = error instanceof TypeError
      ? 'Nepodarilo sa pripojiť k serveru. Skúste to znova.'
      : error.message
  } finally {
    saving.value = false
  }
}


function openEditTask(todo) {
  editingTask.value = todo
  isTaskFormOpen.value = true
}

function openNewTask(dates = null) {
  if (saving.value) return

  if (isTaskFormOpen.value) {
    if (!editingTask.value && dates) {
      initialTaskDates.value = dates
    }
    return
  }

  editingTask.value = null
  selectedTaskId.value = null
  initialTaskDates.value = dates
  isTaskFormOpen.value = true
}

async function toggleTaskStatus(todo) {
  if (loading.value || saving.value || !loadedStudentName.value) return

  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const finished = !todo.is_finished

  try {
    await setTodoFinished(loadedStudentName.value, todo.id, finished)

    todos.value = todos.value.map((item) =>
      item.id === todo.id ? { ...item, is_finished: finished } : item,
    )

    successMessage.value = finished
      ? 'Úloha bola dokončená.'
      : 'Úloha bola znovu otvorená.'
  } catch {
    errorMessage.value = 'Stav úlohy sa nepodarilo zmeniť. Skúste to znova.'
  } finally {
    saving.value = false
  }
}

async function removeTask(todo) {
  const name = loadedStudentName.value
  if (loading.value || saving.value || !name) return

  const confirmed = window.confirm(`Chcete odstrániť úlohu „${todo.title}“?`)
  if (!confirmed) return

  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await deleteTodo(name, todo.id)
    todos.value = todos.value.filter((item) => item.id !== todo.id)
    successMessage.value = 'Úloha bola odstránená.'
  } catch {
    errorMessage.value = 'Úlohu sa nepodarilo odstrániť. Skúste to znova.'
  } finally {
    saving.value = false
  }
}

async function resetTaskList() {
  const name = loadedStudentName.value
  if (!name || loading.value || saving.value || isTaskFormOpen.value) return

  const confirmed = window.confirm(
    'Všetky aktuálne úlohy sa odstránia a nahradia piatimi ukážkovými úlohami. Chcete pokračovať?',
  )
  if (!confirmed) return

  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await resetTodos(name)
    selectedTaskId.value = null

    try {
      todos.value = await getTodos(name)
      successMessage.value = 'Ukážkové úlohy boli obnovené.'
    } catch {
      errorMessage.value =
        'Ukážkové úlohy boli obnovené, ale zoznam sa nepodarilo načítať. Kliknite na „Načítať úlohy“.'
    }
  } catch {
    errorMessage.value = 'Ukážkové úlohy sa nepodarilo obnoviť. Skúste to znova.'
  } finally {
    saving.value = false
  }
}
</script>












<template>
  <AppHeader 
    :active-tab="activeTab" 
    @change-tab="activeTab = $event" 
    @new-task="openNewTask"
  />

  <main class = "container">
    <StudentIdentifierForm v-model="studentName" :loading="loading" @load="loadTodos" />

    <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
    <p v-if="successMessage" role="status">{{ successMessage }}</p>



    
    <TaskFormDialog 
      v-if="isTaskFormOpen" 
      :editing-task="editingTask"
      :saving="saving"
      :initial-task-dates="initialTaskDates"
      @close="isTaskFormOpen = false" 
      @save="saveTask"
    />

    <TaskCalendar 
      v-if="activeTab === 'calendar'" 
      :todos="todos" 
      @select-task="selectedTaskId = $event"
      @create-task="openNewTask"
    />
      
    <TaskList 
      v-else :todos="todos" 
      @edit="openEditTask"
      @toggle-status="toggleTaskStatus"
      @delete="removeTask"
      :busy="loading || saving"
    />

    <button
      v-if="activeTab === 'list' && loadedStudentName"
      type="button"
      :disabled="loading || saving || isTaskFormOpen"
      @click="resetTaskList"
    >
      Obnoviť ukážkové úlohy
    </button>

    <section
      v-if="activeTab === 'calendar' && selectedTask"
      aria-labelledby="task-details-title"
    >
      <h2 id="task-details-title">{{ selectedTask.title }}</h2>
      <p>{{ selectedTask.description || 'Bez popisu.' }}</p>
      <p v-if="selectedTask.is_finished">Dokončená</p>
      <p v-else-if="isOverdue(selectedTask)">Po termíne</p>
      <p v-else>Nedokončená</p>

      <p>Začiatok: {{ formatDate(selectedTask.date_from) }}</p>
      <p>Koniec: {{ formatDate(selectedTask.date_to) }}</p>

      <button type="button" @click="editSelectedTask">Upraviť</button>
      <button type="button" @click="selectedTaskId = null">Zavrieť</button>

      <button
        type="button"
        :disabled="loading || saving"
        @click="toggleTaskStatus(selectedTask)"
      >
        {{ selectedTask.is_finished ? 'Znovu otvoriť' : 'Dokončiť' }}
      </button>

      <button
        type="button"
        :disabled="loading || saving"
        @click="removeTask(selectedTask)"
      >
        Odstrániť
      </button>
    </section>
  </main>

  <AppFooter />
</template>

<style scoped>

</style>
