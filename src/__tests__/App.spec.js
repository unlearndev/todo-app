import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

async function addTodo(wrapper, text) {
  await wrapper.find('.todo-input input').setValue(text)
  await wrapper.find('.todo-input').trigger('submit')
}

const itemTexts = (wrapper) => wrapper.findAll('.todo-item span').map((span) => span.text())

describe('App', () => {
  it('shows the empty state with no todos', () => {
    const wrapper = mount(App)
    expect(wrapper.find('.empty').exists()).toBe(true)
    expect(wrapper.find('.remaining').text()).toBe('0 items left')
  })

  it('adds trimmed todos, ignores empty input and clears the field', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, '   ')
    await addTodo(wrapper, '  Buy milk  ')

    expect(itemTexts(wrapper)).toEqual(['Buy milk'])
    expect(wrapper.find('.todo-input input').element.value).toBe('')
    expect(wrapper.find('.remaining').text()).toBe('1 item left')
  })

  it('toggles and removes todos and updates the count', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, 'One')
    await addTodo(wrapper, 'Two')
    expect(wrapper.find('.remaining').text()).toBe('2 items left')

    await wrapper.find('.todo-item input').setValue(true)
    expect(wrapper.find('.todo-item').classes()).toContain('done')
    expect(wrapper.find('.remaining').text()).toBe('1 item left')

    await wrapper.find('.todo-item .remove').trigger('click')
    expect(itemTexts(wrapper)).toEqual(['Two'])
  })

  it('filters todos, including newly added and toggled ones', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, 'One')
    await addTodo(wrapper, 'Two')

    const [, active, completed] = wrapper.findAll('.filters button')

    await active.trigger('click')
    expect(active.classes()).toContain('active')
    await wrapper.find('.todo-item input').setValue(true)
    expect(itemTexts(wrapper)).toEqual(['Two'])
    await addTodo(wrapper, 'Three')
    expect(itemTexts(wrapper)).toEqual(['Two', 'Three'])

    await completed.trigger('click')
    expect(itemTexts(wrapper)).toEqual(['One'])
  })
})
