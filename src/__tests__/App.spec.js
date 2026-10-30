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
    expect(wrapper.find('.count').text()).toBe('0 items left')

    await checkbox.setValue(false)
    expect(wrapper.find('.todo-item').classes()).not.toContain('done')
    expect(wrapper.find('.count').text()).toBe('1 item left')
  })

  it('deletes a todo', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, 'Buy milk')
    await addTodo(wrapper, 'Walk dog')

    await wrapper.find('.todo-item button').trigger('click')
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
})
