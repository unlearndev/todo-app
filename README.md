# todo-app

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

This starts two things side by side:

- the todo API (`server/`) on port 3001, which reloads when files in `server/` change
- the Vite dev server, which forwards `/api` requests to the API

Todos are stored in SQLite at `data/todos.sqlite` (ignored by git), so they survive a page refresh
and a restart. Set `TODO_DB` to use a different file, or `PORT` to move the API to another port.

To run only the API, use `npm run start:api`.

#### API

| Method | Path                   | Body                                        |
| ------ | ---------------------- | ------------------------------------------- |
| GET    | `/api/todos`           |                                             |
| POST   | `/api/todos`           | `{ "title": "Buy milk", "priority": true }` |
| PATCH  | `/api/todos/:id`       | any of `title`, `done`, `priority`          |
| DELETE | `/api/todos/:id`       |                                             |
| DELETE | `/api/todos/completed` | clears every done todo                      |

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
