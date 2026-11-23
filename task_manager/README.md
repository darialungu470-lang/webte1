## Môj TODO List

Môj TODO List is a web application for managing personal tasks and scheduling them in a calendar. Enter your student identifier to load your tasks from the course REST API. The list and calendar share the same task data and update after each successful change.

## Features

- Month, week, and day calendar views.
- Task creation through a form or by selecting a date or time range in the calendar.
- Task details, editing, completion, reopening, and deletion.
- Search by title, filter by status, and sort by start or end date.
- Visual indicators for completed and overdue tasks.
- Restore the five sample tasks after confirming the reset.

## Technologies

- HTML, CSS, and JavaScript for the interface and application logic.
- Vue 3 for reusable components and reactive state.
- Vite for local development and builds.
- FullCalendar for the calendar with Slovak localization.
- Fetch API for communication with the course REST API.

## Installation and startup

Install npm and a Node.js version compatible with the project's Vite version. From the project root, where package.json is located, run:

npm install
npm run dev

Open the URL printed by Vite in the terminal. Enter your student identifier in Identifikátor študenta and click Načítať úlohy. An internet connection is required to load and save tasks.

## Project structure

File or directory	             Purpose

index.html	                   HTML entry point with the page title and favicon link.
public/	                       Favicon and interface icons.
src/App.vue	                   Shared task state, view switching, and action handlers.
src/components/	               Header, footer, forms, calendar, and task list.
src/assets/	                   Global styles and interface assets. Component-specific styles live in the components.
src/services/todoApi.js	       REST API functions kept separate from the user interface.
src/utils/dates.js	           Date formatting helper.

## API documentation

See the REST API documentation for available operations and request formats:

https://wt1zadanie.iolab.sk/docs

## Font licenses
The local font files are licensed under the SIL Open Font License 1.1 (OFL-1.1).

Font	            Copyright	                                License

DM Serif Display	© 2014–2018 Adobe and © 2019 Google LLC	    DM Serif Display OFL.txt