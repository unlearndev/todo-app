<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])

const text = ref('')

function submit() {
  const value = text.value.trim()
  if (!value) return
  emit('add', value)
  text.value = ''
}
</script>

<template>
  <form class="todo-input" @submit.prevent="submit">
    <input v-model="text" type="text" placeholder="What needs doing?" aria-label="New todo" />
    <button type="submit">Add</button>
  </form>
</template>

<style scoped>
.todo-input {
  display: flex;
  gap: 0.5rem;
}

input {
  flex: 1;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font: inherit;
}

button {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  background: var(--accent);
  color: #fff;
  font: inherit;
  cursor: pointer;
}
</style>
