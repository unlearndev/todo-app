// @vitest-environment node
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { createApp } from '../../server/app.js'
import { openTodoDb } from '../../server/db.js'

function startServer(db) {
  return new Promise((resolve) => {
    const server = createApp(db).listen(0, () => {
      const { port } = server.address()
      resolve({ server, url: `http://127.0.0.1:${port}/api/todos` })
    })
  })
}

const jsonHeaders = { 'Content-Type': 'application/json' }
const encode = (body) => (typeof body === 'string' ? body : JSON.stringify(body))

const post = (url, body) => fetch(url, { method: 'POST', headers: jsonHeaders, body: encode(body) })
const patch = (url, body) => fetch(url, { method: 'PATCH', headers: jsonHeaders, body: encode(body) })
const remove = (url) => fetch(url, { method: 'DELETE' })

describe('todo API', () => {
  let db
  let server
  let url

  beforeEach(async () => {
    db = openTodoDb(':memory:')
    ;({ server, url } = await startServer(db))
  })

  afterEach(async () => {
    await new Promise((resolve) => server.close(resolve))
    db.close()
  })

  it('starts with no todos', async () => {
    const response = await fetch(url)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual([])
  })

  it('creates todos and lists them in the order they were added', async () => {
    const first = await post(url, { title: '  Buy milk  ' })
    expect(first.status).toBe(201)
    expect(await first.json()).toEqual({ id: 1, title: 'Buy milk', done: false, priority: false })

    const second = await post(url, { title: 'Pay rent', priority: true })
    expect(await second.json()).toEqual({ id: 2, title: 'Pay rent', done: false, priority: true })

    const list = await (await fetch(url)).json()
    expect(list.map((todo) => todo.title)).toEqual(['Buy milk', 'Pay rent'])
  })

  it('rejects todos without a title', async () => {
    for (const body of [{}, { title: '   ' }, { title: 42 }, []]) {
      const response = await post(url, body)
      expect(response.status).toBe(400)
    }
    expect(await (await fetch(url)).json()).toEqual([])
  })

  it('rejects a priority that is not a boolean', async () => {
    const response = await post(url, { title: 'Buy milk', priority: 'yes' })
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'priority must be true or false' })
  })

  it('rejects malformed JSON', async () => {
    const response = await post(url, '{"title":')
    expect(response.status).toBe(400)
    expect(await response.json()).toHaveProperty('error')
  })

  it('marks a todo done and not done', async () => {
    await post(url, { title: 'Buy milk' })

    const done = await patch(`${url}/1`, { done: true })
    expect(done.status).toBe(200)
    expect(await done.json()).toEqual({ id: 1, title: 'Buy milk', done: true, priority: false })

    const undone = await patch(`${url}/1`, { done: false })
    expect((await undone.json()).done).toBe(false)
  })

  it('flags and unflags a todo as high priority without touching other fields', async () => {
    await post(url, { title: 'Buy milk' })
    await patch(`${url}/1`, { done: true })

    const flagged = await patch(`${url}/1`, { priority: true })
    expect(await flagged.json()).toEqual({ id: 1, title: 'Buy milk', done: true, priority: true })

    const unflagged = await patch(`${url}/1`, { priority: false })
    expect(await unflagged.json()).toEqual({ id: 1, title: 'Buy milk', done: true, priority: false })
  })

  it('rejects invalid updates', async () => {
    await post(url, { title: 'Buy milk' })

    expect((await patch(`${url}/1`, { done: 'true' })).status).toBe(400)
    expect((await patch(`${url}/1`, { title: '' })).status).toBe(400)
    expect((await (await fetch(url)).json())[0]).toEqual({
      id: 1,
      title: 'Buy milk',
      done: false,
      priority: false,
    })
  })

  it('returns 404 when updating or deleting a todo that does not exist', async () => {
    expect((await patch(`${url}/99`, { done: true })).status).toBe(404)
    expect((await patch(`${url}/abc`, { done: true })).status).toBe(404)
    expect((await remove(`${url}/99`)).status).toBe(404)
  })

  it('deletes a todo', async () => {
    await post(url, { title: 'Buy milk' })
    await post(url, { title: 'Walk dog' })

    const response = await remove(`${url}/1`)
    expect(response.status).toBe(204)

    const list = await (await fetch(url)).json()
    expect(list.map((todo) => todo.title)).toEqual(['Walk dog'])
  })

  it('clears completed todos', async () => {
    await post(url, { title: 'Buy milk' })
    await post(url, { title: 'Walk dog' })
    await post(url, { title: 'Read book' })
    await patch(`${url}/1`, { done: true })
    await patch(`${url}/3`, { done: true })

    const response = await remove(`${url}/completed`)
    expect(response.status).toBe(204)

    const list = await (await fetch(url)).json()
    expect(list.map((todo) => todo.title)).toEqual(['Walk dog'])
  })

  it('returns 404 JSON for unknown API routes', async () => {
    const response = await fetch(url.replace('/todos', '/nope'))
    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: 'Not found' })
  })
})

describe('todo database', () => {
  let dir

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'todo-db-'))
  })

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  it('keeps todos after the database is closed and reopened', () => {
    const file = join(dir, 'nested', 'todos.sqlite')

    const first = openTodoDb(file)
    first.create({ title: 'Buy milk' })
    const rent = first.create({ title: 'Pay rent', priority: true })
    first.update(rent.id, { done: true })
    first.close()

    const second = openTodoDb(file)
    expect(second.list()).toEqual([
      { id: 1, title: 'Buy milk', done: false, priority: false },
      { id: 2, title: 'Pay rent', done: true, priority: true },
    ])
    second.close()
  })
})
