"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _renderer = require("@react-pdf/renderer");

var _Stylesheet = _interopRequireDefault(require("./Stylesheet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TableRow = ({
  isLast,
  title,
  children
}) => {
  const liStyles = [_Stylesheet.default.li, isLast ? _Stylesheet.default.liLast : {}];
  const titleToShow = title.slice(-1) === '?' ? title : title + ':';
  return /*#__PURE__*/_react.default.createElement(_renderer.Text, {
    style: liStyles
  }, title && /*#__PURE__*/_react.default.createElement(_renderer.Text, {
    style: _Stylesheet.default.strong
  }, titleToShow, " "), children);
};

var _default = TableRow;
exports.default = _default;