<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/vue3/daygrid'
import timeGridPlugin from '@fullcalendar/vue3/timegrid'
import themePlugin from '@fullcalendar/vue3/themes/monarch'
import skLocale from 'fullcalendar/locales/sk'
import interactionPlugin from '@fullcalendar/vue3/interaction'


import '@fullcalendar/vue3/skeleton.css'
import '@fullcalendar/vue3/themes/monarch/theme.css'
import '@fullcalendar/vue3/themes/monarch/palettes/purple.css'


import { computed } from 'vue'

const props = defineProps({
  todos: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['select-task', 'create-task'])

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, themePlugin, interactionPlugin],

  initialView: 'dayGridMonth',
  views: {
    dayGridMonth: {
      contentHeight: 440,
    },
  },

  locale: skLocale,
  firstDay: 1,

  headerToolbar: {
    start: 'prev,next today',
    center: 'title',
    end: 'dayGridMonth,timeGridWeek,timeGridDay',
  },

  headerToolbarClass: 'calendar-toolbar',
  toolbarSectionClass: 'calendar-toolbar-section',
  toolbarTitleClass: 'calendar-title',
  buttonClass: ({ isSelected }) =>
  isSelected ? 'calendar-button is-selected' : 'calendar-button',

  events: props.todos.map((todo) => ({
    id: String(todo.id),
    title: todo.title,
    start: todo.date_from,
    end: todo.date_to,
    color: todo.is_finished ? '#287447' : '#b51766',
    contrastColor: todo.is_finished ? '#fff0f6' : '#fff0f6',
  })),

  eventClick(info) {
    emit('select-task', info.event.id)
  },

  selectable: true,

  dateClick(info) {
    const start = new Date(info.date)

    if (info.allDay) start.setHours(9, 0, 0, 0)

    const end = new Date(start)
    if (info.allDay) {
      end.setHours(10, 0, 0, 0)
    } else {
      end.setMinutes(end.getMinutes() + 30)
    }

    emit('create-task', { start, end })
  },

  select(info) {
    const start = new Date(info.start)
    const end = new Date(info.end)

    if (info.allDay) {
      start.setHours(9, 0, 0, 0)
      end.setDate(end.getDate() - 1)
      end.setHours(10, 0, 0, 0)
    }

    emit('create-task', { start, end })
  },

  }))

</script>


<template>
  <div class="calendar-card">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>


<style scoped>

.calendar-card {
  min-width: 0;
  
  background: #fff;
  border: 1px solid #eadfe4;
  border-radius: 1rem;
}

.calendar-card :deep(.calendar-toolbar) {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.calendar-card :deep(.calendar-toolbar-section:nth-child(2)) {
  justify-self: end;
}

.calendar-card :deep(.calendar-toolbar-section:nth-child(3)) {
  grid-column: 1 / -1;
  justify-self: start;
}

.calendar-card :deep(.calendar-title) {
  margin: 0;
  font-size: clamp(1rem, 2vw, 1.375rem);
  text-align: right;
}

.calendar-card :deep(.calendar-button) {
  min-height: 2rem;
  min-width: 2rem;
  padding: 0.35rem 0.7rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  line-height: 1.2;

  background: #fff0f6;
  color: #72123b;
  font-weight: 600;
}

.calendar-card :deep(.calendar-button:hover:not(:disabled)) {
  background: #ffd5e6;
}

.calendar-card :deep(.calendar-button.is-selected) {
  background: #b51766;
  border-color: #b51766;
  color: #fff;
}

@media (max-width: 36rem) {
  .calendar-card :deep(.calendar-toolbar) {
    grid-template-columns: minmax(0, 1fr);
  }

  .calendar-card :deep(.calendar-toolbar-section:nth-child(2)) {
    grid-row: 1;
    justify-self: start;
  }

  .calendar-card :deep(.calendar-title) {
    text-align: left;
  }
}

</style>

