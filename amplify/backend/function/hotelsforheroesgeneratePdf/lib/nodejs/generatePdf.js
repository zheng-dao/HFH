'use strict';

var _react = _interopRequireDefault(require('react'));

var _renderer = _interopRequireWildcard(require('@react-pdf/renderer'));

var _Stylesheet = _interopRequireDefault(require('./Stylesheet'));

var _ApplicationSummary = _interopRequireDefault(require('./ApplicationSummary'));

var _humanName = _interopRequireDefault(require('./humanName'));

var _mapEnumValue = _interopRequireDefault(require('./mapEnumValue'));

var _formatPhoneNumber = _interopRequireDefault(require('./formatPhoneNumber'));

var _tmp = _interopRequireDefault(require('tmp'));

var _nodeFs = _interopRequireDefault(require('node:fs'));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const generateAdminPdf = async (application, encoding) => {
  var _application$Assigned,
    _application$Assigned2,
    _application$Assigned3,
    _application$Assigned4,
    _application$Assigned5,
    _application$Assigned6,
    _application$Assigned7,
    _application$Assigned8,
    _application$Assigned9,
    _application$Assigned10,
    _application$User,
    _application$User2,
    _application$User3,
    _application$User4,
    _application$User5,
    _application$User5$Af,
    _application$User6,
    _application$User6$Af,
    _application$User7,
    _application$User7$Af,
    _application$applican,
    _application$applican2,
    _application$applican3,
    _application$ServiceM,
    _application$ServiceM3,
    _application$ServiceM4,
    _application$ServiceM5,
    _application$ServiceM6,
    _application$ServiceM7,
    _application$ServiceM8,
    _application$ServiceM9,
    _application$ServiceM10,
    _application$ServiceM11,
    _application$ServiceM12,
    _application$ServiceM13,
    _application$ServiceM14,
    _application$ServiceM15,
    _application$ServiceM16,
    _application$ServiceM17,
    _application$PrimaryG;

  const adminSummary = [
    {
      title: 'Name',
      value:
        application !== null && application !== void 0 && application.AssignedTo
          ? (0, _humanName.default)(application.AssignedTo)
          : 'Unknown',
    },
    {
      title: 'Job Title',
      value:
        application === null || application === void 0
          ? void 0
          : (_application$Assigned = application.AssignedTo) === null ||
            _application$Assigned === void 0
          ? void 0
          : _application$Assigned.job,
    },
    {
      title: 'Email',
      value:
        application === null || application === void 0
          ? void 0
          : (_application$Assigned2 = application.AssignedTo) === null ||
            _application$Assigned2 === void 0
          ? void 0
          : _application$Assigned2.username,
    },
    {
      title: 'Telephone',
      value: (0, _formatPhoneNumber.default)(
        application === null || application === void 0
          ? void 0
          : (_application$Assigned3 = application.AssignedTo) === null ||
            _application$Assigned3 === void 0
          ? void 0
          : _application$Assigned3.telephone,
        application === null || application === void 0
          ? void 0
          : (_application$Assigned4 = application.AssignedTo) === null ||
            _application$Assigned4 === void 0
          ? void 0
          : _application$Assigned4.extension
      ),
    },
    {
      title:
        application !== null &&
        application !== void 0 &&
        (_application$Assigned5 = application.AssignedTo) !== null &&
        _application$Assigned5 !== void 0 &&
        (_application$Assigned6 = _application$Assigned5.Affiliation) !== null &&
        _application$Assigned6 !== void 0 &&
        _application$Assigned6.type
          ? (0, _mapEnumValue.default)(
              application === null || application === void 0
                ? void 0
                : (_application$Assigned7 = application.AssignedTo) === null ||
                  _application$Assigned7 === void 0
                ? void 0
                : (_application$Assigned8 = _application$Assigned7.Affiliation) === null ||
                  _application$Assigned8 === void 0
                ? void 0
                : _application$Assigned8.type
            )
          : 'Affiliation',
      value:
        application === null || application === void 0
          ? void 0
          : (_application$Assigned9 = application.AssignedTo) === null ||
            _application$Assigned9 === void 0
          ? void 0
          : (_application$Assigned10 = _application$Assigned9.Affiliation) === null ||
            _application$Assigned10 === void 0
          ? void 0
          : _application$Assigned10.name,
    },
  ];
  const liaisonSummary = [
    {
      title: 'Name',
      value:
        application !== null && application !== void 0 && application.User
          ? (0, _humanName.default)(application.User)
          : 'Unknown',
    },
    {
      title: 'Job Title',
      value:
        application === null || application === void 0
          ? void 0
          : (_application$User = application.User) === null || _application$User === void 0
          ? void 0
          : _application$User.job,
    },
    {
      title: 'Email',
      value:
        application === null || application === void 0
          ? void 0
          : (_application$User2 = application.User) === null || _application$User2 === void 0
          ? void 0
          : _application$User2.username,
    },
    {
      title: 'Telephone',
      value: (0, _formatPhoneNumber.default)(
        application === null || application === void 0
          ? void 0
          : (_application$User3 = application.User) === null || _application$User3 === void 0
          ? void 0
          : _application$User3.telephone,
        application === null || application === void 0
          ? void 0
          : (_application$User4 = application.User) === null || _application$User4 === void 0
          ? void 0
          : _application$User4.extension
      ),
    },
    {
      title:
        application !== null &&
        application !== void 0 &&
        (_application$User5 = application.User) !== null &&
        _application$User5 !== void 0 &&
        (_application$User5$Af = _application$User5.Affiliation) !== null &&
        _application$User5$Af !== void 0 &&
        _application$User5$Af.type
          ? (0, _mapEnumValue.default)(
              application === null || application === void 0
                ? void 0
                : (_application$User6 = application.User) === null || _application$User6 === void 0
                ? void 0
                : (_application$User6$Af = _application$User6.Affiliation) === null ||
                  _application$User6$Af === void 0
                ? void 0
                : _application$User6$Af.type
            )
          : 'Affiliation',
      value:
        application === null || application === void 0
          ? void 0
          : (_application$User7 = application.User) === null || _application$User7 === void 0
          ? void 0
          : (_application$User7$Af = _application$User7.Affiliation) === null ||
            _application$User7$Af === void 0
          ? void 0
          : _application$User7$Af.name,
    },
  ];
  let referrerSummary = [
    {
      title: 'Were case details collected by someone other than yourself?',
      value:
        ((_application$applican = application.applicant) === null ||
        _application$applican === void 0
          ? void 0
          : _application$applican.collected_outside_fisherhouse) == null
          ? ''
          : (_application$applican2 = application.applicant) !== null &&
            _application$applican2 !== void 0 &&
            _application$applican2.collected_outside_fisherhouse
          ? 'Yes'
          : 'No',
    },
  ];

  if (
    (_application$applican3 = application.applicant) !== null &&
    _application$applican3 !== void 0 &&
    _application$applican3.collected_outside_fisherhouse
  ) {
    var _application$applican4,
      _application$applican5,
      _application$applican6,
      _application$applican7,
      _application$applican8,
      _application$applican9,
      _application$applican10,
      _application$applican11,
      _application$applican12,
      _application$applican13;

    referrerSummary.push({
      title: 'Referred by',
      value: application.applicant ? (0, _humanName.default)(application.applicant) : 'Unknown',
    });
    referrerSummary.push({
      title: 'Job Title',
      value:
        (_application$applican4 = application.applicant) === null ||
        _application$applican4 === void 0
          ? void 0
          : _application$applican4.job,
    });
    referrerSummary.push({
      title: 'Email',
      value:
        (_application$applican5 = application.applicant) === null ||
        _application$applican5 === void 0
          ? void 0
          : _application$applican5.email,
    });
    referrerSummary.push({
      title: 'Telephone',
      value: (0, _formatPhoneNumber.default)(
        (_application$applican6 = application.applicant) === null ||
          _application$applican6 === void 0
          ? void 0
          : _application$applican6.telephone,
        (_application$applican7 = application.applicant) === null ||
          _application$applican7 === void 0
          ? void 0
          : _application$applican7.extension
      ),
    });
    referrerSummary.push({
      title:
        (_application$applican8 = application.applicant) !== null &&
        _application$applican8 !== void 0 &&
        (_application$applican9 = _application$applican8.Affiliation) !== null &&
        _application$applican9 !== void 0 &&
        _application$applican9.type
          ? (0, _mapEnumValue.default)(
              (_application$applican10 = application.applicant) === null ||
                _application$applican10 === void 0
                ? void 0
                : (_application$applican11 = _application$applican10.Affiliation) === null ||
                  _application$applican11 === void 0
                ? void 0
                : _application$applican11.type
            )
          : 'Affiliation',
      value:
        (_application$applican12 = application.applicant) === null ||
        _application$applican12 === void 0
          ? void 0
          : (_application$applican13 = _application$applican12.Affiliation) === null ||
            _application$applican13 === void 0
          ? void 0
          : _application$applican13.name,
    });
  }

  let serviceMemberSummary = [
    {
      title: 'Service Member',
      value:
        application !== null && application !== void 0 && application.ServiceMember
          ? (0, _humanName.default)(
              application === null || application === void 0 ? void 0 : application.ServiceMember
            )
          : 'Unknown',
    },
  ];

  if (
    application !== null &&
    application !== void 0 &&
    (_application$ServiceM = application.ServiceMember) !== null &&
    _application$ServiceM !== void 0 &&
    _application$ServiceM.email
  ) {
    var _application$ServiceM2;

    serviceMemberSummary.push({
      title: 'Email',
      value:
        application === null || application === void 0
          ? void 0
          : (_application$ServiceM2 = application.ServiceMember) === null ||
            _application$ServiceM2 === void 0
          ? void 0
          : _application$ServiceM2.email,
    });
  }

  serviceMemberSummary.push(
    {
      title: 'Telephone',
      value: (0, _formatPhoneNumber.default)(
        application === null || application === void 0
          ? void 0
          : (_application$ServiceM3 = application.ServiceMember) === null ||
            _application$ServiceM3 === void 0
          ? void 0
          : _application$ServiceM3.telephone,
        application === null || application === void 0
          ? void 0
          : (_application$ServiceM4 = application.ServiceMember) === null ||
            _application$ServiceM4 === void 0
          ? void 0
          : _application$ServiceM4.extension
      ),
    },
    {
      title: 'Branch of Service',
      value: (0, _mapEnumValue.default)(
        application === null || application === void 0
          ? void 0
          : (_application$ServiceM5 = application.ServiceMember) === null ||
            _application$ServiceM5 === void 0
          ? void 0
          : _application$ServiceM5.branch_of_service
      ),
    },
    {
      title: 'Current Status',
      value: (0, _mapEnumValue.default)(
        application === null || application === void 0
          ? void 0
          : (_application$ServiceM6 = application.ServiceMember) === null ||
            _application$ServiceM6 === void 0
          ? void 0
          : _application$ServiceM6.current_status
      ),
    },
    {
      title:
        (application === null || application === void 0
          ? void 0
          : (_application$ServiceM7 = application.ServiceMember) === null ||
            _application$ServiceM7 === void 0
          ? void 0
          : _application$ServiceM7.current_status) == 'VETERAN'
          ? 'VA Assigned'
          : 'Base Assigned',
      value:
        application === null || application === void 0
          ? void 0
          : (_application$ServiceM8 = application.ServiceMember) === null ||
            _application$ServiceM8 === void 0
          ? void 0
          : (_application$ServiceM9 = _application$ServiceM8.BaseAssignedTo) === null ||
            _application$ServiceM9 === void 0
          ? void 0
          : _application$ServiceM9.name,
    },
    {
      title:
        "Is the family on military travel orders (ITO's) or eligible for lodging reimbursement?",
      value:
        (application === null || application === void 0
          ? void 0
          : (_application$ServiceM10 = application.ServiceMember) === null ||
            _application$ServiceM10 === void 0
          ? void 0
          : _application$ServiceM10.on_military_travel_orders) == null
          ? ''
          : application !== null &&
            application !== void 0 &&
            (_application$ServiceM11 = application.ServiceMember) !== null &&
            _application$ServiceM11 !== void 0 &&
            _application$ServiceM11.on_military_travel_orders
          ? 'Yes'
          : 'No',
    },
    {
      title: 'Is the patient someone other than the Service Member?',
      value:
        application !== null &&
        application !== void 0 &&
        (_application$ServiceM12 = application.ServiceMember) !== null &&
        _application$ServiceM12 !== void 0 &&
        _application$ServiceM12.other_patient
          ? ''
          : application !== null &&
            application !== void 0 &&
            (_application$ServiceM13 = application.ServiceMember) !== null &&
            _application$ServiceM13 !== void 0 &&
            _application$ServiceM13.other_patient
          ? 'Yes'
          : 'No',
    }
  );

  if (
    (application === null || application === void 0
      ? void 0
      : (_application$ServiceM14 = application.ServiceMember) === null ||
        _application$ServiceM14 === void 0
      ? void 0
      : _application$ServiceM14.other_patient) == true ||
    (application === null || application === void 0
      ? void 0
      : (_application$ServiceM15 = application.ServiceMember) === null ||
        _application$ServiceM15 === void 0
      ? void 0
      : _application$ServiceM15.other_patient) == 'true'
  ) {
    var _application$Patient, _application$Patient2;

    serviceMemberSummary.push(
      {
        title: 'Patient',
        value:
          application !== null && application !== void 0 && application.Patient
            ? (0, _humanName.default)(
                application === null || application === void 0 ? void 0 : application.Patient
              )
            : '',
      },
      {
        title: 'Relationship to Service Member',
        value:
          application !== null &&
          application !== void 0 &&
          (_application$Patient = application.Patient) !== null &&
          _application$Patient !== void 0 &&
          _application$Patient.relationship
            ? (0, _mapEnumValue.default)(
                application === null || application === void 0
                  ? void 0
                  : (_application$Patient2 = application.Patient) === null ||
                    _application$Patient2 === void 0
                  ? void 0
                  : _application$Patient2.relationship
              )
            : '',
      }
    );
  }

  serviceMemberSummary.push({
    title: 'Treatment Facility',
    value:
      application === null || application === void 0
        ? void 0
        : (_application$ServiceM16 = application.ServiceMember) === null ||
          _application$ServiceM16 === void 0
        ? void 0
        : (_application$ServiceM17 = _application$ServiceM16.TreatmentFacility) === null ||
          _application$ServiceM17 === void 0
        ? void 0
        : _application$ServiceM17.name,
  });
  const primaryGuest =
    (application === null || application === void 0
      ? void 0
      : (_application$PrimaryG = application.PrimaryGuest) === null ||
        _application$PrimaryG === void 0
      ? void 0
      : _application$PrimaryG.items[0]) || {};
  let primaryGuestSummary = [
    {
      title: 'Primary Guest Name',
      value: (0, _humanName.default)(primaryGuest),
    },
  ];

  if (primaryGuest !== null && primaryGuest !== void 0 && primaryGuest.email) {
    primaryGuestSummary.push({
      title: 'Email',
      value: primaryGuest.email,
    });
  }

  primaryGuestSummary.push(
    {
      title: 'Telephone',
      value: (0, _formatPhoneNumber.default)(
        primaryGuest === null || primaryGuest === void 0 ? void 0 : primaryGuest.telephone,
        primaryGuest === null || primaryGuest === void 0 ? void 0 : primaryGuest.extension
      ),
    },
    {
      title: 'Address',
      value:
        (primaryGuest.address || '') +
        ', ' +
        (primaryGuest.address_2 || '') +
        ', ' +
        (primaryGuest.city || '') +
        ', ' +
        (primaryGuest.state || '') +
        ', ' +
        (primaryGuest.zip || ''),
    },
    {
      title: 'Relationship to Service Member',
      value: primaryGuest.relationship,
    }
  );
  let additionalGuestSummaries = [];

  if (application !== null && application !== void 0 && application.AdditionalGuests.items) {
    let AGs =
      application === null || application === void 0 ? void 0 : application.AdditionalGuests.items;
    AGs // .sort((a, b) => {
      //   return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      // })
      .forEach((g) => {
        let agInfo = [
          {
            title: 'Guest Name',
            value: (0, _humanName.default)(g),
          },
        ];

        if (g.relationship) {
          agInfo.push({
            title: 'Relationship to Service Member',
            value: g.relationship,
          });
        }

        if (g.under_age_three) {
          agInfo.push({
            title: 'Guest is Under 3',
            value: '',
          });
        }

        additionalGuestSummaries.push(agInfo);
      });
  }

  let lodgingPreferencesSummary = [
    {
      title: 'Requested Room Type',
      value: (0, _mapEnumValue.default)(
        application === null || application === void 0
          ? void 0
          : application.InitialStay.items[0].room_type_requests
      ),
    },
  ];

  if (
    (application === null || application === void 0
      ? void 0
      : application.InitialStay.items[0].room_type_requests) == 'OTHER'
  ) {
    lodgingPreferencesSummary.push({
      title: 'Requested Room Description',
      value:
        application === null || application === void 0
          ? void 0
          : application.InitialStay.items[0].room_description,
    });
  }

  lodgingPreferencesSummary.push(
    {
      title: 'Preferred Room Features',
      value:
        application !== null &&
        application !== void 0 &&
        application.InitialStay.items[0].room_feature_requests
          ? application === null || application === void 0
            ? void 0
            : application.InitialStay.items[0].room_feature_requests
                .map((item) => (0, _mapEnumValue.default)(item))
                .join(', ')
          : '',
    },
    {
      title: 'Special Requests',
      value:
        application === null || application === void 0
          ? void 0
          : application.InitialStay.items[0].special_requests,
    }
  );

  const fileName = _tmp.default.tmpNameSync();

  const pdf = await _renderer.default.renderToFile(
    /*#__PURE__*/ _react.default.createElement(
      _renderer.Document,
      null,
      /*#__PURE__*/ _react.default.createElement(
        _renderer.Page,
        {
          style: _Stylesheet.default.page,
        },
        /*#__PURE__*/ _react.default.createElement(
          _renderer.View,
          {
            style: _Stylesheet.default.page,
          },
          /*#__PURE__*/ _react.default.createElement(
            _renderer.View,
            null,
            /*#__PURE__*/ _react.default.createElement(
              _renderer.Text,
              {
                style: _Stylesheet.default.header,
              },
              'Administrator Application Summary'
            )
          ),
          /*#__PURE__*/ _react.default.createElement(
            _renderer.View,
            {
              style: _Stylesheet.default.pdfFields,
            },
            /*#__PURE__*/ _react.default.createElement(_ApplicationSummary.default, {
              sectionTitle: 'Admin',
              listItems: adminSummary,
            }),
            /*#__PURE__*/ _react.default.createElement(_ApplicationSummary.default, {
              sectionTitle: 'Liaison',
              listItems: liaisonSummary,
            }),
            /*#__PURE__*/ _react.default.createElement(_ApplicationSummary.default, {
              sectionTitle: 'Referrer',
              listItems: referrerSummary,
            }),
            /*#__PURE__*/ _react.default.createElement(_ApplicationSummary.default, {
              sectionTitle: 'Service Member',
              listItems: serviceMemberSummary,
            }),
            /*#__PURE__*/ _react.default.createElement(_ApplicationSummary.default, {
              sectionTitle: 'Guests',
              listItems: primaryGuestSummary,
            }),
            additionalGuestSummaries.map((item, index) =>
              /*#__PURE__*/ _react.default.createElement(_ApplicationSummary.default, {
                key: index,
                listItems: item,
              })
            ),
            /*#__PURE__*/ _react.default.createElement(_ApplicationSummary.default, {
              sectionTitle: 'Lodging Preferences',
              listItems: lodgingPreferencesSummary,
            }),
            /*#__PURE__*/ _react.default.createElement(StaySummary, {
              stay:
                application === null || application === void 0
                  ? void 0
                  : application.InitialStay.items[0],
            }),
            application === null || application === void 0
              ? void 0
              : application.ExtendedStays.items.map((item) =>
                  /*#__PURE__*/ _react.default.createElement(StaySummary, {
                    key: item.id,
                    stay: item,
                  })
                )
          )
        )
      )
    ),
    fileName
  );
  return _nodeFs.default.readFileSync(fileName, {
    encoding,
  });
};

const generateLiaisonPdf = async (application, encoding) => {
  var _application$Assigned11,
    _application$Assigned12,
    _application$Assigned13,
    _application$Assigned14,
    _application$Assigned15,
    _application$Assigned16,
    _application$Assigned17,
    _application$Assigned18,
    _application$Assigned19,
    _application$Assigned20,
    _application$User8,
    _application$User9,
    _application$User10,
    _application$User11,
    _application$User12,
    _application$User12$A,
    _application$User13,
    _application$User13$A,
    _application$User14,
    _application$User14$A,
    _application$applican14,
    _application$applican15,
    _application$applican16,
    _application$ServiceM18,
    _application$ServiceM20,
    _application$ServiceM21,
    _application$ServiceM22,
    _application$ServiceM23,
    _application$ServiceM24,
    _application$ServiceM25,
    _application$ServiceM26,
    _application$ServiceM27,
    _application$ServiceM28,
    _application$ServiceM29,
    _application$ServiceM30,
    _application$ServiceM31,
    _application$ServiceM32,
    _application$ServiceM33,
    _application$ServiceM34,
    _application$PrimaryG2;

  const adminSummary = [
    {
      title: 'Name',
      value:
        application !== null && application !== void 0 && application.AssignedTo
          ? (0, _humanName.default)(application.AssignedTo)
          : '',
    },
    {
      title: 'Job Title',
      value:
        application === null || application === void 0
          ? void 0
          : (_application$Assigned11 = application.AssignedTo) === null ||
            _application$Assigned11 === void 0
          ? void 0
          : _application$Assigned11.job,
    },
    {
      title: 'Email',
      value:
        application === null || application === void 0
          ? void 0
          : (_application$Assigned12 = application.AssignedTo) === null ||
            _application$Assigned12 === void 0
          ? void 0
          : _application$Assigned12.username,
    },
    {
      title: 'Telephone',
      value: (0, _formatPhoneNumber.default)(
        application === null || application === void 0
          ? void 0
          : (_application$Assigned13 = application.AssignedTo) === null ||
            _application$Assigned13 === void 0
          ? void 0
          : _application$Assigned13.telephone,
        application === null || application === void 0
          ? void 0
          : (_application$Assigned14 = application.AssignedTo) === null ||
            _application$Assigned14 === void 0
          ? void 0
          : _application$Assigned14.extension
      ),
    },
    {
      title:
        application !== null &&
        application !== void 0 &&
        (_application$Assigned15 = application.AssignedTo) !== null &&
        _application$Assigned15 !== void 0 &&
        (_application$Assigned16 = _application$Assigned15.Affiliation) !== null &&
        _application$Assigned16 !== void 0 &&
        _application$Assigned16.type
          ? (0, _mapEnumValue.default)(
              application === null || application === void 0
                ? void 0
                : (_application$Assigned17 = application.AssignedTo) === null ||
                  _application$Assigned17 === void 0
                ? void 0
                : (_application$Assigned18 = _application$Assigned17.Affiliation) === null ||
                  _application$Assigned18 === void 0
                ? void 0
                : _application$Assigned18.type
            )
          : 'Affiliation',
      value:
        application === null || application === void 0
          ? void 0
          : (_application$Assigned19 = application.AssignedTo) === null ||
            _application$Assigned19 === void 0
          ? void 0
          : (_application$Assigned20 = _application$Assigned19.Affiliation) === null ||
            _application$Assigned20 === void 0
          ? void 0
          : _application$Assigned20.name,
    },
  ];
  const liaisonSummary = [
    {
      title: 'Name',
      value:
        application !== null && application !== void 0 && application.User
          ? (0, _humanName.default)(application.User)
          : '',
    },
    {
      title: 'Job Title',
      value:
        application === null || application === void 0
          ? void 0
          : (_application$User8 = application.User) === null || _application$User8 === void 0
          ? void 0
          : _application$User8.job,
    },
    {
      title: 'Email',
      value:
        application === null || application === void 0
          ? void 0
          : (_application$User9 = application.User) === null || _application$User9 === void 0
          ? void 0
          : _application$User9.username,
    },
    {
      title: 'Telephone',
      value: (0, _formatPhoneNumber.default)(
        application === null || application === void 0
          ? void 0
          : (_application$User10 = application.User) === null || _application$User10 === void 0
          ? void 0
          : _application$User10.telephone,
        application === null || application === void 0
          ? void 0
          : (_application$User11 = application.User) === null || _application$User11 === void 0
          ? void 0
          : _application$User11.extension
      ),
    },
    {
      title:
        application !== null &&
        application !== void 0 &&
        (_application$User12 = application.User) !== null &&
        _application$User12 !== void 0 &&
        (_application$User12$A = _application$User12.Affiliation) !== null &&
        _application$User12$A !== void 0 &&
        _application$User12$A.type
          ? (0, _mapEnumValue.default)(
              application === null || application === void 0
                ? void 0
                : (_application$User13 = application.User) === null ||
                  _application$User13 === void 0
                ? void 0
                : (_application$User13$A = _application$User13.Affiliation) === null ||
                  _application$User13$A === void 0
                ? void 0
                : _application$User13$A.type
            )
          : 'Affiliation',
      value:
        application === null || application === void 0
          ? void 0
          : (_application$User14 = application.User) === null || _application$User14 === void 0
          ? void 0
          : (_application$User14$A = _application$User14.Affiliation) === null ||
            _application$User14$A === void 0
          ? void 0
          : _application$User14$A.name,
    },
  ];
  let referrerSummary = [
    {
      title: 'Were case details collected by someone other than yourself?',
      value:
        ((_application$applican14 = application.applicant) === null ||
        _application$applican14 === void 0
          ? void 0
          : _application$applican14.collected_outside_fisherhouse) == null
          ? ''
          : (_application$applican15 = application.applicant) !== null &&
            _application$applican15 !== void 0 &&
            _application$applican15.collected_outside_fisherhouse
          ? 'Yes'
          : 'No',
    },
  ];

  if (
    (_application$applican16 = application.applicant) !== null &&
    _application$applican16 !== void 0 &&
    _application$applican16.collected_outside_fisherhouse
  ) {
    var _application$applican17,
      _application$applican18,
      _application$applican19,
      _application$applican20,
      _application$applican21,
      _application$applican22,
      _application$applican23,
      _application$applican24,
      _application$applican25,
      _application$applican26;

    referrerSummary.push({
      title: 'Referred by',
      value: application.applicant ? (0, _humanName.default)(application.applicant) : 'Unknown',
    });
    referrerSummary.push({
      title: 'Job Title',
      value:
        (_application$applican17 = application.applicant) === null ||
        _application$applican17 === void 0
          ? void 0
          : _application$applican17.job,
    });
    referrerSummary.push({
      title: 'Email',
      value:
        (_application$applican18 = application.applicant) === null ||
        _application$applican18 === void 0
          ? void 0
          : _application$applican18.email,
    });
    referrerSummary.push({
      title: 'Telephone',
      value: (0, _formatPhoneNumber.default)(
        (_application$applican19 = application.applicant) === null ||
          _application$applican19 === void 0
          ? void 0
          : _application$applican19.telephone,
        (_application$applican20 = application.applicant) === null ||
          _application$applican20 === void 0
          ? void 0
          : _application$applican20.extension
      ),
    });
    referrerSummary.push({
      title:
        (_application$applican21 = application.applicant) !== null &&
        _application$applican21 !== void 0 &&
        (_application$applican22 = _application$applican21.Affiliation) !== null &&
        _application$applican22 !== void 0 &&
        _application$applican22.type
          ? (0, _mapEnumValue.default)(
              (_application$applican23 = application.applicant) === null ||
                _application$applican23 === void 0
                ? void 0
                : (_application$applican24 = _application$applican23.Affiliation) === null ||
                  _application$applican24 === void 0
                ? void 0
                : _application$applican24.type
            )
          : 'Affiliation',
      value:
        (_application$applican25 = application.applicant) === null ||
        _application$applican25 === void 0
          ? void 0
          : (_application$applican26 = _application$applican25.Affiliation) === null ||
            _application$applican26 === void 0
          ? void 0
          : _application$applican26.name,
    });
  }

  let serviceMemberSummary = [
    {
      title: 'Service Member',
      value:
        application !== null && application !== void 0 && application.ServiceMember
          ? (0, _humanName.default)(
              application === null || application === void 0 ? void 0 : application.ServiceMember
            )
          : 'Unknown',
    },
  ];

  if (
    application !== null &&
    application !== void 0 &&
    (_application$ServiceM18 = application.ServiceMember) !== null &&
    _application$ServiceM18 !== void 0 &&
    _application$ServiceM18.email
  ) {
    var _application$ServiceM19;

    serviceMemberSummary.push({
      title: 'Email',
      value:
        application === null || application === void 0
          ? void 0
          : (_application$ServiceM19 = application.ServiceMember) === null ||
            _application$ServiceM19 === void 0
          ? void 0
          : _application$ServiceM19.email,
    });
  }

  serviceMemberSummary.push(
    {
      title: 'Telephone',
      value: (0, _formatPhoneNumber.default)(
        application === null || application === void 0
          ? void 0
          : (_application$ServiceM20 = application.ServiceMember) === null ||
            _application$ServiceM20 === void 0
          ? void 0
          : _application$ServiceM20.telephone,
        application === null || application === void 0
          ? void 0
          : (_application$ServiceM21 = application.ServiceMember) === null ||
            _application$ServiceM21 === void 0
          ? void 0
          : _application$ServiceM21.extension
      ),
    },
    {
      title: 'Branch of Service',
      value: (0, _mapEnumValue.default)(
        application === null || application === void 0
          ? void 0
          : (_application$ServiceM22 = application.ServiceMember) === null ||
            _application$ServiceM22 === void 0
          ? void 0
          : _application$ServiceM22.branch_of_service
      ),
    },
    {
      title: 'Current Status',
      value: (0, _mapEnumValue.default)(
        application === null || application === void 0
          ? void 0
          : (_application$ServiceM23 = application.ServiceMember) === null ||
            _application$ServiceM23 === void 0
          ? void 0
          : _application$ServiceM23.current_status
      ),
    },
    {
      title:
        (application === null || application === void 0
          ? void 0
          : (_application$ServiceM24 = application.ServiceMember) === null ||
            _application$ServiceM24 === void 0
          ? void 0
          : _application$ServiceM24.current_status) == 'VETERAN'
          ? 'VA Assigned'
          : 'Base Assigned',
      value:
        application === null || application === void 0
          ? void 0
          : (_application$ServiceM25 = application.ServiceMember) === null ||
            _application$ServiceM25 === void 0
          ? void 0
          : (_application$ServiceM26 = _application$ServiceM25.BaseAssignedTo) === null ||
            _application$ServiceM26 === void 0
          ? void 0
          : _application$ServiceM26.name,
    },
    {
      title:
        "Is the family on military travel orders (ITO's) or eligible for lodging reimbursement?",
      value:
        (application === null || application === void 0
          ? void 0
          : (_application$ServiceM27 = application.ServiceMember) === null ||
            _application$ServiceM27 === void 0
          ? void 0
          : _application$ServiceM27.on_military_travel_orders) == null
          ? ''
          : application !== null &&
            application !== void 0 &&
            (_application$ServiceM28 = application.ServiceMember) !== null &&
            _application$ServiceM28 !== void 0 &&
            _application$ServiceM28.on_military_travel_orders
          ? 'Yes'
          : 'No',
    },
    {
      title: 'Is the patient someone other than the Service Member?',
      value:
        (application === null || application === void 0
          ? void 0
          : (_application$ServiceM29 = application.ServiceMember) === null ||
            _application$ServiceM29 === void 0
          ? void 0
          : _application$ServiceM29.other_patient) == null
          ? ''
          : application !== null &&
            application !== void 0 &&
            (_application$ServiceM30 = application.ServiceMember) !== null &&
            _application$ServiceM30 !== void 0 &&
            _application$ServiceM30.other_patient
          ? 'Yes'
          : 'No',
    }
  );

  if (
    (application === null || application === void 0
      ? void 0
      : (_application$ServiceM31 = application.ServiceMember) === null ||
        _application$ServiceM31 === void 0
      ? void 0
      : _application$ServiceM31.other_patient) == true ||
    (application === null || application === void 0
      ? void 0
      : (_application$ServiceM32 = application.ServiceMember) === null ||
        _application$ServiceM32 === void 0
      ? void 0
      : _application$ServiceM32.other_patient) == 'true'
  ) {
    var _application$Patient3, _application$Patient4;

    serviceMemberSummary.push(
      {
        title: 'Patient',
        value:
          application !== null && application !== void 0 && application.Patient
            ? (0, _humanName.default)(
                application === null || application === void 0 ? void 0 : application.Patient
              )
            : '',
      },
      {
        title: 'Relationship to Service Member',
        value:
          application !== null &&
          application !== void 0 &&
          (_application$Patient3 = application.Patient) !== null &&
          _application$Patient3 !== void 0 &&
          _application$Patient3.relationship
            ? (0, _mapEnumValue.default)(
                application === null || application === void 0
                  ? void 0
                  : (_application$Patient4 = application.Patient) === null ||
                    _application$Patient4 === void 0
                  ? void 0
                  : _application$Patient4.relationship
              )
            : '',
      }
    );
  }

  serviceMemberSummary.push({
    title: 'Treatment Facility',
    value:
      application === null || application === void 0
        ? void 0
        : (_application$ServiceM33 = application.ServiceMember) === null ||
          _application$ServiceM33 === void 0
        ? void 0
        : (_application$ServiceM34 = _application$ServiceM33.TreatmentFacility) === null ||
          _application$ServiceM34 === void 0
        ? void 0
        : _application$ServiceM34.name,
  });
  const primaryGuest =
    (application === null || application === void 0
      ? void 0
      : (_application$PrimaryG2 = application.PrimaryGuest) === null ||
        _application$PrimaryG2 === void 0
      ? void 0
      : _application$PrimaryG2.items[0]) || {};
  let primaryGuestSummary = [
    {
      title: 'Primary Guest Name',
      value: (0, _humanName.default)(primaryGuest),
    },
  ];

  if (primaryGuest !== null && primaryGuest !== void 0 && primaryGuest.email) {
    primaryGuestSummary.push({
      title: 'Email',
      value: primaryGuest.email,
    });
  }

  primaryGuestSummary.push(
    {
      title: 'Telephone',
      value: (0, _formatPhoneNumber.default)(
        primaryGuest === null || primaryGuest === void 0 ? void 0 : primaryGuest.telephone,
        primaryGuest === null || primaryGuest === void 0 ? void 0 : primaryGuest.extension
      ),
    },
    {
      title: 'Address',
      value:
        (primaryGuest.address || '') +
        ', ' +
        (primaryGuest.address_2 || '') +
        ', ' +
        (primaryGuest.city || '') +
        ', ' +
        (primaryGuest.state || '') +
        ', ' +
        (primaryGuest.zip || ''),
    },
    {
      title: 'Relationship to Service Member',
      value: primaryGuest.relationship,
    }
  );
  let additionalGuestSummaries = [];

  if (application !== null && application !== void 0 && application.AdditionalGuests.items) {
    let AGs =
      application === null || application === void 0 ? void 0 : application.AdditionalGuests.items;
    AGs // .sort((a, b) => {
      //   return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      // })
      .forEach((g) => {
        let agInfo = [
          {
            title: 'Guest Name',
            value: (0, _humanName.default)(g),
          },
        ];

        if (g.relationship) {
          agInfo.push({
            title: 'Relationship to Service Member',
            value: g.relationship,
          });
        }

        if (g.under_age_three) {
          agInfo.push({
            title: 'Guest is Under 3',
            value: '',
          });
        }

        additionalGuestSummaries.push(agInfo);
      });
  }

  let lodgingPreferencesSummary = [
    {
      title: 'Requested Room Type',
      value: (0, _mapEnumValue.default)(
        application === null || application === void 0
          ? void 0
          : application.InitialStay.items[0].room_type_requests
      ),
    },
  ];

  if (
    (application === null || application === void 0
      ? void 0
      : application.InitialStay.items[0].room_type_requests) == 'OTHER'
  ) {
    lodgingPreferencesSummary.push({
      title: 'Requested Room Description',
      value:
        application === null || application === void 0
          ? void 0
          : application.InitialStay.items[0].room_description,
    });
  }

  lodgingPreferencesSummary.push(
    {
      title: 'Preferred Room Features',
      value:
        application !== null &&
        application !== void 0 &&
        application.InitialStay.items[0].room_feature_requests
          ? application === null || application === void 0
            ? void 0
            : application.InitialStay.items[0].room_feature_requests
                .map((item) => (0, _mapEnumValue.default)(item))
                .join(', ')
          : '',
    },
    {
      title: 'Special Requests',
      value:
        application === null || application === void 0
          ? void 0
          : application.InitialStay.items[0].special_requests,
    }
  );

  const fileName = _tmp.default.tmpNameSync();

  const pdf = await _renderer.default.renderToFile(
    /*#__PURE__*/ _react.default.createElement(
      _renderer.Document,
      null,
      /*#__PURE__*/ _react.default.createElement(
        _renderer.Page,
        {
          style: _Stylesheet.default.page,
        },
        /*#__PURE__*/ _react.default.createElement(
          _renderer.View,
          {
            style: _Stylesheet.default.page,
          },
          /*#__PURE__*/ _react.default.createElement(
            _renderer.View,
            null,
            /*#__PURE__*/ _react.default.createElement(
              _renderer.Text,
              {
                style: _Stylesheet.default.header,
              },
              'Liaison Application Summary'
            )
          ),
          /*#__PURE__*/ _react.default.createElement(
            _renderer.View,
            {
              style: _Stylesheet.default.pdfFields,
            },
            /*#__PURE__*/ _react.default.createElement(_ApplicationSummary.default, {
              sectionTitle: 'Admin',
              listItems: adminSummary,
            }),
            /*#__PURE__*/ _react.default.createElement(_ApplicationSummary.default, {
              sectionTitle: 'Liaison',
              listItems: liaisonSummary,
            }),
            /*#__PURE__*/ _react.default.createElement(_ApplicationSummary.default, {
              sectionTitle: 'Referrer',
              listItems: referrerSummary,
            }),
            /*#__PURE__*/ _react.default.createElement(_ApplicationSummary.default, {
              sectionTitle: 'Service Member',
              listItems: serviceMemberSummary,
            }),
            /*#__PURE__*/ _react.default.createElement(_ApplicationSummary.default, {
              sectionTitle: 'Guests',
              listItems: primaryGuestSummary,
            }),
            additionalGuestSummaries.map((item, index) =>
              /*#__PURE__*/ _react.default.createElement(_ApplicationSummary.default, {
                key: index,
                listItems: item,
              })
            ),
            /*#__PURE__*/ _react.default.createElement(_ApplicationSummary.default, {
              sectionTitle: 'Lodging Preferences',
              listItems: lodgingPreferencesSummary,
            }),
            /*#__PURE__*/ _react.default.createElement(StaySummary, {
              stay:
                application === null || application === void 0
                  ? void 0
                  : application.InitialStay.items[0],
            }),
            application === null || application === void 0
              ? void 0
              : application.ExtendedStays.items.map((item) =>
                  /*#__PURE__*/ _react.default.createElement(StaySummary, {
                    key: item.id,
                    stay: item,
                  })
                )
          )
        )
      )
    ),
    fileName
  );
  return _nodeFs.default.readFileSync(fileName, {
    encoding,
  });
};

const generateItineraryPdf = async (application, stay, encoding) => {
  const reservationSummary = [
    {
      title: 'Guest(s)',
      value:
        (application === null || application === void 0
          ? void 0
          : application.PrimaryGuest.items.map((item) => (0, _humanName.default)(item)).join()) +
        ',' +
        (application === null || application === void 0
          ? void 0
          : application.AdditionalGuests.items.map((item) => (0, _humanName.default)(item)).join()),
    },
    {
      title: 'Check-in',
      value: stay.requested_check_in,
    },
    {
      title: 'Check-out',
      value: stay.requested_check_out,
    },
    {
      title: 'Room',
      value:
        stay.room_type_actual === 'OTHER'
          ? stay.room_description_actual
          : (0, _mapEnumValue.default)(stay.room_type_actual),
    },
    {
      title: 'Total Nights',
      value:
        stay.requested_check_in && stay.requested_check_out
          ? calculateNumberOfNights(stay.requested_check_in, stay.requested_check_out)
          : 'Unknown',
    },
  ];

  const fileName = _tmp.default.tmpNameSync();

  const pdf = await _renderer.default.renderToFile(
    /*#__PURE__*/ _react.default.createElement(
      _renderer.Document,
      null,
      /*#__PURE__*/ _react.default.createElement(
        _renderer.Page,
        {
          style: _Stylesheet.default.page,
        },
        /*#__PURE__*/ _react.default.createElement(
          _renderer.View,
          {
            style: _Stylesheet.default.headerSection,
          },
          /*#__PURE__*/ _react.default.createElement(
            _renderer.View,
            {
              style: _Stylesheet.default.hotelLogo,
            },
            /*#__PURE__*/ _react.default.createElement(Image, {
              src: 'https://resources.fisherhouse.org/assets/hfh_logo.jpg',
              alt: 'Hotels for Heros Logo',
            })
          )
        ),
        /*#__PURE__*/ _react.default.createElement(
          _renderer.View,
          {
            style: _Stylesheet.default.page,
          },
          /*#__PURE__*/ _react.default.createElement(_renderer.View, {
            style: _Stylesheet.default.headerBreakLine,
          }),
          /*#__PURE__*/ _react.default.createElement(
            _renderer.View,
            {
              style: _Stylesheet.default.hotelInfoContainer,
            },
            /*#__PURE__*/ _react.default.createElement(
              _renderer.View,
              {
                style: _Stylesheet.default.hotelInfos,
              },
              app.hotelLogo &&
                /*#__PURE__*/ _react.default.createElement(Image, {
                  style: _Stylesheet.default.footerLogo,
                  src: app.hotelLogo,
                  alt: 'Hotel Brand Logo',
                })
            ),
            /*#__PURE__*/ _react.default.createElement(
              _renderer.View,
              {
                style: _Stylesheet.default.hotelInfo,
              },
              /*#__PURE__*/ _react.default.createElement(
                _renderer.Text,
                null,
                stay.HotelBooked.name
              ),
              /*#__PURE__*/ _react.default.createElement(
                _renderer.Text,
                null,
                stay.HotelBooked.address
              ),
              /*#__PURE__*/ _react.default.createElement(
                _renderer.Text,
                null,
                stay.HotelBooked.address_2
              ),
              /*#__PURE__*/ _react.default.createElement(
                _renderer.Text,
                null,
                stay.HotelBooked.city,
                ', ',
                stay.HotelBooked.state,
                ', ',
                stay.HotelBooked.zip
              ),
              /*#__PURE__*/ _react.default.createElement(
                _renderer.Text,
                null,
                stay.HotelBooked.telephone,
                stay.HotelBooked.extension ? ' x' + stay.HotelBooked.extension : ''
              )
            )
          ),
          /*#__PURE__*/ _react.default.createElement(
            _renderer.Text,
            {
              style: [
                _Stylesheet.default.strong,
                {
                  fontSize: '20pt',
                  paddingBottom: '10pt',
                },
              ],
            },
            'Confirmation Number:',
            ' ',
            /*#__PURE__*/ _react.default.createElement(
              _renderer.Text,
              {
                style: _Stylesheet.default.confirmationNumberNumber,
              },
              stay.confirmation_number
            )
          ),
          /*#__PURE__*/ _react.default.createElement(_ApplicationSummary.default, {
            sectionTitle: 'Reservation Information',
            listItems: reservationSummary,
          })
        ),
        /*#__PURE__*/ _react.default.createElement(
          _renderer.View,
          {
            style: _Stylesheet.default.footer,
          },
          /*#__PURE__*/ _react.default.createElement(
            _renderer.Text,
            {
              style: _Stylesheet.default.footerDescription,
            },
            'Guests are responsible for incidentals and additional charges beyond the cost of the room.',
            '\n',
            'Hotels will require a credit card on file as standard policy upon check-in.'
          ),
          /*#__PURE__*/ _react.default.createElement(
            _renderer.Text,
            {
              style: _Stylesheet.default.hotelInfo,
            },
            'Program of Fisher House Foundation'
          ),
          /*#__PURE__*/ _react.default.createElement(Image, {
            style: _Stylesheet.default.footerLogos,
            src: 'https://resources.fisherhouse.org/assets/fhf_email.png',
            alt: 'Hotels for Heros Logo',
          })
        )
      )
    ),
    fileName
  );
  return _nodeFs.default.readFileSync(fileName, {
    encoding,
  });
};

exports.generateAdminPdf = generateAdminPdf;
exports.generateLiaisonPdf = generateLiaisonPdf;
exports.generateItineraryPdf = generateItineraryPdf;
