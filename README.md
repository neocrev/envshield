# envshield

[![npm](https://img.shields.io/npm/v/envshield)](https://www.npmjs.com/package/envshield) [![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Validate your `.env` before your app crashes at 3am.

<p align="center">
  <img src="demo.svg" alt="envshield in action" width="600">
</p>

---

## The problem

You deploy. The app starts. Then it dies because `DATABASE_URL` doesn't exist in production. envshield catches that before a single request is served.

---

## Setup

Write a schema:

```
# .env.schema
DATABASE_URL=required
STRIPE_SECRET_KEY=required
PORT=3000
LOG_LEVEL=info
```

Then run:

```bash
npx envshield
```

If something's missing, you'll know immediately.

---

## Integrations

```yaml
# CI
- run: npx envshield --strict
```

```dockerfile
# Dockerfile
COPY .env.schema ./
RUN npx envshield
```

```bash
# pre-commit hook
npx envshield --strict
```

---

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `-s, --schema` | Path to schema file | `.env.schema` |
| `-e, --env` | Path to env file | `.env` |
| `-t, --strict` | Fail on missing required fields | warn only |
| `-i, --init` | Generate schema from `.env.example` | |
| `-h, --help` | Show help | |

---

## License

MIT
