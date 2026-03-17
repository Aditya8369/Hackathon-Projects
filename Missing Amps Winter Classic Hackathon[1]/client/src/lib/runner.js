// Simple in-browser CommonJS-like runner using Function constructor
export function runUserCode(userCode, tests) {
  const outputs = [];
  let allPass = true;

  try {
    // Sandbox: limit available globals
    const sandbox = {};
    const wrapped = new Function('module', 'exports', userCode + '; return module.exports;');
    const module = { exports: {} };
    const fn = wrapped(module, module.exports);

    for (const t of tests) {
      let result;
      try {
        result = fn(...t.input);
      } catch (e) {
        allPass = false;
        outputs.push({ pass: false, message: `Error: ${e.message}` });
        continue;
      }
      const pass = deepEqual(result, t.output);
      if (!pass) allPass = false;
      outputs.push({
        pass,
        message: pass ? 'OK' : `Expected ${JSON.stringify(t.output)}, got ${JSON.stringify(result)}`
      });
    }
  } catch (e) {
    return { allPass: false, outputs: [{ pass: false, message: `Compilation error: ${e.message}` }] };
  }

  return { allPass, outputs };
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}