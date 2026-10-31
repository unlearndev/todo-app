<script setup>
import { computed, ref } from 'vue'
import TodoInput from './components/TodoInput.vue'
import TodoList from './components/TodoList.vue'
import TodoFooter from './components/TodoFooter.vue'

const todos = ref([])
const filter = ref('all')
let nextId = 1

const filteredTodos = computed(() => {
  if (filter.value === 'active') return todos.value.filter((todo) => !todo.done)
  if (filter.value === 'completed') return todos.value.filter((todo) => todo.done)
  return todos.value
})

const sortedTodos = computed(() =>
  [...filteredTodos.value].sort((a, b) => b.priority - a.priority),
)

const remaining = computed(() => todos.value.filter((todo) => !todo.done).length)
const completed = computed(() => todos.value.length - remaining.value)

function addTodo(title, priority = false) {
  todos.value.push({ id: nextId++, title, done: false, priority })
}

function toggleTodo(id) {
  const todo = todos.value.find((todo) => todo.id === id)
  if (todo) todo.done = !todo.done
}

function togglePriority(id) {
  const todo = todos.value.find((todo) => todo.id === id)
  if (todo) todo.priority = !todo.priority
}

function deleteTodo(id) {
  todos.value = todos.value.filter((todo) => todo.id !== id)
}

function clearCompleted() {
  todos.value = todos.value.filter((todo) => !todo.done)
}
</script>

<template>
  <main class="todo-app">
    <h1>Todos</h1>
    <TodoInput @add="addTodo" />
    <TodoList
      :todos="sortedTodos"
      @toggle="toggleTodo"
      @toggle-priority="togglePriority"
      @delete="deleteTodo"
    />
    <TodoFooter
      v-if="todos.length"
      v-model:filter="filter"
      :remaining="remaining"
      :completed="completed"
      @clear-completed="clearCompleted"
    />
  </main>
</template>

<style>
:root {
  color-scheme: dark;
  --bg: #0d0f14;
  --surface: #171a21;
  --surface-raised: #1f232c;
  --border: #2a2f3a;
  --text: #e8eaf0;
  --text-muted: #8b91a1;
  --text-faint: #5c6273;
  --accent: #7c8cff;
  --accent-strong: #98a4ff;
  --priority: #ffb020;
  --priority-soft: rgba(255, 176, 32, 0.1);
  --danger: #ff6b6b;
  --radius: 14px;
  --tap: 44px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  min-height: 100vh;
  min-height: 100dvh;
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    sans-serif;
  background:
    radial-gradient(120% 60% at 50% 0%, #1a1e2b 0%, var(--bg) 60%) fixed,
    var(--bg);
  color: var(--text);
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
}

button,
input {
  font: inherit;
  color: inherit;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.todo-app {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  padding: max(24px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right))
    max(32px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
}

.todo-app h1 {
  margin: 8px 4px 20px;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

@media (min-width: 640px) {
  .todo-app {
    padding-top: 64px;
  }

  .todo-app h1 {
    font-size: 40px;
  }
}
</style>
