<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])
const title = ref('')

function submit() {
  const trimmed = title.value.trim()
  if (!trimmed) return
  emit('add', trimmed)
  title.value = ''
}
</script>

<template>
  <form class="todo-input" @submit.prevent="submit">
    <input v-model="title" type="text" placeholder="What needs doing?" aria-label="New todo" />
    <button type="submit">Add</button>
  </form>
</template>

<style scoped>
.todo-input {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

input {
  flex: 1;
  padding: 8px 12px;
  font-size: 16px;
}

button {
  padding: 8px 16px;
  font-size: 16px;
}
</style>
