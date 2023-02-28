"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _libphonenumberJs = require("libphonenumber-js");

const formatPhoneNumber = (phoneNumber, extension) => {
  if (phoneNumber) {
    const parsedPhoneNumber = (0, _libphonenumberJs.parsePhoneNumber)(phoneNumber, 'US');

    if (extension) {
      parsedPhoneNumber.setExt(extension);
    }

    if (parsedPhoneNumber.country == 'US') {
      return parsedPhoneNumber.formatNational();
    } else {
      return parsedPhoneNumber.formatInternational();
    }
  }

  return '';
};

var _default = formatPhoneNumber;
exports.default = _default;