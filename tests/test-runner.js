/**
 * @fileoverview Simple test runner for NAC
 * @description Node.js-compatible test runner with no dependencies
 */

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function assertEqual(actual, expected, message) {
  if (actual === expected) {
    results.passed++;
    results.tests.push({ status: 'pass', message });
    console.log(`  ✓ ${message}`);
  } else {
    results.failed++;
    results.tests.push({ status: 'fail', message, actual, expected });
    console.log(`  ✗ ${message}`);
    console.log(`    Expected: ${expected}`);
    console.log(`    Actual: ${actual}`);
  }
}

function assertTrue(condition, message) {
  assertEqual(!!condition, true, message);
}

function assertFalse(condition, message) {
  assertEqual(!!condition, false, message);
}

function assertDefined(value, message) {
  assertTrue(value !== undefined && value !== null, message);
}

function assertType(value, expectedType, message) {
  assertEqual(typeof value, expectedType, message);
}

function describe(suiteName, fn) {
  console.log(`\n${suiteName}`);
  console.log('─'.repeat(suiteName.length));
  fn();
}

function test(testName, fn) {
  try {
    fn();
  } catch (error) {
    results.failed++;
    results.tests.push({ status: 'error', message: testName, error: error.message });
    console.log(`  ✗ ${testName}`);
    console.log(`    Error: ${error.message}`);
  }
}

function summary() {
  const total = results.passed + results.failed;
  console.log('\n' + '═'.repeat(40));
  console.log(`Test Results: ${results.passed}/${total} passed`);
  console.log('═'.repeat(40));

  if (results.failed > 0) {
    console.log('\nFailed tests:');
    results.tests.filter(t => t.status !== 'pass').forEach(t => {
      console.log(`  - ${t.message}`);
    });
    process.exit(1);
  } else {
    console.log('\nAll tests passed!');
    process.exit(0);
  }
}

module.exports = {
  assertEqual,
  assertTrue,
  assertFalse,
  assertDefined,
  assertType,
  describe,
  test,
  summary,
  results
};
