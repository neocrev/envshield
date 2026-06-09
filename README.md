# envshield

I've shipped too many apps that crashed because `DATABASE_URL` was missing in production. This is the pre-flight check I wish I'd had earlier.

```bash
npx envshield
```

It compares your `.env` against a `.env.schema` and tells you what's missing. Nothing more.

## How it works

Drop a `.env.schema` in your project root:

```
# This app won't start without these
DATABASE_URL=required
STRIPE_SECRET_KEY=required

# These have sensible defaults
PORT=3000
LOG_LEVEL=info
NODE_ENV=development

# This one's optional — no default, no crash
MY_OPTIONAL_FEATURE_FLAG
```

Then run:

```
npx envshield
```

If something's missing, it tells you:

```
✗ DATABASE_URL is required but not set in .env
✗ STRIPE_SECRET_KEY is required but not set in .env
```

## Why not just use dotenv?

You still should. envshield runs *before* your app starts — think of it as a linter for your environment.

## Sticking it in CI

```yaml
- run: npx envshield --strict
```

Or as a pre-commit hook:

```bash
# .husky/pre-commit
npx envshield --strict
```

Or in a Dockerfile:

```dockerfile
COPY .env.schema ./
RUN npx envshield
```

## Options

```
-s, --schema  Path to schema file        (default: .env.schema)
-e, --env     Path to env file           (default: .env)
-t, --strict  Missing required = error   (default: warn)
-i, --init    Generate schema from .env.example
-h, --help    You're looking at it
```

## License

MIT
