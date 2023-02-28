'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const makeTimezoneAwareDate = (input) => {
  const dt = new Date(input);
  return new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
};

var _default = makeTimezoneAwareDate;
exports.default = _default;
