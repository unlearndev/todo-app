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
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  padding: 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: border-color 0.15s ease;
}

.todo-input:focus-within {
  border-color: var(--accent);
}

input {
  flex: 1;
  min-width: 0;
  height: var(--tap);
  padding: 0 10px;
  /* 16px stops iOS zooming in on focus */
  font-size: 16px;
  background: transparent;
  border: none;
  outline: none;
}

input::placeholder {
  color: var(--text-faint);
}

button {
  flex-shrink: 0;
  height: var(--tap);
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    transform 0.1s ease;
}

button:active {
  transform: scale(0.96);
}

.priority {
  width: var(--tap);
  font-size: 18px;
  color: var(--text-faint);
  background: transparent;
}

.priority[aria-pressed='true'] {
  color: var(--priority);
  background: var(--priority-soft);
}

button[type='submit'] {
  padding: 0 18px;
  font-weight: 600;
  color: #0d0f14;
  background: var(--accent);
}

@media (hover: hover) {
  .priority:hover {
    color: var(--priority);
  }

  button[type='submit']:hover {
    background: var(--accent-strong);
  }
}
</style>
