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
  locale: skLocale,
  firstDay: 1,

  headerToolbar: {
    start: 'prev,next today',
    center: 'title',
    end: 'dayGridMonth,timeGridWeek,timeGridDay',
  },

  events: props.todos.map((todo) => ({
    id: String(todo.id),
    title: todo.title,
    start: todo.date_from,
    end: todo.date_to,
    backgroundColor: todo.is_finished ? '#287447' : '#b51766',
    borderColor: todo.is_finished ? '#287447' : '#b51766',
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
  <FullCalendar :options="calendarOptions" class = "calendar"/>
</template>