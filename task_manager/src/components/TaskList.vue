<script setup>
import { ref, computed } from 'vue'
import { formatDate } from '../utils/dates.js'

const props = defineProps({
  todos: {
    type: Array,
    default: () => [],
  },
  busy: Boolean,
});

const emit = defineEmits(['edit', 'toggle-status', 'delete']);

const search = ref('')
const status = ref('all')
const sortBy = ref('date_from')


function isOverdue(todo) {
  return !todo.is_finished && new Date(todo.date_to).getTime() < Date.now()
}

const visibleTodos = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('sk')

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
  <section>
    <h2>Zoznam úloh</h2>

    <label>
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


    <p v-if="todos.length === 0">Žiadne úlohy na zobrazenie.</p>

    <ul v-else>
      <p v-if="todos.length === 0">Žiadne úlohy na zobrazenie.</p>
      <p v-else-if="visibleTodos.length === 0">
        Zadanému filtru nezodpovedá žiadna úloha.
      </p>

      <li v-for="todo in visibleTodos" :key="todo.id">
        <strong>{{ todo.title }}</strong>

        <p v-if="todo.description">{{ todo.description }}</p>

        <p>
          Začiatok: {{ formatDate(todo.date_from) }}<br>
          Koniec: {{ formatDate(todo.date_to) }}
        </p>

        <span v-if="todo.is_finished">Dokončená</span>
        <span v-else-if="isOverdue(todo)" class="overdue">Po termíne</span>
        <span v-else>Nedokončená</span>


        <button type="button" @click="emit('edit', todo)">Upraviť</button>
        <button type="button" @click="emit('toggle-status', todo)">
          {{ todo.is_finished ? 'Znovu otvoriť' : 'Dokončiť' }}
        </button>
        <button type="button" :disabled="busy" @click="emit('delete', todo)">
          Odstrániť
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
  .overdue {
    color: #a51d36;
    font-weight: 700;
  }
</style>