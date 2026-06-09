import { validate } from '../lib/validator.js';

function assert(condition, msg) {
  if (!condition) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`PASS: ${msg}`);
}

// Test 1: basic pass
let r = validate('PORT=3000\nNODE_ENV=required', 'PORT=8080\nNODE_ENV=production');
assert(r.passed === true, 'basic valid env passes');
assert(r.errors.length === 0, 'no errors for valid env');

// Test 2: missing required
r = validate('PORT=required\nDB_URL=required', 'PORT=3000');
assert(r.passed === false, 'fails on missing required');
assert(r.errors.length === 1, 'one error for one missing');
assert(r.errors[0].includes('DB_URL'), 'error mentions missing key');

// Test 3: missing optional
r = validate('PORT=3000\nLOG_LEVEL=info', 'PORT=8080');
assert(r.passed === true, 'passes on missing optional (warns only)');
assert(r.warnings.length >= 1, 'warns about missing optional');

// Test 4: strict mode catches unknown keys
r = validate('PORT=3000', 'PORT=8080\nEXTRA=yes', { strict: true });
assert(r.passed === true, 'strict mode passes with valid required');
assert(r.warnings.some(w => w.includes('EXTRA')), 'strict mode warns on unknown');

// Test 5: comments and blank lines
r = validate('# comment\nPORT=3000\n\nDB_URL=required', 'PORT=8080\nDB_URL=postgres://...');
assert(r.passed === true, 'ignores comments and blanks');

// Test 6: schema with no value (just key)
r = validate('MY_VAR', 'MY_VAR=hello');
assert(r.passed === true, 'schema with bare key (no =) works');

const schema = 'PORT=required\nHOST=localhost';
const env = 'PORT=\nHOST=0.0.0.0';
r = validate(schema, env, { strict: true });
assert(r.errors.some(e => e.includes('PORT')), 'empty required value is error');

console.log('\n✓ All tests passed');
