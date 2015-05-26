'use strict';

var main = require('../src/scripts/main');

describe("A main class", function() {
  it("has one parameter", function() {
    expect(main.length).toBe(1);
  });
});
