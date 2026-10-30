import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

async function addTodo(wrapper, title) {
  await wrapper.find('.todo-input input').setValue(title)
  await wrapper.find('.todo-input').trigger('submit')
}

function titles(wrapper) {
  return wrapper.findAll('.todo-item .title').map((node) => node.text())
}

describe('App', () => {
  it('adds a todo from the input', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, 'Buy milk')

    expect(titles(wrapper)).toEqual(['Buy milk'])
    expect(wrapper.find('.todo-input input').element.value).toBe('')
  })

  it('ignores blank input', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, '   ')

    expect(titles(wrapper)).toEqual([])
  })

  it('marks a todo done and not done', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, 'Buy milk')
    const checkbox = wrapper.find('.todo-item input[type="checkbox"]')

    await checkbox.setValue(true)
    expect(wrapper.find('.todo-item').classes()).toContain('done')
    expect(wrapper.find('.count').text()).toBe('All done')

    await checkbox.setValue(false)
    expect(wrapper.find('.todo-item').classes()).not.toContain('done')
    expect(wrapper.find('.count').text()).toBe('1 item left')
  })

  it('deletes a todo', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, 'Buy milk')
    await addTodo(wrapper, 'Walk dog')

    await wrapper.find('.todo-item .delete').trigger('click')
    expect(titles(wrapper)).toEqual(['Walk dog'])
  })

  it('filters by all, active and completed', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, 'Buy milk')
    await addTodo(wrapper, 'Walk dog')
    await wrapper.findAll('.todo-item input[type="checkbox"]')[0].setValue(true)

    const filterButton = (label) =>
      wrapper.findAll('.filters button').find((button) => button.text() === label)

    await filterButton('Active').trigger('click')
    expect(titles(wrapper)).toEqual(['Walk dog'])

    await filterButton('Completed').trigger('click')
    expect(titles(wrapper)).toEqual(['Buy milk'])

    await filterButton('All').trigger('click')
    expect(titles(wrapper)).toEqual(['Buy milk', 'Walk dog'])
  })

  it('clears completed todos', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, 'Buy milk')
    await addTodo(wrapper, 'Walk dog')
    await addTodo(wrapper, 'Read book')
    const checkboxes = wrapper.findAll('.todo-item input[type="checkbox"]')
    await checkboxes[0].setValue(true)
    await checkboxes[2].setValue(true)

    await wrapper.find('.clear-completed').trigger('click')
    expect(titles(wrapper)).toEqual(['Walk dog'])
    expect(wrapper.find('.clear-completed').exists()).toBe(false)
  })

  it('adds a todo as high priority from the input', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, 'Buy milk')
    await wrapper.find('.todo-input .priority').trigger('click')
    await addTodo(wrapper, 'Pay rent')

    expect(titles(wrapper)).toEqual(['Pay rent', 'Buy milk'])
    expect(wrapper.find('.todo-item').classes()).toContain('high-priority')
    expect(wrapper.findAll('.todo-item')[1].classes()).not.toContain('high-priority')
    expect(wrapper.find('.todo-input .priority').attributes('aria-pressed')).toBe('false')
  })

  it('moves a flagged todo to the top and back when unflagged', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, 'A')
    await addTodo(wrapper, 'B')
    await addTodo(wrapper, 'C')

    await wrapper.findAll('.todo-item .priority')[2].trigger('click')
    expect(titles(wrapper)).toEqual(['C', 'A', 'B'])
    expect(wrapper.find('.todo-item .priority').attributes('aria-pressed')).toBe('true')

    await wrapper.find('.todo-item .priority').trigger('click')
    expect(titles(wrapper)).toEqual(['A', 'B', 'C'])
    expect(wrapper.find('.high-priority').exists()).toBe(false)
  })

  it('keeps priority order within filters', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, 'A')
    await addTodo(wrapper, 'B')
    await wrapper.findAll('.todo-item .priority')[1].trigger('click')
    await wrapper.findAll('.todo-item input[type="checkbox"]')[1].setValue(true)

    const filterButton = (label) =>
      wrapper.findAll('.filters button').find((button) => button.text() === label)

    await filterButton('Active').trigger('click')
    expect(titles(wrapper)).toEqual(['B'])

    await filterButton('Completed').trigger('click')
    expect(titles(wrapper)).toEqual(['A'])

    await filterButton('All').trigger('click')
    expect(titles(wrapper)).toEqual(['B', 'A'])
  })
})
