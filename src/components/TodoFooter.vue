<script setup>
defineProps({
  remaining: { type: Number, required: true },
  filter: { type: String, required: true },
})

const emit = defineEmits(['update:filter'])

const filters = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]
</script>

<template>
  <footer class="todo-footer">
    <span class="remaining">{{ remaining }} {{ remaining === 1 ? 'item' : 'items' }} left</span>
    <div class="filters">
      <button
        v-for="option in filters"
        :key="option.value"
        type="button"
        :class="{ active: filter === option.value }"
        :aria-pressed="filter === option.value"
        @click="emit('update:filter', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </footer>
</template>

<style scoped>
.todo-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--muted);
}

.filters {
  display: flex;
  gap: 0.25rem;
}

button {
  padding: 0.25rem 0.6rem;
  border: 1px solid transparent;
  border-radius: 4px;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

button.active {
  border-color: var(--accent);
  color: var(--accent);
}
</style>
