import { fileURLToPath } from 'node:url'
import { createApp } from './app.js'
import { openTodoDb } from './db.js'

const port = Number(process.env.PORT ?? 3001)
const dbFile = process.env.TODO_DB ?? fileURLToPath(new URL('../data/todos.sqlite', import.meta.url))

const todos = openTodoDb(dbFile)
const server = createApp(todos).listen(port, () => {
  console.log(`Todo API listening on http://localhost:${port} (database: ${dbFile})`)
})

function shutdown() {
  server.close(() => {
    todos.close()
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
