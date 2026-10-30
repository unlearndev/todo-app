<script setup>
import { computed, ref } from 'vue'
import TodoInput from './components/TodoInput.vue'
import TodoList from './components/TodoList.vue'
import TodoFooter from './components/TodoFooter.vue'

const todos = ref([])
const filter = ref('all')

const filteredTodos = computed(() => {
  if (filter.value === 'active') return todos.value.filter((todo) => !todo.done)
  if (filter.value === 'completed') return todos.value.filter((todo) => todo.done)
  return todos.value
})

const remaining = computed(() => todos.value.filter((todo) => !todo.done).length)

function addTodo(text) {
  todos.value.push({ id: crypto.randomUUID(), text, done: false })
}

function toggleTodo(id) {
  const todo = todos.value.find((todo) => todo.id === id)
  if (todo) todo.done = !todo.done
}

function removeTodo(id) {
  todos.value = todos.value.filter((todo) => todo.id !== id)
}
</script>

<template>
  <main class="app">
    <h1>Todos</h1>
    <TodoInput @add="addTodo" />
    <TodoList :todos="filteredTodos" @toggle="toggleTodo" @remove="removeTodo" />
    <TodoFooter v-model:filter="filter" :remaining="remaining" />
  </main>
</template>

<style>
:root {
  --accent: #2f6fde;
  --border: #e2e4e8;
  --muted: #8a8f98;
}

body {
  margin: 0;
  background: #f5f6f8;
  color: #1f2328;
  font-family: system-ui, -apple-system, sans-serif;
}
</style>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 480px;
  margin: 3rem auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 8%);
}

h1 {
  margin: 0;
  font-size: 1.5rem;
}
</style>
