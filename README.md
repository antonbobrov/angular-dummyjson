# Angular Todo

Todo app built with Angular 21, Angular Material 3, and the [DummyJSON](https://dummyjson.com) API.

## Requirements

- Node.js 20+
- npm 11+

## Setup

```bash
npm install
```

## Development

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200).

Demo credentials (DummyJSON): `emilys` / `emilyspass`.

## Scripts

| Command             | Description      |
| ------------------- | ---------------- |
| `npm start`         | Dev server       |
| `npm run build`     | Production build |
| `npm run lint`      | ESLint           |
| `npm run typecheck` | TypeScript check |

## Architecture

- `features/` — domain logic (auth, todos)
- `pages/` — route components
- `layouts/` — authenticated shell
- `widgets/` — reusable UI blocks
- `shared/` — API config, utilities, UI primitives

State is managed with Angular signals. HTTP uses functional interceptors for auth and token refresh.
