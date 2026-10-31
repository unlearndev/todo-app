import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import Database from 'better-sqlite3'

function toTodo(row) {
  return { id: row.id, title: row.title, done: row.done === 1, priority: row.priority === 1 }
}

// Opens (or creates) the SQLite database at `filename` and returns the queries
// the API needs. Pass ':memory:' for a throwaway database in tests.
export function openTodoDb(filename) {
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true })

  const db = new Database(filename)
  db.pragma('journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      priority INTEGER NOT NULL DEFAULT 0
    )
  `)

  const statements = {
    all: db.prepare('SELECT * FROM todos ORDER BY id'),
    get: db.prepare('SELECT * FROM todos WHERE id = ?'),
    insert: db.prepare('INSERT INTO todos (title, priority) VALUES (?, ?)'),
    remove: db.prepare('DELETE FROM todos WHERE id = ?'),
    clearCompleted: db.prepare('DELETE FROM todos WHERE done = 1'),
  }

  return {
    list() {
      return statements.all.all().map(toTodo)
    },

    create({ title, priority = false }) {
      const { lastInsertRowid } = statements.insert.run(title, priority ? 1 : 0)
      return toTodo(statements.get.get(lastInsertRowid))
    },

    // Only the fields present in `changes` are updated. Returns null if the todo doesn't exist.
    update(id, changes) {
      const columns = ['title', 'done', 'priority'].filter((key) => key in changes)
      if (columns.length) {
        const values = columns.map((key) =>
          typeof changes[key] === 'boolean' ? Number(changes[key]) : changes[key],
        )
        const assignments = columns.map((key) => `${key} = ?`).join(', ')
        db.prepare(`UPDATE todos SET ${assignments} WHERE id = ?`).run(...values, id)
      }
      const row = statements.get.get(id)
      return row ? toTodo(row) : null
    },

    remove(id) {
      return statements.remove.run(id).changes > 0
    },

    clearCompleted() {
      return statements.clearCompleted.run().changes
    },

    close() {
      db.close()
    },
  }
}
