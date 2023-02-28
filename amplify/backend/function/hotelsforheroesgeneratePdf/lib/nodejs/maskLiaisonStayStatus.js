'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const maskLiaisonStayStatus = (status) => {
  if (['REVIEWED', 'CLOSED'].includes(status)) {
    return 'COMPLETED';
  }

  return status;
};

var _default = maskLiaisonStayStatus;
exports.default = _default;
