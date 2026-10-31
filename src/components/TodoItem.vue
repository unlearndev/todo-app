<script setup>
defineProps({
  todo: { type: Object, required: true },
})

const emit = defineEmits(['toggle', 'toggle-priority', 'delete'])
</script>

<template>
  <li class="todo-item" :class="{ done: todo.done, 'high-priority': todo.priority }">
    <label>
      <input type="checkbox" :checked="todo.done" @change="emit('toggle')" />
      <span class="title">{{ todo.title }}</span>
    </label>
    <button
      type="button"
      class="priority"
      aria-label="High priority"
      title="Mark as high priority"
      :aria-pressed="todo.priority"
      @click="emit('toggle-priority')"
    >
      ⚑
    </button>
    <button type="button" class="delete" aria-label="Delete" @click="emit('delete')">×</button>
  </li>
</template>

<style scoped>
.todo-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2px;
  min-height: 56px;
  padding: 4px 4px 4px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.high-priority {
  background: linear-gradient(90deg, var(--priority-soft), transparent 70%), var(--surface);
  border-color: rgba(255, 176, 32, 0.35);
}

.high-priority::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: var(--priority);
}

.high-priority .title {
  font-weight: 600;
}

label {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
  min-height: var(--tap);
  cursor: pointer;
}

input[type='checkbox'] {
  appearance: none;
  flex-shrink: 0;
  display: grid;
  place-content: center;
  width: 24px;
  height: 24px;
  margin: 0;
  border: 2px solid var(--text-faint);
  border-radius: 50%;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

input[type='checkbox']::after {
  content: '';
  width: 6px;
  height: 11px;
  margin-top: -2px;
  border: solid #0d0f14;
  border-width: 0 2.5px 2.5px 0;
  transform: rotate(45deg) scale(0);
  transition: transform 0.15s ease;
}

input[type='checkbox']:checked {
  background: var(--accent);
  border-color: var(--accent);
}

input[type='checkbox']:checked::after {
  transform: rotate(45deg) scale(1);
}

.title {
  font-size: 16px;
  overflow-wrap: anywhere;
  transition: color 0.15s ease;
}

.done .title {
  text-decoration: line-through;
  color: var(--text-faint);
}

button {
  flex-shrink: 0;
  width: var(--tap);
  height: var(--tap);
  border: none;
  border-radius: 10px;
  background: none;
  font-size: 22px;
  line-height: 1;
  color: var(--text-faint);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

button:active {
  background: var(--surface-raised);
}

.priority {
  font-size: 17px;
}

.priority[aria-pressed='true'] {
  color: var(--priority);
}

@media (hover: hover) {
  .priority:hover {
    color: var(--priority);
    background: var(--priority-soft);
  }

  .delete:hover {
    color: var(--danger);
    background: rgba(255, 107, 107, 0.1);
  }
}
</style>
