<script setup>
import TodoItem from './TodoItem.vue'

defineProps({
  todos: { type: Array, required: true },
})

const emit = defineEmits(['toggle', 'remove'])
</script>

<template>
  <ul v-if="todos.length" class="todo-list">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle="emit('toggle', $event)"
      @remove="emit('remove', $event)"
    />
  </ul>
  <p v-else class="empty">Nothing to show here.</p>
</template>

<style scoped>
.todo-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.empty {
  margin: 0;
  padding: 1.5rem 0;
  text-align: center;
  color: var(--muted);
}
</style>
