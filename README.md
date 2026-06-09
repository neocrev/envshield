<p align="center">
  <h1>envshield</h1>
  <p>Validate your <code>.env</code> before your app crashes at 3am.</p>
  <a href="https://www.npmjs.com/package/@neocrev/envshield"><img src="https://img.shields.io/npm/v/@neocrev/envshield" alt="npm"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
</p>

<p align="center">
  <img src="demo.svg" alt="envshield in action" width="600">
</p>

---

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
npx @neocrev/envshield
```

If something's missing, you'll know immediately.

---

## Integrations

```yaml
# CI
- run: npx @neocrev/envshield --strict
```

```dockerfile
COPY .env.schema ./
RUN npx @neocrev/envshield
```

```bash
# pre-commit hook
npx @neocrev/envshield --strict
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
