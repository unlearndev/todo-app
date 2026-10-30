# Todo app

## Commands
- Tests: `npm run test:unit -- --run`
- Lint: `npm run lint`. It fixes what it can, so check the diff after running it.

## How this project works
- All todo state lives in `App.vue`. Components get props and emit events. Don't add a store.
- Plain CSS in scoped style blocks. No CSS frameworks or UI libraries.
- Ask before adding any dependency.

## Before you say you're done
- New behaviour has a test in `src/__tests__/`.
- Run the tests and the lint, and show me the output.
