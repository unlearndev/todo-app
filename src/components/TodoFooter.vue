<script setup>
defineProps({
  remaining: { type: Number, required: true },
})

const filter = defineModel('filter', { type: String, required: true })

const filters = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]
</script>

<template>
  <footer class="todo-footer">
    <span class="count">{{ remaining }} {{ remaining === 1 ? 'item' : 'items' }} left</span>
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
    </div>
  </footer>
</template>

<style scoped>
.todo-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 14px;
}

.filters {
  display: flex;
  gap: 4px;
}

button {
  padding: 4px 8px;
  border: 1px solid transparent;
  background: none;
  cursor: pointer;
}

button.selected {
  border-color: #999;
  border-radius: 4px;
}
</style>
