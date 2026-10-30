<script setup>
defineProps({
  todo: { type: Object, required: true },
})

const emit = defineEmits(['toggle', 'remove'])
</script>

<template>
  <li class="todo-item" :class="{ done: todo.done }">
    <label>
      <input type="checkbox" :checked="todo.done" @change="emit('toggle', todo.id)" />
      <span>{{ todo.text }}</span>
    </label>
    <button
      type="button"
      class="remove"
      :aria-label="`Delete ${todo.text}`"
      @click="emit('remove', todo.id)"
    >
      ×
    </button>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--border);
}

label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
  cursor: pointer;
}

.done span {
  text-decoration: line-through;
  color: var(--muted);
}

.remove {
  border: none;
  background: none;
  color: var(--muted);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
}

.remove:hover {
  color: #c0392b;
}
</style>
