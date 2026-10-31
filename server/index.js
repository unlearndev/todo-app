import { fileURLToPath } from 'node:url'
import { startServer } from './start.js'

const port = Number(process.env.PORT ?? 3001)
const dbFile = process.env.TODO_DB ?? fileURLToPath(new URL('../data/todos.sqlite', import.meta.url))

const { server, todos } = await startServer({ port, dbFile })
const { address, port: boundPort } = server.address()
console.log(`Todo API listening on http://${address}:${boundPort} (database: ${dbFile})`)

function shutdown() {
  server.close(() => {
    todos.close()
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
