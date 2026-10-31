import { describe, it, expect, vi, beforeEach } from 'vitest'

import { flushPromises, mount as mountComponent } from '@vue/test-utils'
import App from '../App.vue'
import * as api from '../api.js'

// An in-memory stand-in for the server, so these tests exercise App.vue on its own.
// The real API is covered in server.spec.js.
const fakeServer = vi.hoisted(() => ({ todos: [], nextId: 1 }))

vi.mock('../api.js', () => {
  const copy = (todo) => ({ ...todo })
  const find = (id) => {
    const todo = fakeServer.todos.find((todo) => todo.id === id)
    if (!todo) throw new Error('Not found')
    return todo
  }
  return {
    fetchTodos: vi.fn(async () => fakeServer.todos.map(copy)),
    createTodo: vi.fn(async (title, priority) => {
      const todo = { id: fakeServer.nextId++, title, done: false, priority }
      fakeServer.todos.push(todo)
      return copy(todo)
    }),
    updateTodo: vi.fn(async (id, changes) => copy(Object.assign(find(id), changes))),
    deleteTodo: vi.fn(async (id) => {
      find(id)
      fakeServer.todos = fakeServer.todos.filter((todo) => todo.id !== id)
      return null
    }),
    clearCompletedTodos: vi.fn(async () => {
      fakeServer.todos = fakeServer.todos.filter((todo) => !todo.done)
      return null
    }),
  }
})

beforeEach(() => {
  fakeServer.todos = []
  fakeServer.nextId = 1
  vi.clearAllMocks()
})

async function mount(component) {
  const wrapper = mountComponent(component)
  await flushPromises()
  return wrapper
}

async function addTodo(wrapper, title) {
  await wrapper.find('.todo-input input').setValue(title)
  await wrapper.find('.todo-input').trigger('submit')
  await flushPromises()
}

function titles(wrapper) {
  return wrapper.findAll('.todo-item .title').map((node) => node.text())
}

describe('App', () => {
  it('adds a todo from the input', async () => {
    const wrapper = await mount(App)
    await addTodo(wrapper, 'Buy milk')

    expect(titles(wrapper)).toEqual(['Buy milk'])
    expect(wrapper.find('.todo-input input').element.value).toBe('')
  })

  it('ignores blank input', async () => {
    const wrapper = await mount(App)
    await addTodo(wrapper, '   ')

    expect(titles(wrapper)).toEqual([])
  })

  it('marks a todo done and not done', async () => {
    const wrapper = await mount(App)
    await addTodo(wrapper, 'Buy milk')
    const checkbox = wrapper.find('.todo-item input[type="checkbox"]')

    await checkbox.setValue(true)
    await flushPromises()
    expect(wrapper.find('.todo-item').classes()).toContain('done')
    expect(wrapper.find('.count').text()).toBe('All done')

    await checkbox.setValue(false)
    await flushPromises()
    expect(wrapper.find('.todo-item').classes()).not.toContain('done')
    expect(wrapper.find('.count').text()).toBe('1 item left')
  })

  it('deletes a todo', async () => {
    const wrapper = await mount(App)
    await addTodo(wrapper, 'Buy milk')
    await addTodo(wrapper, 'Walk dog')

    await wrapper.find('.todo-item .delete').trigger('click')
    await flushPromises()
    expect(titles(wrapper)).toEqual(['Walk dog'])
  })

  it('filters by all, active and completed', async () => {
    const wrapper = await mount(App)
    await addTodo(wrapper, 'Buy milk')
    await addTodo(wrapper, 'Walk dog')
    await wrapper.findAll('.todo-item input[type="checkbox"]')[0].setValue(true)
    await flushPromises()

    const filterButton = (label) =>
      wrapper.findAll('.filters button').find((button) => button.text() === label)

    await filterButton('Active').trigger('click')
    await flushPromises()
    expect(titles(wrapper)).toEqual(['Walk dog'])

    await filterButton('Completed').trigger('click')
    await flushPromises()
    expect(titles(wrapper)).toEqual(['Buy milk'])

    await filterButton('All').trigger('click')
    await flushPromises()
    expect(titles(wrapper)).toEqual(['Buy milk', 'Walk dog'])
  })

  it('clears completed todos', async () => {
    const wrapper = await mount(App)
    await addTodo(wrapper, 'Buy milk')
    await addTodo(wrapper, 'Walk dog')
    await addTodo(wrapper, 'Read book')
    const checkboxes = wrapper.findAll('.todo-item input[type="checkbox"]')
    await checkboxes[0].setValue(true)
    await flushPromises()
    await checkboxes[2].setValue(true)
    await flushPromises()

    await wrapper.find('.clear-completed').trigger('click')
    await flushPromises()
    expect(titles(wrapper)).toEqual(['Walk dog'])
    expect(wrapper.find('.clear-completed').exists()).toBe(false)
  })

  it('adds a todo as high priority from the input', async () => {
    const wrapper = await mount(App)
    await addTodo(wrapper, 'Buy milk')
    await wrapper.find('.todo-input .priority').trigger('click')
    await addTodo(wrapper, 'Pay rent')

    expect(titles(wrapper)).toEqual(['Pay rent', 'Buy milk'])
    expect(wrapper.find('.todo-item').classes()).toContain('high-priority')
    expect(wrapper.findAll('.todo-item')[1].classes()).not.toContain('high-priority')
    expect(wrapper.find('.todo-input .priority').attributes('aria-pressed')).toBe('false')
  })

  it('moves a flagged todo to the top and back when unflagged', async () => {
    const wrapper = await mount(App)
    await addTodo(wrapper, 'A')
    await addTodo(wrapper, 'B')
    await addTodo(wrapper, 'C')

    await wrapper.findAll('.todo-item .priority')[2].trigger('click')
    await flushPromises()
    expect(titles(wrapper)).toEqual(['C', 'A', 'B'])
    expect(wrapper.find('.todo-item .priority').attributes('aria-pressed')).toBe('true')

    await wrapper.find('.todo-item .priority').trigger('click')
    await flushPromises()
    expect(titles(wrapper)).toEqual(['A', 'B', 'C'])
    expect(wrapper.find('.high-priority').exists()).toBe(false)
  })

  it('keeps priority order within filters', async () => {
    const wrapper = await mount(App)
    await addTodo(wrapper, 'A')
    await addTodo(wrapper, 'B')
    await wrapper.findAll('.todo-item .priority')[1].trigger('click')
    await flushPromises()
    await wrapper.findAll('.todo-item input[type="checkbox"]')[1].setValue(true)
    await flushPromises()

    const filterButton = (label) =>
      wrapper.findAll('.filters button').find((button) => button.text() === label)

    await filterButton('Active').trigger('click')
    await flushPromises()
    expect(titles(wrapper)).toEqual(['B'])

    await filterButton('Completed').trigger('click')
    await flushPromises()
    expect(titles(wrapper)).toEqual(['A'])

    await filterButton('All').trigger('click')
    await flushPromises()
    expect(titles(wrapper)).toEqual(['B', 'A'])
  })

  it('shows the todos already saved on the server', async () => {
    fakeServer.todos = [
      { id: 1, title: 'Buy milk', done: true, priority: false },
      { id: 2, title: 'Pay rent', done: false, priority: true },
    ]
    const wrapper = await mount(App)

    expect(titles(wrapper)).toEqual(['Pay rent', 'Buy milk'])
    expect(wrapper.find('.todo-item.high-priority .title').text()).toBe('Pay rent')
    expect(wrapper.find('.todo-item.done .title').text()).toBe('Buy milk')
    expect(wrapper.find('.count').text()).toBe('1 item left')
  })

  it('sends each change to the API', async () => {
    const wrapper = await mount(App)
    await wrapper.find('.todo-input .priority').trigger('click')
    await addTodo(wrapper, 'Pay rent')
    expect(api.createTodo).toHaveBeenCalledWith('Pay rent', true)

    await wrapper.find('.todo-item input[type="checkbox"]').setValue(true)
    await flushPromises()
    expect(api.updateTodo).toHaveBeenLastCalledWith(1, { done: true })

    await wrapper.find('.todo-item .priority').trigger('click')
    await flushPromises()
    expect(api.updateTodo).toHaveBeenLastCalledWith(1, { priority: false })

    await wrapper.find('.clear-completed').trigger('click')
    await flushPromises()
    expect(api.clearCompletedTodos).toHaveBeenCalledOnce()
    expect(fakeServer.todos).toEqual([])
  })

  it('shows an error when the todos cannot be loaded', async () => {
    api.fetchTodos.mockRejectedValueOnce(new Error('offline'))
    const wrapper = await mount(App)

    expect(wrapper.find('.error').text()).toContain("Couldn't load your todos")
  })

  it('keeps the list unchanged and shows an error when a change fails to save', async () => {
    const wrapper = await mount(App)
    await addTodo(wrapper, 'Buy milk')

    api.deleteTodo.mockRejectedValueOnce(new Error('offline'))
    await wrapper.find('.todo-item .delete').trigger('click')
    await flushPromises()

    expect(titles(wrapper)).toEqual(['Buy milk'])
    expect(wrapper.find('.error').text()).toContain("wasn't saved")

    await addTodo(wrapper, 'Walk dog')
    expect(wrapper.find('.error').exists()).toBe(false)
  })
})
