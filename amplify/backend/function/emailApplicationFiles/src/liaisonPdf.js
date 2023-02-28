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

var _staySummary = _interopRequireDefault(require("./staySummary"));

var _formatPhoneNumber = _interopRequireDefault(require("./formatPhoneNumber"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const handler = async app => {
  var _app$application, _app$application2, _app$application2$Ass, _app$application3, _app$application3$Ass, _app$application4, _app$application4$Ass, _app$application5, _app$application5$Ass, _app$application6, _app$application6$Ass, _app$application6$Ass2, _app$application7, _app$application7$Ass, _app$application7$Ass2, _app$application8, _app$application8$Ass, _app$application8$Ass2, _app$application9, _app$application10, _app$application10$Us, _app$application11, _app$application11$Us, _app$application12, _app$application12$Us, _app$application13, _app$application13$Us, _app$application14, _app$application14$Us, _app$application14$Us2, _app$application15, _app$application15$Us, _app$application15$Us2, _app$application16, _app$application16$Us, _app$application16$Us2, _app$applicant, _app$applicant2, _app$applicant3, _app$application17, _app$application18, _app$application19, _app$application19$Se, _app$application21, _app$application21$Se, _app$application22, _app$application22$Se, _app$application23, _app$application23$Se, _app$application24, _app$application24$Se, _app$application25, _app$application25$Se, _app$application26, _app$application26$Se, _app$application26$Se2, _app$application27, _app$application27$Se, _app$application28, _app$application28$Se, _app$application29, _app$application29$Se, _app$application30, _app$application30$Se, _app$application31, _app$application31$Se, _app$application32, _app$application32$Se, _app$application37, _app$application37$Se, _app$application37$Se2, _app$application38, _app$application38$Pr, _app$application39, _app$application41, _app$application42, _app$application44, _app$application45, _app$application46, _app$application47, _app$application48;

  const adminSummary = [{
    title: 'Name',
    value: (_app$application = app.application) !== null && _app$application !== void 0 && _app$application.AssignedTo ? (0, _humanName.default)(app.application.AssignedTo) : ''
  }, {
    title: 'Job Title',
    value: (_app$application2 = app.application) === null || _app$application2 === void 0 ? void 0 : (_app$application2$Ass = _app$application2.AssignedTo) === null || _app$application2$Ass === void 0 ? void 0 : _app$application2$Ass.job
  }, {
    title: 'Email',
    value: (_app$application3 = app.application) === null || _app$application3 === void 0 ? void 0 : (_app$application3$Ass = _app$application3.AssignedTo) === null || _app$application3$Ass === void 0 ? void 0 : _app$application3$Ass.username
  }, {
    title: 'Telephone',
    value: (0, _formatPhoneNumber.default)((_app$application4 = app.application) === null || _app$application4 === void 0 ? void 0 : (_app$application4$Ass = _app$application4.AssignedTo) === null || _app$application4$Ass === void 0 ? void 0 : _app$application4$Ass.telephone, (_app$application5 = app.application) === null || _app$application5 === void 0 ? void 0 : (_app$application5$Ass = _app$application5.AssignedTo) === null || _app$application5$Ass === void 0 ? void 0 : _app$application5$Ass.extension)
  }, {
    title: (_app$application6 = app.application) !== null && _app$application6 !== void 0 && (_app$application6$Ass = _app$application6.AssignedTo) !== null && _app$application6$Ass !== void 0 && (_app$application6$Ass2 = _app$application6$Ass.Affiliation) !== null && _app$application6$Ass2 !== void 0 && _app$application6$Ass2.type ? (0, _mapEnumValue.default)((_app$application7 = app.application) === null || _app$application7 === void 0 ? void 0 : (_app$application7$Ass = _app$application7.AssignedTo) === null || _app$application7$Ass === void 0 ? void 0 : (_app$application7$Ass2 = _app$application7$Ass.Affiliation) === null || _app$application7$Ass2 === void 0 ? void 0 : _app$application7$Ass2.type) : 'Affiliation',
    value: (_app$application8 = app.application) === null || _app$application8 === void 0 ? void 0 : (_app$application8$Ass = _app$application8.AssignedTo) === null || _app$application8$Ass === void 0 ? void 0 : (_app$application8$Ass2 = _app$application8$Ass.Affiliation) === null || _app$application8$Ass2 === void 0 ? void 0 : _app$application8$Ass2.name
  }];
  const liaisonSummary = [{
    title: 'Name',
    value: (_app$application9 = app.application) !== null && _app$application9 !== void 0 && _app$application9.User ? (0, _humanName.default)(app.application.User) : ''
  }, {
    title: 'Job Title',
    value: (_app$application10 = app.application) === null || _app$application10 === void 0 ? void 0 : (_app$application10$Us = _app$application10.User) === null || _app$application10$Us === void 0 ? void 0 : _app$application10$Us.job
  }, {
    title: 'Email',
    value: (_app$application11 = app.application) === null || _app$application11 === void 0 ? void 0 : (_app$application11$Us = _app$application11.User) === null || _app$application11$Us === void 0 ? void 0 : _app$application11$Us.username
  }, {
    title: 'Telephone',
    value: (0, _formatPhoneNumber.default)((_app$application12 = app.application) === null || _app$application12 === void 0 ? void 0 : (_app$application12$Us = _app$application12.User) === null || _app$application12$Us === void 0 ? void 0 : _app$application12$Us.telephone, (_app$application13 = app.application) === null || _app$application13 === void 0 ? void 0 : (_app$application13$Us = _app$application13.User) === null || _app$application13$Us === void 0 ? void 0 : _app$application13$Us.extension)
  }, {
    title: (_app$application14 = app.application) !== null && _app$application14 !== void 0 && (_app$application14$Us = _app$application14.User) !== null && _app$application14$Us !== void 0 && (_app$application14$Us2 = _app$application14$Us.Affiliation) !== null && _app$application14$Us2 !== void 0 && _app$application14$Us2.type ? (0, _mapEnumValue.default)((_app$application15 = app.application) === null || _app$application15 === void 0 ? void 0 : (_app$application15$Us = _app$application15.User) === null || _app$application15$Us === void 0 ? void 0 : (_app$application15$Us2 = _app$application15$Us.Affiliation) === null || _app$application15$Us2 === void 0 ? void 0 : _app$application15$Us2.type) : 'Affiliation',
    value: (_app$application16 = app.application) === null || _app$application16 === void 0 ? void 0 : (_app$application16$Us = _app$application16.User) === null || _app$application16$Us === void 0 ? void 0 : (_app$application16$Us2 = _app$application16$Us.Affiliation) === null || _app$application16$Us2 === void 0 ? void 0 : _app$application16$Us2.name
  }];
  let referrerSummary = [{
    title: 'Were case details collected by someone other than yourself?',
    value: ((_app$applicant = app.applicant) === null || _app$applicant === void 0 ? void 0 : _app$applicant.collected_outside_fisherhouse) == null ? '' : (_app$applicant2 = app.applicant) !== null && _app$applicant2 !== void 0 && _app$applicant2.collected_outside_fisherhouse ? 'Yes' : 'No'
  }];

  if ((_app$applicant3 = app.applicant) !== null && _app$applicant3 !== void 0 && _app$applicant3.collected_outside_fisherhouse) {
    var _app$applicant4, _app$applicant5, _app$applicant6, _app$applicant7, _app$applicant8, _app$applicant8$Affil, _app$applicant9, _app$applicant9$Affil, _app$applicant10, _app$applicant10$Affi;

    referrerSummary.push({
      title: 'Referred by',
      value: app.applicant ? (0, _humanName.default)(app.applicant) : 'Unknown'
    });
    referrerSummary.push({
      title: 'Job Title',
      value: (_app$applicant4 = app.applicant) === null || _app$applicant4 === void 0 ? void 0 : _app$applicant4.job
    });
    referrerSummary.push({
      title: 'Email',
      value: (_app$applicant5 = app.applicant) === null || _app$applicant5 === void 0 ? void 0 : _app$applicant5.email
    });
    referrerSummary.push({
      title: 'Telephone',
      value: (0, _formatPhoneNumber.default)((_app$applicant6 = app.applicant) === null || _app$applicant6 === void 0 ? void 0 : _app$applicant6.telephone, (_app$applicant7 = app.applicant) === null || _app$applicant7 === void 0 ? void 0 : _app$applicant7.extension)
    });
    referrerSummary.push({
      title: (_app$applicant8 = app.applicant) !== null && _app$applicant8 !== void 0 && (_app$applicant8$Affil = _app$applicant8.Affiliation) !== null && _app$applicant8$Affil !== void 0 && _app$applicant8$Affil.type ? (0, _mapEnumValue.default)((_app$applicant9 = app.applicant) === null || _app$applicant9 === void 0 ? void 0 : (_app$applicant9$Affil = _app$applicant9.Affiliation) === null || _app$applicant9$Affil === void 0 ? void 0 : _app$applicant9$Affil.type) : 'Affiliation',
      value: (_app$applicant10 = app.applicant) === null || _app$applicant10 === void 0 ? void 0 : (_app$applicant10$Affi = _app$applicant10.Affiliation) === null || _app$applicant10$Affi === void 0 ? void 0 : _app$applicant10$Affi.name
    });
  }

  let serviceMemberSummary = [{
    title: 'Service Member',
    value: (_app$application17 = app.application) !== null && _app$application17 !== void 0 && _app$application17.ServiceMember ? (0, _humanName.default)((_app$application18 = app.application) === null || _app$application18 === void 0 ? void 0 : _app$application18.ServiceMember) : 'Unknown'
  }];

  if ((_app$application19 = app.application) !== null && _app$application19 !== void 0 && (_app$application19$Se = _app$application19.ServiceMember) !== null && _app$application19$Se !== void 0 && _app$application19$Se.email) {
    var _app$application20, _app$application20$Se;

    serviceMemberSummary.push({
      title: 'Email',
      value: (_app$application20 = app.application) === null || _app$application20 === void 0 ? void 0 : (_app$application20$Se = _app$application20.ServiceMember) === null || _app$application20$Se === void 0 ? void 0 : _app$application20$Se.email
    });
  }

  serviceMemberSummary.push({
    title: 'Telephone',
    value: (0, _formatPhoneNumber.default)((_app$application21 = app.application) === null || _app$application21 === void 0 ? void 0 : (_app$application21$Se = _app$application21.ServiceMember) === null || _app$application21$Se === void 0 ? void 0 : _app$application21$Se.telephone, (_app$application22 = app.application) === null || _app$application22 === void 0 ? void 0 : (_app$application22$Se = _app$application22.ServiceMember) === null || _app$application22$Se === void 0 ? void 0 : _app$application22$Se.extension)
  }, {
    title: 'Branch of Service',
    value: (0, _mapEnumValue.default)((_app$application23 = app.application) === null || _app$application23 === void 0 ? void 0 : (_app$application23$Se = _app$application23.ServiceMember) === null || _app$application23$Se === void 0 ? void 0 : _app$application23$Se.branch_of_service)
  }, {
    title: 'Current Status',
    value: (0, _mapEnumValue.default)((_app$application24 = app.application) === null || _app$application24 === void 0 ? void 0 : (_app$application24$Se = _app$application24.ServiceMember) === null || _app$application24$Se === void 0 ? void 0 : _app$application24$Se.current_status)
  }, {
    title: ((_app$application25 = app.application) === null || _app$application25 === void 0 ? void 0 : (_app$application25$Se = _app$application25.ServiceMember) === null || _app$application25$Se === void 0 ? void 0 : _app$application25$Se.current_status) == 'VETERAN' ? 'VA Assigned' : 'Base Assigned',
    value: (_app$application26 = app.application) === null || _app$application26 === void 0 ? void 0 : (_app$application26$Se = _app$application26.ServiceMember) === null || _app$application26$Se === void 0 ? void 0 : (_app$application26$Se2 = _app$application26$Se.BaseAssignedTo) === null || _app$application26$Se2 === void 0 ? void 0 : _app$application26$Se2.name
  }, {
    title: "Is the family on military travel orders (ITO's) or eligible for lodging reimbursement?",
    value: ((_app$application27 = app.application) === null || _app$application27 === void 0 ? void 0 : (_app$application27$Se = _app$application27.ServiceMember) === null || _app$application27$Se === void 0 ? void 0 : _app$application27$Se.on_military_travel_orders) == null ? '' : (_app$application28 = app.application) !== null && _app$application28 !== void 0 && (_app$application28$Se = _app$application28.ServiceMember) !== null && _app$application28$Se !== void 0 && _app$application28$Se.on_military_travel_orders ? 'Yes' : 'No'
  }, {
    title: 'Is the patient someone other than the Service Member?',
    value: ((_app$application29 = app.application) === null || _app$application29 === void 0 ? void 0 : (_app$application29$Se = _app$application29.ServiceMember) === null || _app$application29$Se === void 0 ? void 0 : _app$application29$Se.other_patient) == null ? '' : (_app$application30 = app.application) !== null && _app$application30 !== void 0 && (_app$application30$Se = _app$application30.ServiceMember) !== null && _app$application30$Se !== void 0 && _app$application30$Se.other_patient ? 'Yes' : 'No'
  });

  if (((_app$application31 = app.application) === null || _app$application31 === void 0 ? void 0 : (_app$application31$Se = _app$application31.ServiceMember) === null || _app$application31$Se === void 0 ? void 0 : _app$application31$Se.other_patient) == true || ((_app$application32 = app.application) === null || _app$application32 === void 0 ? void 0 : (_app$application32$Se = _app$application32.ServiceMember) === null || _app$application32$Se === void 0 ? void 0 : _app$application32$Se.other_patient) == 'true') {
    var _app$application33, _app$application34, _app$application35, _app$application35$Pa, _app$application36, _app$application36$Pa;

    serviceMemberSummary.push({
      title: 'Patient',
      value: (_app$application33 = app.application) !== null && _app$application33 !== void 0 && _app$application33.Patient ? (0, _humanName.default)((_app$application34 = app.application) === null || _app$application34 === void 0 ? void 0 : _app$application34.Patient) : ''
    }, {
      title: 'Relationship to Service Member',
      value: (_app$application35 = app.application) !== null && _app$application35 !== void 0 && (_app$application35$Pa = _app$application35.Patient) !== null && _app$application35$Pa !== void 0 && _app$application35$Pa.relationship ? (0, _mapEnumValue.default)((_app$application36 = app.application) === null || _app$application36 === void 0 ? void 0 : (_app$application36$Pa = _app$application36.Patient) === null || _app$application36$Pa === void 0 ? void 0 : _app$application36$Pa.relationship) : ''
    });
  }

  serviceMemberSummary.push({
    title: 'Treatment Facility',
    value: (_app$application37 = app.application) === null || _app$application37 === void 0 ? void 0 : (_app$application37$Se = _app$application37.ServiceMember) === null || _app$application37$Se === void 0 ? void 0 : (_app$application37$Se2 = _app$application37$Se.TreatmentFacility) === null || _app$application37$Se2 === void 0 ? void 0 : _app$application37$Se2.name
  });
  const primaryGuest = ((_app$application38 = app.application) === null || _app$application38 === void 0 ? void 0 : (_app$application38$Pr = _app$application38.PrimaryGuest) === null || _app$application38$Pr === void 0 ? void 0 : _app$application38$Pr.items[0]) || {};
  let primaryGuestSummary = [{
    title: 'Primary Guest Name',
    value: (0, _humanName.default)(primaryGuest)
  }];

  if (primaryGuest !== null && primaryGuest !== void 0 && primaryGuest.email) {
    primaryGuestSummary.push({
      title: 'Email',
      value: primaryGuest.email
    });
  }

  primaryGuestSummary.push({
    title: 'Telephone',
    value: (0, _formatPhoneNumber.default)(primaryGuest === null || primaryGuest === void 0 ? void 0 : primaryGuest.telephone, primaryGuest === null || primaryGuest === void 0 ? void 0 : primaryGuest.extension)
  }, {
    title: 'Address',
    value: (primaryGuest.address || '') + ', ' + (primaryGuest.address_2 || '') + ', ' + (primaryGuest.city || '') + ', ' + (primaryGuest.state || '') + ', ' + (primaryGuest.zip || '')
  }, {
    title: 'Relationship to Service Member',
    value: primaryGuest.relationship
  });
  let additionalGuestSummaries = [];

  if ((_app$application39 = app.application) !== null && _app$application39 !== void 0 && _app$application39.AdditionalGuests.items) {
    var _app$application40;

    let AGs = (_app$application40 = app.application) === null || _app$application40 === void 0 ? void 0 : _app$application40.AdditionalGuests.items;
    AGs // .sort((a, b) => {
    //   return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    // })
    .forEach(g => {
      let agInfo = [{
        title: 'Guest Name',
        value: (0, _humanName.default)(g)
      }];

      if (g.relationship) {
        agInfo.push({
          title: 'Relationship to Service Member',
          value: g.relationship
        });
      }

      if (g.under_age_three) {
        agInfo.push({
          title: 'Guest is Under 3',
          value: ''
        });
      }

      additionalGuestSummaries.push(agInfo);
    });
  }

  let lodgingPreferencesSummary = [{
    title: 'Requested Room Type',
    value: (0, _mapEnumValue.default)((_app$application41 = app.application) === null || _app$application41 === void 0 ? void 0 : _app$application41.InitialStay.items[0].room_type_requests)
  }];

  if (((_app$application42 = app.application) === null || _app$application42 === void 0 ? void 0 : _app$application42.InitialStay.items[0].room_type_requests) == 'OTHER') {
    var _app$application43;

    lodgingPreferencesSummary.push({
      title: 'Requested Room Description',
      value: (_app$application43 = app.application) === null || _app$application43 === void 0 ? void 0 : _app$application43.InitialStay.items[0].room_description
    });
  }

  lodgingPreferencesSummary.push({
    title: 'Preferred Room Features',
    value: (_app$application44 = app.application) !== null && _app$application44 !== void 0 && _app$application44.InitialStay.items[0].room_feature_requests ? (_app$application45 = app.application) === null || _app$application45 === void 0 ? void 0 : _app$application45.InitialStay.items[0].room_feature_requests.map(item => (0, _mapEnumValue.default)(item)).join(', ') : ''
  }, {
    title: 'Special Requests',
    value: (_app$application46 = app.application) === null || _app$application46 === void 0 ? void 0 : _app$application46.InitialStay.items[0].special_requests
  });

  const fileName = _tmp.default.tmpNameSync();

  const pdf = await _renderer.default.renderToFile( /*#__PURE__*/_react.default.createElement(_renderer.Document, null, /*#__PURE__*/_react.default.createElement(_renderer.Page, {
    style: _Stylesheet.default.page
  }, /*#__PURE__*/_react.default.createElement(_renderer.View, {
    style: _Stylesheet.default.page
  }, /*#__PURE__*/_react.default.createElement(_renderer.View, null, /*#__PURE__*/_react.default.createElement(_renderer.Text, {
    style: _Stylesheet.default.header
  }, "Liaison Application Summary")), /*#__PURE__*/_react.default.createElement(_renderer.View, {
    style: _Stylesheet.default.pdfFields
  }, /*#__PURE__*/_react.default.createElement(_ApplicationSummary.default, {
    sectionTitle: "Admin",
    listItems: adminSummary
  }), /*#__PURE__*/_react.default.createElement(_ApplicationSummary.default, {
    sectionTitle: "Liaison",
    listItems: liaisonSummary
  }), /*#__PURE__*/_react.default.createElement(_ApplicationSummary.default, {
    sectionTitle: "Referrer",
    listItems: referrerSummary
  }), /*#__PURE__*/_react.default.createElement(_ApplicationSummary.default, {
    sectionTitle: "Service Member",
    listItems: serviceMemberSummary
  }), /*#__PURE__*/_react.default.createElement(_ApplicationSummary.default, {
    sectionTitle: "Guests",
    listItems: primaryGuestSummary
  }), additionalGuestSummaries.map((item, index) => /*#__PURE__*/_react.default.createElement(_ApplicationSummary.default, {
    key: index,
    listItems: item
  })), /*#__PURE__*/_react.default.createElement(_ApplicationSummary.default, {
    sectionTitle: "Lodging Preferences",
    listItems: lodgingPreferencesSummary
  }), /*#__PURE__*/_react.default.createElement(_staySummary.default, {
    stay: (_app$application47 = app.application) === null || _app$application47 === void 0 ? void 0 : _app$application47.InitialStay.items[0]
  }), (_app$application48 = app.application) === null || _app$application48 === void 0 ? void 0 : _app$application48.ExtendedStays.items.map(item => /*#__PURE__*/_react.default.createElement(_staySummary.default, {
    key: item.id,
    stay: item
  })))))), fileName);
  return _nodeFs.default.readFileSync(fileName, {
    encoding: 'base64'
  });
};

var _default = handler;
exports.default = _default;