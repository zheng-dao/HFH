"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _renderer = require("@react-pdf/renderer");

var _ApplicationSummary = _interopRequireDefault(require("./ApplicationSummary"));

var _mapEnumValue = _interopRequireDefault(require("./mapEnumValue"));

var _dateFns = require("date-fns");

var _makeTimezoneAwareDate = _interopRequireDefault(require("./makeTimezoneAwareDate"));

var _Stylesheet = _interopRequireDefault(require("./Stylesheet"));

var _formatPhoneNumber = _interopRequireDefault(require("./formatPhoneNumber"));

var _maskLiaisonStayStatus = _interopRequireDefault(require("./maskLiaisonStayStatus"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const StaySummary = ({
  stay,
  maskStayStatus
}) => {
  var _stay$HotelBooked, _stay$HotelBooked$Hot, _stay$HotelBooked2, _stay$HotelBooked2$Ho, _stay$HotelBooked3, _stay$HotelBooked4, _stay$HotelBooked5, _stay$HotelBooked6, _stay$HotelBooked7, _stay$HotelBooked8, _stay$HotelBooked9, _stay$HotelBooked10, _stay$HotelBooked11, _stay$HotelBooked13, _stay$payment_method, _stay$payment_method2, _stay$payment_method3, _stay$payment_method4;

  let summaryBoxOne = [{
    title: 'Status',
    value: (0, _mapEnumValue.default)(maskStayStatus ? (0, _maskLiaisonStayStatus.default)(stay === null || stay === void 0 ? void 0 : stay.status) : stay === null || stay === void 0 ? void 0 : stay.status)
  }, {
    title: 'Narrative',
    value: stay === null || stay === void 0 ? void 0 : stay.narrative
  }];
  let summaryBoxTwo = [{
    title: 'Reservation Number',
    value: stay === null || stay === void 0 ? void 0 : stay.confirmation_number
  }, {
    title: 'Hotel Chain',
    value: stay === null || stay === void 0 ? void 0 : (_stay$HotelBooked = stay.HotelBooked) === null || _stay$HotelBooked === void 0 ? void 0 : (_stay$HotelBooked$Hot = _stay$HotelBooked.HotelChain) === null || _stay$HotelBooked$Hot === void 0 ? void 0 : _stay$HotelBooked$Hot.name
  }, {
    title: 'Hotel Brand',
    value: stay === null || stay === void 0 ? void 0 : (_stay$HotelBooked2 = stay.HotelBooked) === null || _stay$HotelBooked2 === void 0 ? void 0 : (_stay$HotelBooked2$Ho = _stay$HotelBooked2.HotelBrand) === null || _stay$HotelBooked2$Ho === void 0 ? void 0 : _stay$HotelBooked2$Ho.name
  }, {
    title: 'Hotel Name',
    value: stay === null || stay === void 0 ? void 0 : (_stay$HotelBooked3 = stay.HotelBooked) === null || _stay$HotelBooked3 === void 0 ? void 0 : _stay$HotelBooked3.name
  }, {
    title: 'Hotel Address',
    value: ((stay === null || stay === void 0 ? void 0 : (_stay$HotelBooked4 = stay.HotelBooked) === null || _stay$HotelBooked4 === void 0 ? void 0 : _stay$HotelBooked4.address) || '') + ', ' + ((stay === null || stay === void 0 ? void 0 : (_stay$HotelBooked5 = stay.HotelBooked) === null || _stay$HotelBooked5 === void 0 ? void 0 : _stay$HotelBooked5.address_2) || '') + ', ' + ((stay === null || stay === void 0 ? void 0 : (_stay$HotelBooked6 = stay.HotelBooked) === null || _stay$HotelBooked6 === void 0 ? void 0 : _stay$HotelBooked6.city) || '') + ', ' + ((stay === null || stay === void 0 ? void 0 : (_stay$HotelBooked7 = stay.HotelBooked) === null || _stay$HotelBooked7 === void 0 ? void 0 : _stay$HotelBooked7.state) || '') + ', ' + ((stay === null || stay === void 0 ? void 0 : (_stay$HotelBooked8 = stay.HotelBooked) === null || _stay$HotelBooked8 === void 0 ? void 0 : _stay$HotelBooked8.zip) || '')
  }, {
    title: 'Telephone',
    value: (0, _formatPhoneNumber.default)(stay === null || stay === void 0 ? void 0 : (_stay$HotelBooked9 = stay.HotelBooked) === null || _stay$HotelBooked9 === void 0 ? void 0 : _stay$HotelBooked9.telephone, stay === null || stay === void 0 ? void 0 : (_stay$HotelBooked10 = stay.HotelBooked) === null || _stay$HotelBooked10 === void 0 ? void 0 : _stay$HotelBooked10.extension)
  }];

  if (stay !== null && stay !== void 0 && (_stay$HotelBooked11 = stay.HotelBooked) !== null && _stay$HotelBooked11 !== void 0 && _stay$HotelBooked11.contact_name) {
    var _stay$HotelBooked12;

    summaryBoxTwo.push({
      title: 'Contact Name',
      value: stay === null || stay === void 0 ? void 0 : (_stay$HotelBooked12 = stay.HotelBooked) === null || _stay$HotelBooked12 === void 0 ? void 0 : _stay$HotelBooked12.contact_name
    });
  }

  if (stay !== null && stay !== void 0 && (_stay$HotelBooked13 = stay.HotelBooked) !== null && _stay$HotelBooked13 !== void 0 && _stay$HotelBooked13.contact_position) {
    var _stay$HotelBooked14;

    summaryBoxTwo.push({
      title: 'Contact Position',
      value: stay === null || stay === void 0 ? void 0 : (_stay$HotelBooked14 = stay.HotelBooked) === null || _stay$HotelBooked14 === void 0 ? void 0 : _stay$HotelBooked14.contact_position
    });
  }

  let summaryBoxThree = [{
    title: 'Actual Room Type',
    value: stay === null || stay === void 0 ? void 0 : stay.room_type_actual
  }];

  if ((stay === null || stay === void 0 ? void 0 : stay.room_type_actual) == 'OTHER') {
    summaryBoxThree.push({
      title: 'Actual Room Description',
      value: stay === null || stay === void 0 ? void 0 : stay.room_description_actual
    });
  }

  let summaryBoxFour = [{
    title: 'Did the guest(s) stay at the hotel?',
    value: (stay === null || stay === void 0 ? void 0 : stay.guest_stayed_at_hotel) == null ? '' : stay !== null && stay !== void 0 && stay.guest_stayed_at_hotel ? 'Yes' : 'No'
  }, {
    title: 'Requested Stay Dates',
    value: (stay !== null && stay !== void 0 && stay.requested_check_in ? (0, _dateFns.format)((0, _makeTimezoneAwareDate.default)(stay === null || stay === void 0 ? void 0 : stay.requested_check_in), 'yyyy-MM-dd') : '') + ' - ' + (stay !== null && stay !== void 0 && stay.requested_check_out ? (0, _dateFns.format)((0, _makeTimezoneAwareDate.default)(stay === null || stay === void 0 ? void 0 : stay.requested_check_out), 'yyyy-MM-dd') : '')
  }, {
    title: 'Actual Stay Dates',
    value: (stay !== null && stay !== void 0 && stay.actual_check_in ? (0, _dateFns.format)((0, _makeTimezoneAwareDate.default)(stay === null || stay === void 0 ? void 0 : stay.actual_check_in), 'yyyy-MM-dd') : '') + ' - ' + (stay !== null && stay !== void 0 && stay.actual_check_out ? (0, _dateFns.format)((0, _makeTimezoneAwareDate.default)(stay === null || stay === void 0 ? void 0 : stay.actual_check_out), 'yyyy-MM-dd') : '')
  }];
  const shouldShowReasonForChangeBox = !(stay !== null && stay !== void 0 && stay.guest_stayed_at_hotel) && (stay === null || stay === void 0 ? void 0 : stay.guest_stayed_at_hotel) != null || (stay === null || stay === void 0 ? void 0 : stay.actual_check_in) && (stay === null || stay === void 0 ? void 0 : stay.actual_check_in) != (stay === null || stay === void 0 ? void 0 : stay.requested_check_in) || (stay === null || stay === void 0 ? void 0 : stay.actual_check_out) && (stay === null || stay === void 0 ? void 0 : stay.actual_check_out) != (stay === null || stay === void 0 ? void 0 : stay.requested_check_out);

  if (shouldShowReasonForChangeBox) {
    summaryBoxFour.push({
      title: 'Reason for Change',
      value: stay === null || stay === void 0 ? void 0 : stay.reason_guest_did_not_stay
    });
  }

  let reconciliationSummary = [{
    title: 'Hotel Documents',
    value: stay !== null && stay !== void 0 && stay.hotel_files ? stay.hotel_files.map(item => {
      const parts = item.key.split('/');
      return parts.pop();
    }).join(', ') : ''
  }, {
    title: 'Payment Used',
    value: stay === null || stay === void 0 ? void 0 : (_stay$payment_method = stay.payment_method) === null || _stay$payment_method === void 0 ? void 0 : _stay$payment_method.name
  }];

  if (((_stay$payment_method2 = stay.payment_method) === null || _stay$payment_method2 === void 0 ? void 0 : _stay$payment_method2.name) == 'Points') {
    reconciliationSummary.push({
      title: 'Points Used',
      value: stay === null || stay === void 0 ? void 0 : stay.payment_points_used
    }, {
      title: 'Comparable Cost',
      value: stay === null || stay === void 0 ? void 0 : stay.comparable_cost
    });
  } else if (((_stay$payment_method3 = stay.payment_method) === null || _stay$payment_method3 === void 0 ? void 0 : _stay$payment_method3.type) == 'USERGENERATED') {
    reconciliationSummary.push({
      title: stay.payment_method.name + ' Details',
      value: stay.certificate_number
    }, {
      title: 'Comparable Cost',
      value: stay === null || stay === void 0 ? void 0 : stay.comparable_cost
    });
  }

  if (((_stay$payment_method4 = stay.payment_method) === null || _stay$payment_method4 === void 0 ? void 0 : _stay$payment_method4.name) == 'Credit Card' || stay.card_used_for_incidentals) {
    reconciliationSummary.push({
      title: 'Card',
      value: stay.card
    }, {
      title: 'Total Cost',
      value: stay.payment_cost_of_reservation
    });
  }

  const calculateStayDates = localStay => {
    let output = '(';

    if (localStay.actual_check_in) {
      output += (0, _dateFns.format)((0, _makeTimezoneAwareDate.default)(localStay.actual_check_in), 'yyyy-MM-dd');
    } else if (localStay.requested_check_in) {
      output += (0, _dateFns.format)((0, _makeTimezoneAwareDate.default)(localStay.requested_check_in), 'yyyy-MM-dd');
    } else {
      output += '';
    }

    output += ' - ';

    if (localStay.actual_check_out) {
      output += (0, _dateFns.format)((0, _makeTimezoneAwareDate.default)(localStay.actual_check_out), 'yyyy-MM-dd');
    } else if (localStay.requested_check_out) {
      output += (0, _dateFns.format)((0, _makeTimezoneAwareDate.default)(localStay.requested_check_out), 'yyyy-MM-dd');
    } else {
      output += '';
    }

    output += ')';
    return output;
  };

  const stayTitle = () => {
    let output = '';

    if ((stay === null || stay === void 0 ? void 0 : stay.type) == 'INITIAL') {
      output += 'Initial Stay ';
    } else {
      output += 'Extended Stay ';
    }

    output += calculateStayDates(stay);
    return output;
  };

  return /*#__PURE__*/_react.default.createElement(_renderer.View, null, /*#__PURE__*/_react.default.createElement(_renderer.Text, {
    style: _Stylesheet.default.sectionTitle
  }, stayTitle()), /*#__PURE__*/_react.default.createElement(_ApplicationSummary.default, {
    sectionTitle: "",
    listItems: summaryBoxOne
  }), /*#__PURE__*/_react.default.createElement(_ApplicationSummary.default, {
    sectionTitle: "",
    listItems: summaryBoxTwo
  }), /*#__PURE__*/_react.default.createElement(_ApplicationSummary.default, {
    sectionTitle: "",
    listItems: summaryBoxThree
  }), /*#__PURE__*/_react.default.createElement(_ApplicationSummary.default, {
    sectionTitle: "",
    listItems: summaryBoxFour
  }), /*#__PURE__*/_react.default.createElement(_ApplicationSummary.default, {
    sectionTitle: "Reconciliation",
    listItems: reconciliationSummary
  }));
};

StaySummary.defaultProps = {
  stay: {},
  maskStayStatus: false
};
var _default = StaySummary;
exports.default = _default;