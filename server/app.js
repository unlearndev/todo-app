import express from 'express'

function validationError(body, { partial }) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a JSON object'
  }
  if (!partial || 'title' in body) {
    if (typeof body.title !== 'string' || !body.title.trim()) return 'title must be a non-empty string'
  }
  for (const key of ['done', 'priority']) {
    if (key in body && typeof body[key] !== 'boolean') return `${key} must be true or false`
  }
  return null
}

function parseId(req, res) {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) {
    res.status(404).json({ error: 'Todo not found' })
    return null
  }
  return id
}

export function createApp(todos) {
  const app = express()
  app.use(express.json())

  app.get('/api/todos', (req, res) => {
    res.json(todos.list())
  })

  app.post('/api/todos', (req, res) => {
    const error = validationError(req.body, { partial: false })
    if (error) return res.status(400).json({ error })
    const todo = todos.create({ title: req.body.title.trim(), priority: req.body.priority ?? false })
    res.status(201).json(todo)
  })

  // Registered before /:id so "completed" isn't treated as an id.
  app.delete('/api/todos/completed', (req, res) => {
    todos.clearCompleted()
    res.status(204).end()
  })

  app.patch('/api/todos/:id', (req, res) => {
    const id = parseId(req, res)
    if (id === null) return
    const error = validationError(req.body, { partial: true })
    if (error) return res.status(400).json({ error })

    const changes = {}
    if ('title' in req.body) changes.title = req.body.title.trim()
    if ('done' in req.body) changes.done = req.body.done
    if ('priority' in req.body) changes.priority = req.body.priority

    const todo = todos.update(id, changes)
    if (!todo) return res.status(404).json({ error: 'Todo not found' })
    res.json(todo)
  })

  app.delete('/api/todos/:id', (req, res) => {
    const id = parseId(req, res)
    if (id === null) return
    if (!todos.remove(id)) return res.status(404).json({ error: 'Todo not found' })
    res.status(204).end()
  })

  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  // Malformed JSON bodies land here from express.json(). Express only treats a
  // handler as an error handler when it takes four arguments, so keep `_next`.
  app.use((err, req, res, _next) => {
    const status = err.status ?? err.statusCode ?? 500
    res.status(status).json({ error: status === 500 ? 'Internal server error' : err.message })
  })

  return app
}
