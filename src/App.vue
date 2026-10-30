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

const remaining = computed(() => todos.value.filter((todo) => !todo.done).length)

function addTodo(title) {
  todos.value.push({ id: nextId++, title, done: false })
}

function toggleTodo(id) {
  const todo = todos.value.find((todo) => todo.id === id)
  if (todo) todo.done = !todo.done
}

function deleteTodo(id) {
  todos.value = todos.value.filter((todo) => todo.id !== id)
}
</script>

<template>
  <main class="todo-app">
    <h1>Todos</h1>
    <TodoInput @add="addTodo" />
    <TodoList :todos="filteredTodos" @toggle="toggleTodo" @delete="deleteTodo" />
    <TodoFooter v-if="todos.length" v-model:filter="filter" :remaining="remaining" />
  </main>
</template>

<style>
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #f5f5f5;
  color: #222;
}

.todo-app {
  max-width: 480px;
  margin: 48px auto;
  padding: 0 16px;
}
</style>
