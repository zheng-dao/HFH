'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = humanName;

function humanName(person, withWrapperTags = false) {
  const first_name = (person === null || person === void 0 ? void 0 : person.first_name) || '';
  const last_name = (person === null || person === void 0 ? void 0 : person.last_name) || '';
  const name =
    first_name +
    ' ' +
    ((person === null || person === void 0 ? void 0 : person.middle_initial) ?? '') +
    ' ' +
    last_name;

  if (withWrapperTags) {
    return '<strong>' + name.replace(/\s+/g, ' ').trim() + '</strong>';
  }

  return name.replace(/\s+/g, ' ').trim();
}
