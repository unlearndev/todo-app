<script setup>
defineProps({
  remaining: { type: Number, required: true },
  completed: { type: Number, required: true },
})

const emit = defineEmits(['clear-completed'])

const filter = defineModel('filter', { type: String, required: true })

const filters = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]
</script>

<template>
  <footer class="todo-footer">
    <span v-if="remaining === 0" class="count">All done</span>
    <span v-else class="count">{{ remaining }} {{ remaining === 1 ? 'item' : 'items' }} left</span>
    <div class="filters">
      <button
        v-for="option in filters"
        :key="option.value"
        type="button"
        :class="{ selected: filter === option.value }"
        :aria-pressed="filter === option.value"
        @click="filter = option.value"
      >
        {{ option.label }}
      </button>
      <button v-if="completed > 0" type="button" class="clear-completed" @click="emit('clear-completed')">
        Clear completed
      </button>
    </div>
  </footer>
</template>

<style scoped>
.todo-footer {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  margin-top: 16px;
  font-size: 14px;
}

.count {
  padding: 0 4px;
  color: var(--text-muted);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

button {
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text-muted);
  font-size: 14px;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

button.selected {
  color: #0d0f14;
  background: var(--accent);
  border-color: var(--accent);
  font-weight: 600;
}

.clear-completed {
  margin-left: auto;
  border-color: transparent;
  background: transparent;
}

@media (hover: hover) {
  button:not(.selected):hover {
    color: var(--text);
    border-color: var(--text-faint);
  }

  .clear-completed:hover {
    color: var(--danger);
  }
}

@media (min-width: 480px) {
  .todo-footer {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .clear-completed {
    margin-left: 0;
  }
}
</style>
