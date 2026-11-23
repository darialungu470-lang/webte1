// Base URL of the course REST API.
const API_URL = 'https://wt1zadanie.iolab.sk'

// Load the student's tasks. Encode the identifier so it can be used in the URL.
export async function getTodos(name) {
  const response = await fetch(`${API_URL}/api/${encodeURIComponent(name)}`)

  // Fetch returns a response for HTTP errors, so check the status explicitly.
  if (!response.ok) {
    throw new Error(`Načítanie úloh zlyhalo (HTTP ${response.status}).`)
  }

  // The API returns a student object with the task list in its todos property.
  const data = await response.json()
  return data.todos
}

// Create a task by sending its data as JSON to the student's endpoint.
export async function createTodo(name, taskData) {
  const response = await fetch(`${API_URL}/api/${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  })

  if (!response.ok) {
    throw new Error(`Uloženie úlohy zlyhalo (HTTP ${response.status}).`)
  }
}

// Replace an existing task's data with the updated values from the form.
export async function updateTodo(name, todoId, taskData) {
  const url = `${API_URL}/api/${encodeURIComponent(name)}/${encodeURIComponent(todoId)}`

  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  })

  if (!response.ok) {
    throw new Error(`Úprava úlohy zlyhala (HTTP ${response.status}).`)
  }
}

// Mark a task as complete or reopen it through the corresponding PATCH endpoint.
export async function setTodoFinished(name, todoId, finished) {
  const action = finished ? 'done' : 'undone'
  const url = `${API_URL}/api/${encodeURIComponent(name)}/${encodeURIComponent(todoId)}/${action}`

  const response = await fetch(url, { method: 'PATCH' })

  if (!response.ok) {
    throw new Error(`Zmena stavu úlohy zlyhala (HTTP ${response.status}).`)
  }
}

// Delete the task identified by the student name and task ID.
export async function deleteTodo(name, todoId) {
  const url = `${API_URL}/api/${encodeURIComponent(name)}/${encodeURIComponent(todoId)}`
  const response = await fetch(url, { method: 'DELETE' })

  if (!response.ok) {
    throw new Error(`Odstránenie úlohy zlyhalo (HTTP ${response.status}).`)
  }
}

// Replace the student's current tasks with the sample tasks on the server.
export async function resetTodos(name) {
  const url = `${API_URL}/api/${encodeURIComponent(name)}/reset`
  const response = await fetch(url, { method: 'POST' })

  if (!response.ok) {
    throw new Error(`Obnovenie ukážkových úloh zlyhalo (HTTP ${response.status}).`)
  }
}