<script setup>

// Receive the active view from the parent component.
defineProps({
  activeTab: String,
})

// Let the parent handle navigation and open the new-task form.
const emit = defineEmits(['change-tab', 'new-task']);

</script>

<template>

    <header class = "header">
        <div class="header-main">

            <!-- Display the application logo and title. -->
            <div class="header-logo" >
                
                <img src="/favicon.svg" alt="Logo">

                <h1>Môj TODO List</h1>
            </div>

            <!-- Highlight the active view and emit the selected view when a button is clicked. -->
            <nav aria-label="Main navigation" class="header-nav">
                <button
                type="button"
                :class="{ active: activeTab === 'calendar' }"
                @click="emit('change-tab', 'calendar')"
                >
                <img src="/icons/calendar.svg" alt="" class="button-icon">
                Kalendár
                </button>

                <button
                type="button"
                :class="{ active: activeTab === 'list' }"
                @click="emit('change-tab', 'list')"
                >
                <img src="/icons/task.svg" alt="" class="button-icon">
                Zoznam úloh
                </button>
            </nav>
        </div>
        
        <!-- Request a new task form from either view. -->
        <button type="button" class="add-task" @click="emit('new-task')">+ Nová úloha</button>
    </header>

</template>

<style scoped>

/* Visually distinguish the button for the current view. */
.active {
    background-color: #e61685;
    color: #ffd5ee;
    font-weight: 600;
}

</style>