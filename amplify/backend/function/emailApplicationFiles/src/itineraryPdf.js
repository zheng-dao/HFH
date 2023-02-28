"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _renderer = _interopRequireWildcard(require("@react-pdf/renderer"));

var _Stylesheet = _interopRequireDefault(require("./Stylesheet"));

var _ApplicationSummary = _interopRequireDefault(require("./ApplicationSummary"));

var _humanName = _interopRequireDefault(require("./humanName"));

var _mapEnumValue = _interopRequireDefault(require("./mapEnumValue"));

var _tmp = _interopRequireDefault(require("tmp"));

var _nodeFs = _interopRequireDefault(require("node:fs"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: itinerary pdf
const handler = async app => {
  var _app$application, _app$application2;

  const reservationSummary = [{
    title: 'Guest(s)',
    value: ((_app$application = app.application) === null || _app$application === void 0 ? void 0 : _app$application.PrimaryGuest.items.map(item => (0, _humanName.default)(item)).join()) + ',' + ((_app$application2 = app.application) === null || _app$application2 === void 0 ? void 0 : _app$application2.AdditionalGuests.items.map(item => (0, _humanName.default)(item)).join())
  }, {
    title: 'Check-in',
    value: app.stay.requested_check_in
  }, {
    title: 'Check-out',
    value: app.stay.requested_check_out
  }, {
    title: 'Room',
    value: app.stay.room_type_actual === 'OTHER' ? app.stay.room_description_actual : (0, _mapEnumValue.default)(app.stay.room_type_actual)
  }, {
    title: 'Total Nights',
    value: app.stay.requested_check_in && app.stay.requested_check_out ? calculateNumberOfNights(app.stay.requested_check_in, app.stay.requested_check_out) : 'Unknown'
  }];

  const fileName = _tmp.default.tmpNameSync();

  const pdf = await _renderer.default.renderToFile( /*#__PURE__*/_react.default.createElement(_renderer.Document, null, /*#__PURE__*/_react.default.createElement(_renderer.Page, {
    style: _Stylesheet.default.page
  }, /*#__PURE__*/_react.default.createElement(_renderer.View, {
    style: _Stylesheet.default.headerSection
  }, /*#__PURE__*/_react.default.createElement(_renderer.View, {
    style: _Stylesheet.default.hotelLogo
  }, /*#__PURE__*/_react.default.createElement(_renderer.Image, {
    src: "https://resources.fisherhouse.org/assets/hfh_logo.jpg",
    alt: "Hotels for Heros Logo"
  }))), /*#__PURE__*/_react.default.createElement(_renderer.View, {
    style: _Stylesheet.default.page
  }, /*#__PURE__*/_react.default.createElement(_renderer.View, {
    style: _Stylesheet.default.headerBreakLine
  }), /*#__PURE__*/_react.default.createElement(_renderer.View, {
    style: _Stylesheet.default.hotelInfoContainer
  }, /*#__PURE__*/_react.default.createElement(_renderer.View, {
    style: _Stylesheet.default.hotelInfos
  }, app.hotelLogo && /*#__PURE__*/_react.default.createElement(_renderer.Image, {
    style: _Stylesheet.default.footerLogo,
    src: app.hotelLogo,
    alt: "Hotel Brand Logo"
  })), /*#__PURE__*/_react.default.createElement(_renderer.View, {
    style: _Stylesheet.default.hotelInfo
  }, /*#__PURE__*/_react.default.createElement(_renderer.Text, null, app.stay.HotelBooked.name), /*#__PURE__*/_react.default.createElement(_renderer.Text, null, app.stay.HotelBooked.address), /*#__PURE__*/_react.default.createElement(_renderer.Text, null, app.stay.HotelBooked.address_2), /*#__PURE__*/_react.default.createElement(_renderer.Text, null, app.stay.HotelBooked.city, ", ", app.stay.HotelBooked.state, ", ", app.stay.HotelBooked.zip), /*#__PURE__*/_react.default.createElement(_renderer.Text, null, app.stay.HotelBooked.telephone, app.stay.HotelBooked.extension ? ' x' + app.stay.HotelBooked.extension : ''))), /*#__PURE__*/_react.default.createElement(_renderer.Text, {
    style: [_Stylesheet.default.strong, {
      fontSize: '20pt',
      paddingBottom: '10pt'
    }]
  }, "Confirmation Number: ", /*#__PURE__*/_react.default.createElement(_renderer.Text, {
    style: _Stylesheet.default.confirmationNumberNumber
  }, app.stay.confirmation_number)), /*#__PURE__*/_react.default.createElement(_ApplicationSummary.default, {
    sectionTitle: "Reservation Information",
    listItems: reservationSummary
  })), /*#__PURE__*/_react.default.createElement(_renderer.View, {
    style: _Stylesheet.default.footer
  }, /*#__PURE__*/_react.default.createElement(_renderer.Text, {
    style: _Stylesheet.default.footerDescription
  }, "Guests are responsible for incidentals and additional charges beyond the cost of the room.", '\n', "Hotels will require a credit card on file as standard policy upon check-in."), /*#__PURE__*/_react.default.createElement(_renderer.Text, {
    style: _Stylesheet.default.hotelInfo
  }, "Program of Fisher House Foundation"), /*#__PURE__*/_react.default.createElement(_renderer.Image, {
    style: _Stylesheet.default.footerLogos,
    src: "https://resources.fisherhouse.org/assets/fhf_email.png",
    alt: "Hotels for Heros Logo"
  })))), fileName);
  return _nodeFs.default.readFileSync(fileName, {
    encoding: 'base64'
  });
};

var _default = handler;
exports.default = _default;