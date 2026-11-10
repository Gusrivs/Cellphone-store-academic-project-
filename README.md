# Quasar App (com.esapp.miapp)

## Install the dependencies

```bash
pnpm install
# or: yarn/npm/bun install
```

## Environment variables

Copy `.env.example` to `.env` and fill in the Firebase and CouchDB values before
starting or building the app. Quasar loads `.env` automatically. The CouchDB
credentials are used by browser code and therefore are visible to app users;
move authenticated CouchDB access behind a server if the password must remain
private. Firebase browser configuration is also included in the client bundle;
secure the project with Firebase Security Rules and API key restrictions.

### Start the app in development mode (HMR, error reporting, etc.)

```bash
quasar dev
```

### Format & Lint the files

```bash
pnpm run lint
# or: yarn/npm/bun run lint
```

...or just check formatting & linting:

```bash
pnpm run lint:check
# or: yarn/npm/bun run lint:check
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-file).
