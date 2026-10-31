<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])
const title = ref('')
const priority = ref(false)

function submit() {
  const trimmed = title.value.trim()
  if (!trimmed) return
  emit('add', trimmed, priority.value)
  title.value = ''
  priority.value = false
}
</script>

<template>
  <form class="todo-input" @submit.prevent="submit">
    <input v-model="title" type="text" placeholder="What needs doing?" aria-label="New todo" />
    <button
      type="button"
      class="priority"
      aria-label="High priority"
      title="Mark as high priority"
      :aria-pressed="priority"
      @click="priority = !priority"
    >
      ⚑
    </button>
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

.priority {
  color: #bbb;
}

.priority[aria-pressed='true'] {
  color: #e08a00;
}
</style>
