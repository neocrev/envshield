#!/usr/bin/env node

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { validate } from '../lib/validator.js';

const { values, positionals } = parseArgs({
  options: {
    schema: { type: 'string', short: 's', default: '.env.schema' },
    env: { type: 'string', short: 'e', default: '.env' },
    init: { type: 'boolean', short: 'i', default: false },
    strict: { type: 'boolean', short: 't', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
  allowPositionals: true,
});

if (values.help) {
  console.log(`
envshield — .env validator

USAGE
  npx envshield                Check .env against .env.schema
  npx envshield -s schema.env  Use custom schema path
  npx envshield -e .env.prod   Check specific .env file
  npx envshield --strict       Missing required = error (default: warn)
  npx envshield --init         Generate a .env.schema from .env.example

OPTIONS
  -s, --schema  Path to schema file          (default: .env.schema)
  -e, --env     Path to env file             (default: .env)
  -t, --strict  Missing required variables   (default: warn)
  -i, --init    Generate schema from .env.example
  -h, --help    Show this help
`);
  process.exit(0);
}

const schemaPath = resolve(values.schema);
const envPath = resolve(values.env);

if (values.init) {
  const examplePath = positionals[0] || '.env.example';
  if (!existsSync(examplePath)) {
    console.error(`✗ ${examplePath} not found`);
    process.exit(1);
  }
  const content = readFileSync(examplePath, 'utf-8');
  const schema = content
    .split('\n')
    .filter(l => l.trim() && !l.startsWith('#'))
    .map(l => {
      const key = l.split('=')[0].trim();
      const hasDefault = l.includes('=') && l.split('=')[1].trim().length > 0;
      return `${key}${hasDefault ? '' : '=required'}`;
    })
    .join('\n');
  writeFileSync(schemaPath, schema + '\n', 'utf-8');
  console.log(`✓ Schema generated → ${schemaPath}`);
  process.exit(0);
}

if (!existsSync(schemaPath)) {
  console.error(`✗ Schema not found: ${schemaPath}`);
  console.error('  Run --init to generate one, or specify --schema');
  process.exit(1);
}

if (!existsSync(envPath)) {
  console.error(`✗ Env file not found: ${envPath}`);
  process.exit(1);
}

const schema = readFileSync(schemaPath, 'utf-8');
const env = readFileSync(envPath, 'utf-8');

const result = validate(schema, env, { strict: values.strict });

for (const err of result.errors) {
  console.error(`✗ ${err}`);
}
for (const warn of result.warnings) {
  console.warn(`⚠ ${warn}`);
}

if (result.passed) {
  console.log(`✓ ${envPath} passes ${schemaPath}`);
  process.exit(0);
} else {
  process.exit(result.errors.length > 0 ? 1 : 0);
}
