<script setup>
import { ref, computed } from 'vue'
import { formatDate } from '../utils/dates.js'
import { fibonacci } from '../utils/fibonacci.js'

// Use Fibonacci values for the gap between cards and the padding inside them.
const cardSpacing = {
  '--card-gap': `${fibonacci(7)}px`,
  '--card-padding': `${fibonacci(8)}px`,
}

// Receive the shared task list and the parent's busy state.
const props = defineProps({
  todos: {
    type: Array,
    default: () => [],
  },
  busy: Boolean,
});

// Delegate task actions to the parent component.

const emit = defineEmits(['edit', 'toggle-status', 'delete']);

// Track the search query, status filter, and selected sort field.
const search = ref('')
const status = ref('all')
const sortBy = ref('date_from')


// An unfinished task becomes overdue once its end time has passed.
function isOverdue(todo) {
  return !todo.is_finished && new Date(todo.date_to).getTime() < Date.now()
}

// Recompute the displayed list when the tasks or filter settings change.
const visibleTodos = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('sk')

  // Filter into a new array so sorting does not change the original task list.
  return props.todos
    .filter((todo) => {
      const matchesTitle = todo.title.toLocaleLowerCase('sk').includes(query)
      const matchesStatus =
        status.value === 'all' ||
        todo.is_finished === (status.value === 'finished')

      return matchesTitle && matchesStatus
    })
    .sort((a, b) => new Date(a[sortBy.value]) - new Date(b[sortBy.value]))
})

</script>

<template>
  <section class = "task-list">
    <h2>Zoznam úloh</h2>

    <!-- Bind the search, status filter, and sort controls to the list settings. -->
    <div class="task-filters task-filter-area">

      <label class="task-filter--search">
        Hľadať podľa názvu
        <input v-model="search" type="search">
      </label>

      <label>
        Stav
        <select v-model="status">
          <option value="all">Všetky</option>
          <option value="unfinished">Nedokončené</option>
          <option value="finished">Dokončené</option>
        </select>
      </label>

      <label>
        Zoradiť
        <select v-model="sortBy">
          <option value="date_from">Podľa začiatku</option>
          <option value="date_to">Podľa konca</option>
        </select>
      </label>
      
    </div>
    
    <!-- Show an empty state when there are no tasks. -->
    <p v-if="todos.length === 0" class = "desc-message" >Žiadne úlohy na zobrazenie.</p>

    <!-- Pass the spacing variables to the grid and its cards. -->
    <ul v-else class="task-grid" :style="cardSpacing">
      <p v-if="todos.length === 0" class = "desc-message">Žiadne úlohy na zobrazenie.</p>
      <p v-else-if="visibleTodos.length === 0" class = "desc-message">
        Zadanému filtru nezodpovedá žiadna úloha.
      </p>

      <!-- Use the task ID as a stable key when filtering or sorting the cards. -->
      <li v-for="todo in visibleTodos" :key="todo.id" class="task-card">
        <h3>{{ todo.title }}</h3>

        <p v-if="todo.description">{{ todo.description }}</p>

        <p>
          Začiatok: {{ formatDate(todo.date_from) }}<br>
          Koniec: {{ formatDate(todo.date_to) }}
        </p>

        <!-- Show the completed status before checking whether the task is overdue. -->
        <span v-if="todo.is_finished" class="card-status card-status--done">
          Dokončená
        </span>
        <span v-else-if="isOverdue(todo)" class="card-status card-status--overdue">
          Po termíne
        </span>
        <span v-else class="card-status">Nedokončená</span>

        <!-- Pass the task to the parent when the user selects an action. -->
        <div class="task-card-actions">
          <button type="button" @click="emit('edit', todo)">Upraviť</button>
          <button type="button" @click="emit('toggle-status', todo)">
            {{ todo.is_finished ? 'Znovu otvoriť' : 'Dokončiť' }}
          </button>
          <button type="button" class="task-card-delete" :disabled="busy" @click="emit('delete', todo)">
            Odstrániť
          </button>
        </div>
        
      </li>
    </ul>
  </section>
</template>



<style scoped>

/* Define a text style for overdue indicators. */
.overdue {
  color: #a51d36;
  font-weight: 700;
}

/* Arrange the filters in a panel with two equal columns. */
.task-filters {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.85rem;
  border: 1px solid #efd1df;
  border-radius: 0.75rem;
  background: #fff5f9;
}

.task-filters label {
  display: grid;
  gap: 0.35rem;
  min-width: 0;
  color: #72123b;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Give the search field the full width of the filter panel by default. */
.task-filter--search {
  grid-column: 1 / -1;
}

/* Keep the search input and select controls within their grid columns. */
.task-filters input,
.task-filters select {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 2.5rem;
  padding: 0.5rem 0.65rem;
  border: 1px solid #d4b7c4;
  border-radius: 0.5rem;
  background: #fff;
  color: #34242c;
  font: inherit;
  font-weight: 400;
}

.task-filters input:focus,
.task-filters select:focus {
  outline: 2px solid #b51766;
  outline-offset: 2px;
}

/* Establish a container for inline-size queries on descendants. */
.task-filter-area {
  container-type: inline-size;
}

/* Define a three-column filter layout for a wider query container. */
@container (min-width: 34rem) {
  .task-filters {
    grid-template-columns: minmax(0, 2fr) repeat(2, minmax(0, 1fr));
  }

  .task-filter--search {
    grid-column: auto;
  }
}

/* Let the card grid adapt to the available width. */
.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  gap: var(--card-gap);
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Use two card columns when the query container is at least 31rem wide. */
@container (min-width: 31rem) {
  .task-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Stack the card contents and allow long task text to wrap. */
.task-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.6rem;
  min-width: 0;
  padding: var(--card-padding);
  background: #fff;
  border: 1px solid #eadfe4;
  border-radius: 0.85rem;
  overflow-wrap: anywhere;
}

.task-card h3,
.task-card p {
  margin: 0;
}

.task-card h3 {
  font-size: 1.1rem;
}

/* Preserve line breaks in task descriptions. */
.task-card p {
  color: #57464e;
  line-height: 1.45;
  white-space: pre-wrap;
}

/* Define the default status badge and colors for completed and overdue tasks. */
.card-status {
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background: #fbd5e5;
  color: #72123b;
  font-size: 0.85rem;
  font-weight: 600;
}

.card-status--done {
  background: #d6e9d7;
  color: #245432;
}

.card-status--overdue {
  background: #fde5e8;
  color: #a51d36;
}

/* Push the actions to the bottom of each card and let the buttons wrap. */
.task-card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: auto;
  padding-top: 0.3rem;
}

.task-card-actions button {
  padding: 0.4rem 0.65rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  background: #fbd5e5;
  color: #72123b;
  font: inherit;
  font-size: 0.875rem;
}

/* Distinguish the delete action from the other card buttons. */
.task-card-actions .task-card-delete {
  border-color: #d9a0ac;
  background: #fff;
  color: #a51d36;
}

/* Make keyboard focus and disabled buttons visually distinct. */
.task-card-actions button:focus-visible {
  outline: 2px solid #b51766;
  outline-offset: 2px;
}

.task-card-actions button:disabled {
  opacity: 0.6;
}

/* Wrap the filters and task grid in a single panel. */
.task-list{
  background: white;
  padding: clamp(1rem, 3vw, 1.5rem);
  border: 1px solid #e7dce2;
  border-radius: 1rem;
}

</style>