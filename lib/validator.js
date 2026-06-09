function parseSchema(schemaText) {
  const rules = [];
  for (const line of schemaText.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) {
      rules.push({ key: trimmed, default: undefined });
      continue;
    }

    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().toLowerCase();

    if (!key) continue;

    if (value === 'required') {
      rules.push({ key, required: true, default: undefined });
    } else {
      rules.push({ key, required: false, default: value });
    }
  }
  return rules;
}

function parseEnv(envText) {
  const vars = new Map();
  for (const line of envText.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    vars.set(key, value);
  }
  return vars;
}

export function validate(schemaText, envText, opts = {}) {
  const rules = parseSchema(schemaText);
  const env = parseEnv(envText);
  const errors = [];
  const warnings = [];

  for (const rule of rules) {
    if (!env.has(rule.key)) {
      const msg = `Missing variable: ${rule.key}`;
      if (rule.required || opts.strict) {
        errors.push(`${msg} (required)`);
      } else {
        warnings.push(`${msg} (optional, no default)`);
      }
      continue;
    }

    const value = env.get(rule.key);
    if (value === '' || value === undefined) {
      if (rule.required) {
        errors.push(`${rule.key} is empty (required)`);
      } else if (rule.default) {
        warnings.push(`${rule.key} is empty, schema suggests default: ${rule.default}`);
      }
      continue;
    }
  }

  // Detect unknown variables (typo protection)
  if (opts.strict) {
    const schemaKeys = new Set(rules.map(r => r.key));
    for (const key of env.keys()) {
      if (!schemaKeys.has(key)) {
        warnings.push(`Unknown variable in .env: ${key} (not in schema)`);
      }
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    stats: { rules: rules.length, envVars: env.size, errors: errors.length, warnings: warnings.length },
  };
}
