<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/vue3/daygrid'
import timeGridPlugin from '@fullcalendar/vue3/timegrid'
import themePlugin from '@fullcalendar/vue3/themes/monarch'
import skLocale from 'fullcalendar/locales/sk'
import interactionPlugin from '@fullcalendar/vue3/interaction'

// Load the base calendar styles, Monarch theme, and purple palette.
import '@fullcalendar/vue3/skeleton.css'
import '@fullcalendar/vue3/themes/monarch/theme.css'
import '@fullcalendar/vue3/themes/monarch/palettes/purple.css'

import { computed } from 'vue'

// Receive the shared task list from the parent component.
const props = defineProps({
  todos: {
    type: Array,
    default: () => [],
  },
})

// Let the parent open task details or a form with prefilled dates.
const emit = defineEmits(['select-task', 'create-task'])

// Recompute the calendar options and events when the task list changes.
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, themePlugin, interactionPlugin],

  // Open in the month view and set the height of its calendar grid.
  initialView: 'dayGridMonth',
  views: {
    dayGridMonth: {
      contentHeight: 440,
    },
  },

  // Use Slovak labels and start the week on Monday.
  locale: skLocale,
  firstDay: 1,

  // Set the order of the navigation buttons, title, and view switcher.
  headerToolbar: {
    start: 'prev,next today',
    center: 'title',
    end: 'dayGridMonth,timeGridWeek,timeGridDay',
  },

  // Add custom classes for styling the toolbar and highlighting the selected view.
  headerToolbarClass: 'calendar-toolbar',
  toolbarSectionClass: 'calendar-toolbar-section',
  toolbarTitleClass: 'calendar-title',
  buttonClass: ({ isSelected }) =>
  isSelected ? 'calendar-button is-selected' : 'calendar-button',

  // Convert each task into a FullCalendar event.
  events: props.todos.map((todo) => {
    // An unfinished task is overdue once its end date has passed.
    const overdue =
      !todo.is_finished && new Date(todo.date_to).getTime() < Date.now()

    let color = '#FF9AC4' // Pink for unfinished tasks.

    if (todo.is_finished) {
      color = '#ABD559' // Green for completed tasks.

    } else if (overdue) {
      color = '#FF1A72' // Bright pink for overdue tasks.
    }

    // Add a warning symbol so overdue tasks can also be recognized by their title.
    return {
      id: String(todo.id),
      title: overdue ? `⚠ ${todo.title}` : todo.title,
      start: todo.date_from,
      end: todo.date_to,
      color,
      contrastColor: '#ffffff',
    }
  }),

  // Send the clicked event's ID so the parent can show its task details.
  eventClick(info) {
    emit('select-task', info.event.id)
  },

  // Allow users to select a range of days or time slots.
  selectable: true,

  // Suggest a default task duration when the user clicks a single date or time.
  dateClick(info) {
    const start = new Date(info.date)

    if (info.allDay) start.setHours(9, 0, 0, 0)

    const end = new Date(start)
    if (info.allDay) {
      // A click on an all-day cell defaults to 09:00–10:00.
      end.setHours(10, 0, 0, 0)
    } else {
      // A click on a time slot defaults to a 30-minute task.
      end.setMinutes(end.getMinutes() + 30)
    }

    emit('create-task', { start, end })
  },

  // Use the selected range to prefill the new-task form.
  select(info) {
    const start = new Date(info.start)
    const end = new Date(info.end)

    if (info.allDay) {
      // FullCalendar returns an exclusive end date for all-day selections.
      // Use 10:00 on the last selected day as the task's end time.
      start.setHours(9, 0, 0, 0)
      end.setDate(end.getDate() - 1)
      end.setHours(10, 0, 0, 0)
    }

    emit('create-task', { start, end })
  },

  }))

</script>


<template>
  <!-- Render FullCalendar inside a wrapper for the component's custom styles. -->
  <div class="calendar-card">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>


<style scoped>

/* Let the calendar card shrink within the workspace grid. */
.calendar-card {
  min-width: 0;
  
  background: #fff;
  border: 1px solid #eadfe4;
  border-radius: 1rem;
}

/* Use :deep() to style the toolbar rendered inside the FullCalendar component. */
.calendar-card :deep(.calendar-toolbar) {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

/* Align the calendar title to the right of the navigation buttons. */
.calendar-card :deep(.calendar-toolbar-section:nth-child(2)) {
  justify-self: end;
}

/* Give the view switcher its own row below the navigation and title. */
.calendar-card :deep(.calendar-toolbar-section:nth-child(3)) {
  grid-column: 1 / -1;
  justify-self: start;
}

.calendar-card :deep(.calendar-title) {
  margin: 0;
  font-size: clamp(1rem, 2vw, 1.375rem);
  text-align: right;
}

/* Apply the application's pink palette to the calendar controls. */
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

/* Highlight the active month, week, or day view. */
.calendar-card :deep(.calendar-button.is-selected) {
  background: #b51766;
  border-color: #b51766;
  color: #fff;
}

/* Stack the toolbar sections and move the title to the top on narrow screens. */
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

