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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
}

.high-priority {
  border-left: 4px solid #e08a00;
}

label {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.done .title {
  text-decoration: line-through;
  color: #999;
}

button {
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
}

.priority {
  font-size: 16px;
  color: #bbb;
}

.priority[aria-pressed='true'] {
  color: #e08a00;
}

.delete {
  color: #c33;
}
</style>
