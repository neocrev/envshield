# envshield

**Catch missing environment variables before they crash your app.**

A zero-dependency CLI tool that validates `.env` files against a schema. Works with any framework, any language — it's just a pre-flight check for your environment.

## Why?

> "Works on my machine" → "Works in production"

Environment variables are the most common source of runtime failures. A missing `DATABASE_URL` or `STRIPE_SECRET_KEY` can take down a service silently. envshield prevents that by validating your `.env` against a schema before your app starts.

## Quick start

```bash
# Validate your .env
npx envshield

# Generate a schema from your .env.example
npx envshield --init

# Strict mode (unknown vars = warnings)
npx envshield --strict
```

## Schema format

Create `.env.schema` in your project root:

```env
# Required variables (no default = crash without them)
DATABASE_URL=required
STRIPE_SECRET_KEY=required

# Optional variables with defaults
PORT=3000
LOG_LEVEL=info
NODE_ENV=development

# Documented variables (no default, but optional)
MY_OPTIONAL_FEATURE_FLAG
```

## Use cases

### Pre-commit hook (husky)

```bash
# .husky/pre-commit
npx envshield --strict
```

### Docker entrypoint

```dockerfile
COPY .env.schema ./
RUN npx envshield
```

### CI pipeline

```yaml
- run: npx envshield --strict
```

### Runtime guard (Node.js)

```js
import { validate } from 'envshield';
// Or import { readFileSync } from 'fs';
```

## API

```bash
envshield [options]

Options:
  -s, --schema  Path to schema file          (default: .env.schema)
  -e, --env     Path to env file             (default: .env)
  -t, --strict  Missing required variables   (default: warn)
  -i, --init    Generate schema from .env.example
  -h, --help    Show this help
```

## Exit codes

| Code | Meaning |
|------|---------|
| 0    | All checks passed |
| 1    | Required variables missing |

## License

MIT
