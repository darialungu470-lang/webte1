const API_URL = 'https://wt1zadanie.iolab.sk'

export async function getTodos(name) {
  const response = await fetch(`${API_URL}/api/${encodeURIComponent(name)}`)

  if (!response.ok) {
    throw new Error(`Načítanie úloh zlyhalo (HTTP ${response.status}).`)
  }

  const data = await response.json()
  return data.todos
}

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

export async function setTodoFinished(name, todoId, finished) {
  const action = finished ? 'done' : 'undone'
  const url = `${API_URL}/api/${encodeURIComponent(name)}/${encodeURIComponent(todoId)}/${action}`

  const response = await fetch(url, { method: 'PATCH' })

  if (!response.ok) {
    throw new Error(`Zmena stavu úlohy zlyhala (HTTP ${response.status}).`)
  }
}

export async function deleteTodo(name, todoId) {
  const url = `${API_URL}/api/${encodeURIComponent(name)}/${encodeURIComponent(todoId)}`
  const response = await fetch(url, { method: 'DELETE' })

  if (!response.ok) {
    throw new Error(`Odstránenie úlohy zlyhalo (HTTP ${response.status}).`)
  }
}

export async function resetTodos(name) {
  const url = `${API_URL}/api/${encodeURIComponent(name)}/reset`
  const response = await fetch(url, { method: 'POST' })

  if (!response.ok) {
    throw new Error(`Obnovenie ukážkových úloh zlyhalo (HTTP ${response.status}).`)
  }
}