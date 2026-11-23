<script setup>
// Import Vue helpers, UI components, and API utilities.
import { computed, ref } from 'vue'
import TaskCalendar from './components/TaskCalendar.vue'
import TaskList from './components/TaskList.vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import TaskFormDialog from './components/TaskFormDialog.vue'
import StudentIdentifierForm from './components/StudentIdentifierForm.vue'
import { getTodos, createTodo, updateTodo, setTodoFinished, deleteTodo, resetTodos } from './services/todoApi.js'
import { formatDate } from './utils/dates.js'

// Track the student whose tasks are currently loaded and whether a write is in progress.
const loadedStudentName = ref('')
const saving = ref(false)

// Start with the calendar view.
const activeTab = ref('calendar');

// Store the task being edited. A null value means the form is in create mode.
const editingTask = ref(null);

// Keep the typed identifier separate from the identifier used by the loaded list.
const studentName = ref('');

// Share the same task collection between the calendar and the list.
const todos = ref([]);
const loading = ref(false);

// Store feedback for the most recent operation.
const errorMessage = ref('');
const successMessage = ref('');

// Track form visibility, the selected calendar task, and optional preset dates.
const isTaskFormOpen = ref(false);
const selectedTaskId = ref(null);

const initialTaskDates = ref(null);


// Only unfinished tasks can become overdue.
function isOverdue(todo) {
  return !todo.is_finished && new Date(todo.date_to).getTime() < Date.now()
}

// Resolve the selected task from the latest task collection.
const selectedTask = computed(() =>
  todos.value.find((todo) => String(todo.id) === selectedTaskId.value),
)

// Open the selected task for editing and clear its details panel.
function editSelectedTask() {
  if (!selectedTask.value) return

  openEditTask(selectedTask.value)
  selectedTaskId.value = null
}

// Validate the identifier and load the matching tasks.
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
    loadedStudentName.value = name
    selectedTaskId.value = null
    successMessage.value = `Úlohy boli načítané. Počet úloh: ${todos.value.length}.`
  } catch (error) {
    errorMessage.value = error instanceof TypeError
      ? 'Nepodarilo sa pripojiť k serveru. Skúste to znova.'
      : 'Úlohy sa nepodarilo načítať. Skúste to znova.'
  } finally {
    loading.value = false
  }
}

// Create or update a task for the student whose list is loaded.
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

    // Create or update a task for the student whose list is loaded.
    const payload = {
      title: taskData.title,
      description: taskData.description,
      date_from: new Date(taskData.date_from).toISOString(),
      date_to: new Date(taskData.date_to).toISOString(),
      is_finished: taskData.is_finished,
    }

    // Use the presence of an editable task to choose between updating and creating.
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


// Open the form with an existing task.
function openEditTask(todo) {
  editingTask.value = todo
  isTaskFormOpen.value = true
}

// Open a new task form, optionally with dates selected in the calendar.
function openNewTask(dates = null) {
  if (saving.value) return

  // Update the dates without clearing an open creation form.
  if (isTaskFormOpen.value && !editingTask.value) {
    if (dates) initialTaskDates.value = dates
    return
  }

  // Discard the edit draft and switch to a new task.
  editingTask.value = null
  selectedTaskId.value = null
  initialTaskDates.value = dates
  isTaskFormOpen.value = true
}

// Persist the new completion status, then update the matching task locally.
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

// Confirm deletion before removing the task on the server and from the shared list.
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

// Confirm the reset and reload the sample tasks from the server.
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

// Close the form and show details for the selected calendar task.
function openTaskDetails(taskId) {
  if (saving.value) return

  isTaskFormOpen.value = false
  editingTask.value = null
  initialTaskDates.value = null
  selectedTaskId.value = String(taskId)
}
</script>





<template>
  <!-- Switch between the calendar and list, or open a new task form. -->
  <AppHeader 
    :active-tab="activeTab" 
    @change-tab="activeTab = $event" 
    @new-task="openNewTask"
  />

  <main class = "container workspace">
    
    <!-- Display the active view using the shared task collection. -->
    <section class = "workspace-content">

      <TaskCalendar 
        v-if="activeTab === 'calendar'" 
        :todos="todos" 
        @select-task="openTaskDetails"
        @create-task="openNewTask"
      />
        
      <TaskList 
        v-else :todos="todos" 
        @edit="openEditTask"
        @toggle-status="toggleTaskStatus"
        @delete="removeTask"
        :busy="loading || saving"
      />

    </section>

    <!-- Keep student controls, feedback, and task actions beside the active view. -->
    <section class = "workspace-panel">

      <!-- Load tasks for the entered student identifier. -->
      <StudentIdentifierForm 
        v-model="studentName" 
        :loading="loading || saving" 
        @load="loadTodos" 
      />

      <!-- Announce errors and successful operations to assistive technology. -->
      <p v-if="errorMessage" role="alert" class = "desc-message">{{ errorMessage }}</p>
      <p v-if="successMessage" role="status" class = "desc-message">{{ successMessage }}</p>

      <!-- Reuse the form for creating and editing tasks. -->
      <TaskFormDialog 
        v-if="isTaskFormOpen" 
        :key="editingTask ? `edit-${editingTask.id}` : 'new-task'"
        :editing-task="editingTask"
        :saving="saving"
        :initial-task-dates="initialTaskDates"
        @close="isTaskFormOpen = false" 
        @save="saveTask"
      />


      <!-- Show details for the task selected in the calendar. -->
      <section
        v-if="activeTab === 'calendar' && selectedTask"
        class="task-details"
        aria-labelledby="task-details-title"
      >
        <h2 id="task-details-title">{{ selectedTask.title }}</h2>
        <p class="task-description">{{ selectedTask.description || 'Bez popisu.' }}</p>
        <p v-if="selectedTask.is_finished" class="task-status task-status--done">Dokončená</p>
        <p v-else-if="isOverdue(selectedTask)" class="task-status task-status--overdue">Po termíne</p>
        <p v-else class="task-status task-status--open">Nedokončená</p>

        <!-- Show the start and end dates with their labels. -->
        <dl class="task-dates">
          <div>
            <dt>Začiatok</dt>
            <dd>{{ formatDate(selectedTask.date_from) }}</dd>
          </div>
          <div>
            <dt>Koniec</dt>
            <dd>{{ formatDate(selectedTask.date_to) }}</dd>
          </div>
        </dl>

        <!-- Offer actions for the selected task. -->
        <div class="task-actions">
          <button type="button" @click="editSelectedTask">Upraviť</button>

          <button type="button" class="task-close" @click="selectedTaskId = null">Zavrieť</button>

          <button
            type="button"
            class="task-toggle"
            :disabled="loading || saving"
            @click="toggleTaskStatus(selectedTask)"
          >
            {{ selectedTask.is_finished ? 'Znovu otvoriť' : 'Dokončiť' }}
          </button>

           <button
              type="button"
              class="task-delete"
              :disabled="loading || saving"
              @click="removeTask(selectedTask)"
            >
              Odstrániť
            </button>
        </div>
        
      </section>


      <!-- Show the reset button only when a student list is loaded. -->
      <div v-if="activeTab === 'list' && loadedStudentName">
        <button
          type="button"
          class="btn-reset"
          :disabled="loading || saving || isTaskFormOpen"
          :aria-describedby="isTaskFormOpen ? 'reset-hint' : undefined"
          @click="resetTaskList"
        >
          Obnoviť ukážkové úlohy
        </button>

        <p v-if="isTaskFormOpen" id="reset-hint" class="reset-hint">
          Ak chcete obnoviť ukážkové úlohy, najprv úlohu uložte alebo formulár zatvorte.
        </p>
      </div>

    </section>
    
  </main>

  <!-- Display project information below the workspace. -->
  <AppFooter />
</template>

<style scoped>

/* Use two columns with more space for the calendar or task list. */
.workspace {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  align-items: start;
  gap: clamp(1rem, 4vw, 3rem);
  padding: clamp(1rem, 4vw, 3rem);
}

/* Allow both workspace columns to shrink within the grid. */
.workspace-content,
.workspace-panel {
  min-width: 0;
}

/* Keep the controls in a single flexible column. */
.workspace-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
  padding: clamp(1rem, 3vw, 1.5rem);
  background: white;
  border: 1px solid #e7dce2;
  border-radius: 1rem;
}

/* Allow long text to wrap in the details panel. */
.task-details {
  overflow-wrap: anywhere;
}

/* Stack the workspace columns on narrower screens. */
@media (max-width: 56rem) {
  .workspace {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* Lay out the selected task details. */
.task-details {
  display: grid;
  justify-items: start;
  gap: 0.75rem;
  min-width: 0;
  padding-top: 1rem;
  border-top: 1px solid #eadfe4;
  overflow-wrap: anywhere;
}

/* Set the details heading size and spacing. */
.task-details h2 {
  margin: 0;
  font-size: 1.35rem;
}

/* Preserve line breaks entered in the task description. */
.task-description {
  margin: 0;
  color: #57464e;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* Style the status badge and its state-specific colors. */
.task-status {
  margin: 0;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.task-status--open {
  background: #fbd5e5;
  color: #72123b;
}

.task-status--done {
  background: #d6e9d7;
  color: #245432;
}

.task-status--overdue {
  background: #fde5e8;
  color: #a51d36;
}

/* Lay out date fields side by side when there is enough room. */
.task-dates {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
  gap: 0.75rem;
  width: 100%;
  margin: 0;
}

.task-dates dt {
  color: #57464e;
  font-size: 0.85rem;
  font-weight: 600;
}

.task-dates dd {
  margin: 0.2rem 0 0;
}

/* Let action buttons wrap on narrow screens. */
.task-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.task-actions button {
  padding: 0.5rem 0.75rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  background: #fbd5e5;
  color: #72123b;
  font: inherit;
  font-weight: 600;
}

.task-actions .task-close {
  border-color: #d4b7c4;
  background: white;
}

.task-actions .task-toggle {
  background: #b51766;
  color: white;
}

.task-actions .task-delete {
  border-color: #a51d36;
  background: white;
  color: #a51d36;
}

/* Show a focus indicator for keyboard navigation. */
.task-actions button:focus-visible {
  outline: 2px solid #b51766;
  outline-offset: 2px;
}

/* Visually distinguish unavailable actions. */
.task-actions button:disabled {
  opacity: 0.6;
}

/* Style the sample-task reset button. */
.btn-reset{
  width: 170px;
  height: 40px;
  border: none;
  border-radius: 1rem;
  background: #fbd5e5;
  color: #72123b;
  font-size: 14px;
  font-family: 'Serif';

  transition: all 0.8s;
}

.btn-reset:hover:not(:disabled){
  box-shadow: 0 0 10px #72123b;
}

.btn-reset:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
}

.reset-hint {
  margin: 0.5rem 0 0;
  color: #57464e;
  font-size: 0.875rem;
}

</style>
