import assert from "assert";

// https://github.com/electron/electron/issues/24577

assert.equal = (actual, expected) => {
  if (actual != expected) {
    throw new assert.AssertionError({
      actual,
      expected,
      operator: "==",
    });
  }
};

assert.ok = (value) => {
  if (!value) {
    throw new assert.AssertionError({
      actual: value,
      expected: true,
      operator: "==",
    });
  }
};

export default assert;
