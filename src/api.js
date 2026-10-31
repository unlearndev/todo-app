// Thin wrapper around the todo API in server/. Holds no state of its own.

async function request(path, options = {}) {
  const response = await fetch(`/api/todos${path}`, {
    ...options,
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
  })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.status === 204 ? null : response.json()
}

export const fetchTodos = () => request('')

export const createTodo = (title, priority) =>
  request('', { method: 'POST', body: JSON.stringify({ title, priority }) })

export const updateTodo = (id, changes) =>
  request(`/${id}`, { method: 'PATCH', body: JSON.stringify(changes) })

export const deleteTodo = (id) => request(`/${id}`, { method: 'DELETE' })

export const clearCompletedTodos = () => request('/completed', { method: 'DELETE' })
