import { createApp } from './app.js'
import { openTodoDb } from './db.js'

// Only accept connections from this machine. Binding to all interfaces (the
// default for listen()) would expose the API to anyone on the network.
export const DEFAULT_HOST = '127.0.0.1'

export function startServer({ port, dbFile, host = DEFAULT_HOST }) {
  const todos = openTodoDb(dbFile)
  return new Promise((resolve, reject) => {
    const server = createApp(todos).listen(port, host)
    server.once('listening', () => resolve({ server, todos }))
    server.once('error', (error) => {
      todos.close()
      reject(error)
    })
  })
}
