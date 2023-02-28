"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _renderer = require("@react-pdf/renderer");

var _Stylesheet = _interopRequireDefault(require("./Stylesheet"));

var _TableRow = _interopRequireDefault(require("./TableRow"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ApplicationSummary = props => {
  return /*#__PURE__*/_react.default.createElement(_renderer.View, null, /*#__PURE__*/_react.default.createElement(_renderer.Text, {
    style: _Stylesheet.default.sectionTitle
  }, props.sectionTitle), /*#__PURE__*/_react.default.createElement(_renderer.View, {
    style: _Stylesheet.default.ul
  }, props.listItems.map((item, index) => /*#__PURE__*/_react.default.createElement(_TableRow.default, {
    key: index,
    title: item.title,
    isLast: index == props.listItems.length - 1
  }, item.value))));
};

var _default = ApplicationSummary;
exports.default = _default;