import React from 'react';
import ReactPDF, { Text, Document, Page, View } from '@react-pdf/renderer';
import styles from './Stylesheet';
import ApplicationSummary from './ApplicationSummary';
import humanName from './humanName';
import mapEnumValue from './mapEnumValue';
import formatPhoneNumber from './formatPhoneNumber';
import tmp from 'tmp';
import fs from 'node:fs';

const generateAdminPdf = async (application, encoding) => {
  const adminSummary = [
    {
      title: 'Name',
      value: application?.AssignedTo ? humanName(application.AssignedTo) : 'Unknown',
    },
    {
      title: 'Job Title',
      value: application?.AssignedTo?.job,
    },
    {
      title: 'Email',
      value: application?.AssignedTo?.username,
    },
    {
      title: 'Telephone',
      value: formatPhoneNumber(
        application?.AssignedTo?.telephone,
        application?.AssignedTo?.extension
      ),
    },
    {
      title: application?.AssignedTo?.Affiliation?.type
        ? mapEnumValue(application?.AssignedTo?.Affiliation?.type)
        : 'Affiliation',
      value: application?.AssignedTo?.Affiliation?.name,
    },
  ];

  const liaisonSummary = [
    {
      title: 'Name',
      value: application?.User ? humanName(application.User) : 'Unknown',
    },
    {
      title: 'Job Title',
      value: application?.User?.job,
    },
    {
      title: 'Email',
      value: application?.User?.username,
    },
    {
      title: 'Telephone',
      value: formatPhoneNumber(application?.User?.telephone, application?.User?.extension),
    },
    {
      title: application?.User?.Affiliation?.type
        ? mapEnumValue(application?.User?.Affiliation?.type)
        : 'Affiliation',
      value: application?.User?.Affiliation?.name,
    },
  ];

  let referrerSummary = [
    {
      title: 'Were case details collected by someone other than yourself?',
      value:
        application.applicant?.collected_outside_fisherhouse == null
          ? ''
          : application.applicant?.collected_outside_fisherhouse
          ? 'Yes'
          : 'No',
    },
  ];

  if (application.applicant?.collected_outside_fisherhouse) {
    referrerSummary.push({
      title: 'Referred by',
      value: application.applicant ? humanName(application.applicant) : 'Unknown',
    });
    referrerSummary.push({ title: 'Job Title', value: application.applicant?.job });
    referrerSummary.push({ title: 'Email', value: application.applicant?.email });
    referrerSummary.push({
      title: 'Telephone',
      value: formatPhoneNumber(application.applicant?.telephone, application.applicant?.extension),
    });
    referrerSummary.push({
      title: application.applicant?.Affiliation?.type
        ? mapEnumValue(application.applicant?.Affiliation?.type)
        : 'Affiliation',
      value: application.applicant?.Affiliation?.name,
    });
  }

  let serviceMemberSummary = [
    {
      title: 'Service Member',
      value: application?.ServiceMember ? humanName(application?.ServiceMember) : 'Unknown',
    },
  ];
  if (application?.ServiceMember?.email) {
    serviceMemberSummary.push({
      title: 'Email',
      value: application?.ServiceMember?.email,
    });
  }
  serviceMemberSummary.push(
    {
      title: 'Telephone',
      value: formatPhoneNumber(
        application?.ServiceMember?.telephone,
        application?.ServiceMember?.extension
      ),
    },
    {
      title: 'Branch of Service',
      value: mapEnumValue(application?.ServiceMember?.branch_of_service),
    },
    {
      title: 'Current Status',
      value: mapEnumValue(application?.ServiceMember?.current_status),
    },
    {
      title:
        application?.ServiceMember?.current_status == 'VETERAN' ? 'VA Assigned' : 'Base Assigned',
      value: application?.ServiceMember?.BaseAssignedTo?.name,
    },
    {
      title:
        "Is the family on military travel orders (ITO's) or eligible for lodging reimbursement?",
      value:
        application?.ServiceMember?.on_military_travel_orders == null
          ? ''
          : application?.ServiceMember?.on_military_travel_orders
          ? 'Yes'
          : 'No',
    },
    {
      title: 'Is the patient someone other than the Service Member?',
      value: application?.ServiceMember?.other_patient
        ? ''
        : application?.ServiceMember?.other_patient
        ? 'Yes'
        : 'No',
    }
  );
  if (
    application?.ServiceMember?.other_patient == true ||
    application?.ServiceMember?.other_patient == 'true'
  ) {
    serviceMemberSummary.push(
      {
        title: 'Patient',
        value: application?.Patient ? humanName(application?.Patient) : '',
      },
      {
        title: 'Relationship to Service Member',
        value: application?.Patient?.relationship
          ? mapEnumValue(application?.Patient?.relationship)
          : '',
      }
    );
  }
  serviceMemberSummary.push({
    title: 'Treatment Facility',
    value: application?.ServiceMember?.TreatmentFacility?.name,
  });

  const primaryGuest = application?.PrimaryGuest?.items[0] || {};

  let primaryGuestSummary = [
    {
      title: 'Primary Guest Name',
      value: humanName(primaryGuest),
    },
  ];
  if (primaryGuest?.email) {
    primaryGuestSummary.push({
      title: 'Email',
      value: primaryGuest.email,
    });
  }
  primaryGuestSummary.push(
    {
      title: 'Telephone',
      value: formatPhoneNumber(primaryGuest?.telephone, primaryGuest?.extension),
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

  if (application?.AdditionalGuests.items) {
    let AGs = application?.AdditionalGuests.items;
    AGs
      // .sort((a, b) => {
      //   return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      // })
      .forEach((g) => {
        let agInfo = [
          {
            title: 'Guest Name',
            value: humanName(g),
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
      value: mapEnumValue(application?.InitialStay.items[0].room_type_requests),
    },
  ];
  if (application?.InitialStay.items[0].room_type_requests == 'OTHER') {
    lodgingPreferencesSummary.push({
      title: 'Requested Room Description',
      value: application?.InitialStay.items[0].room_description,
    });
  }
  lodgingPreferencesSummary.push(
    {
      title: 'Preferred Room Features',
      value: application?.InitialStay.items[0].room_feature_requests
        ? application?.InitialStay.items[0].room_feature_requests
            .map((item) => mapEnumValue(item))
            .join(', ')
        : '',
    },
    {
      title: 'Special Requests',
      value: application?.InitialStay.items[0].special_requests,
    }
  );

  const fileName = tmp.tmpNameSync();

  const pdf = await ReactPDF.renderToFile(
    <Document>
      <Page style={styles.page}>
        <View style={styles.page}>
          <View>
            <Text style={styles.header}>Administrator Application Summary</Text>
          </View>
          <View style={styles.pdfFields}>
            <ApplicationSummary sectionTitle="Admin" listItems={adminSummary} />

            <ApplicationSummary sectionTitle="Liaison" listItems={liaisonSummary} />

            <ApplicationSummary sectionTitle="Referrer" listItems={referrerSummary} />

            <ApplicationSummary sectionTitle="Service Member" listItems={serviceMemberSummary} />

            <ApplicationSummary sectionTitle="Guests" listItems={primaryGuestSummary} />

            {additionalGuestSummaries.map((item, index) => (
              <ApplicationSummary key={index} listItems={item} />
            ))}

            <ApplicationSummary
              sectionTitle="Lodging Preferences"
              listItems={lodgingPreferencesSummary}
            />

            <StaySummary stay={application?.InitialStay.items[0]} />

            {application?.ExtendedStays.items.map((item) => (
              <StaySummary key={item.id} stay={item} />
            ))}
          </View>
        </View>
      </Page>
    </Document>,
    fileName
  );

  return fs.readFileSync(fileName, { encoding });
};

const generateLiaisonPdf = async (application, encoding) => {
  const adminSummary = [
    {
      title: 'Name',
      value: application?.AssignedTo ? humanName(application.AssignedTo) : '',
    },
    {
      title: 'Job Title',
      value: application?.AssignedTo?.job,
    },
    {
      title: 'Email',
      value: application?.AssignedTo?.username,
    },
    {
      title: 'Telephone',
      value: formatPhoneNumber(
        application?.AssignedTo?.telephone,
        application?.AssignedTo?.extension
      ),
    },
    {
      title: application?.AssignedTo?.Affiliation?.type
        ? mapEnumValue(application?.AssignedTo?.Affiliation?.type)
        : 'Affiliation',
      value: application?.AssignedTo?.Affiliation?.name,
    },
  ];

  const liaisonSummary = [
    {
      title: 'Name',
      value: application?.User ? humanName(application.User) : '',
    },
    {
      title: 'Job Title',
      value: application?.User?.job,
    },
    {
      title: 'Email',
      value: application?.User?.username,
    },
    {
      title: 'Telephone',
      value: formatPhoneNumber(application?.User?.telephone, application?.User?.extension),
    },
    {
      title: application?.User?.Affiliation?.type
        ? mapEnumValue(application?.User?.Affiliation?.type)
        : 'Affiliation',
      value: application?.User?.Affiliation?.name,
    },
  ];

  let referrerSummary = [
    {
      title: 'Were case details collected by someone other than yourself?',
      value:
        application.applicant?.collected_outside_fisherhouse == null
          ? ''
          : application.applicant?.collected_outside_fisherhouse
          ? 'Yes'
          : 'No',
    },
  ];

  if (application.applicant?.collected_outside_fisherhouse) {
    referrerSummary.push({
      title: 'Referred by',
      value: application.applicant ? humanName(application.applicant) : 'Unknown',
    });
    referrerSummary.push({ title: 'Job Title', value: application.applicant?.job });
    referrerSummary.push({ title: 'Email', value: application.applicant?.email });
    referrerSummary.push({
      title: 'Telephone',
      value: formatPhoneNumber(application.applicant?.telephone, application.applicant?.extension),
    });
    referrerSummary.push({
      title: application.applicant?.Affiliation?.type
        ? mapEnumValue(application.applicant?.Affiliation?.type)
        : 'Affiliation',
      value: application.applicant?.Affiliation?.name,
    });
  }

  let serviceMemberSummary = [
    {
      title: 'Service Member',
      value: application?.ServiceMember ? humanName(application?.ServiceMember) : 'Unknown',
    },
  ];
  if (application?.ServiceMember?.email) {
    serviceMemberSummary.push({
      title: 'Email',
      value: application?.ServiceMember?.email,
    });
  }
  serviceMemberSummary.push(
    {
      title: 'Telephone',
      value: formatPhoneNumber(
        application?.ServiceMember?.telephone,
        application?.ServiceMember?.extension
      ),
    },
    {
      title: 'Branch of Service',
      value: mapEnumValue(application?.ServiceMember?.branch_of_service),
    },
    {
      title: 'Current Status',
      value: mapEnumValue(application?.ServiceMember?.current_status),
    },
    {
      title:
        application?.ServiceMember?.current_status == 'VETERAN' ? 'VA Assigned' : 'Base Assigned',
      value: application?.ServiceMember?.BaseAssignedTo?.name,
    },
    {
      title:
        "Is the family on military travel orders (ITO's) or eligible for lodging reimbursement?",
      value:
        application?.ServiceMember?.on_military_travel_orders == null
          ? ''
          : application?.ServiceMember?.on_military_travel_orders
          ? 'Yes'
          : 'No',
    },
    {
      title: 'Is the patient someone other than the Service Member?',
      value:
        application?.ServiceMember?.other_patient == null
          ? ''
          : application?.ServiceMember?.other_patient
          ? 'Yes'
          : 'No',
    }
  );
  if (
    application?.ServiceMember?.other_patient == true ||
    application?.ServiceMember?.other_patient == 'true'
  ) {
    serviceMemberSummary.push(
      {
        title: 'Patient',
        value: application?.Patient ? humanName(application?.Patient) : '',
      },
      {
        title: 'Relationship to Service Member',
        value: application?.Patient?.relationship
          ? mapEnumValue(application?.Patient?.relationship)
          : '',
      }
    );
  }
  serviceMemberSummary.push({
    title: 'Treatment Facility',
    value: application?.ServiceMember?.TreatmentFacility?.name,
  });

  const primaryGuest = application?.PrimaryGuest?.items[0] || {};

  let primaryGuestSummary = [
    {
      title: 'Primary Guest Name',
      value: humanName(primaryGuest),
    },
  ];
  if (primaryGuest?.email) {
    primaryGuestSummary.push({
      title: 'Email',
      value: primaryGuest.email,
    });
  }
  primaryGuestSummary.push(
    {
      title: 'Telephone',
      value: formatPhoneNumber(primaryGuest?.telephone, primaryGuest?.extension),
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

  if (application?.AdditionalGuests.items) {
    let AGs = application?.AdditionalGuests.items;
    AGs
      // .sort((a, b) => {
      //   return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      // })
      .forEach((g) => {
        let agInfo = [
          {
            title: 'Guest Name',
            value: humanName(g),
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
      value: mapEnumValue(application?.InitialStay.items[0].room_type_requests),
    },
  ];
  if (application?.InitialStay.items[0].room_type_requests == 'OTHER') {
    lodgingPreferencesSummary.push({
      title: 'Requested Room Description',
      value: application?.InitialStay.items[0].room_description,
    });
  }
  lodgingPreferencesSummary.push(
    {
      title: 'Preferred Room Features',
      value: application?.InitialStay.items[0].room_feature_requests
        ? application?.InitialStay.items[0].room_feature_requests
            .map((item) => mapEnumValue(item))
            .join(', ')
        : '',
    },
    {
      title: 'Special Requests',
      value: application?.InitialStay.items[0].special_requests,
    }
  );

  const fileName = tmp.tmpNameSync();

  const pdf = await ReactPDF.renderToFile(
    <Document>
      <Page style={styles.page}>
        <View style={styles.page}>
          <View>
            <Text style={styles.header}>Liaison Application Summary</Text>
          </View>
          <View style={styles.pdfFields}>
            <ApplicationSummary sectionTitle="Admin" listItems={adminSummary} />

            <ApplicationSummary sectionTitle="Liaison" listItems={liaisonSummary} />

            <ApplicationSummary sectionTitle="Referrer" listItems={referrerSummary} />

            <ApplicationSummary sectionTitle="Service Member" listItems={serviceMemberSummary} />

            <ApplicationSummary sectionTitle="Guests" listItems={primaryGuestSummary} />

            {additionalGuestSummaries.map((item, index) => (
              <ApplicationSummary key={index} listItems={item} />
            ))}

            <ApplicationSummary
              sectionTitle="Lodging Preferences"
              listItems={lodgingPreferencesSummary}
            />

            <StaySummary stay={application?.InitialStay.items[0]} />

            {application?.ExtendedStays.items.map((item) => (
              <StaySummary key={item.id} stay={item} />
            ))}
          </View>
        </View>
      </Page>
    </Document>,
    fileName
  );

  return fs.readFileSync(fileName, { encoding });
};

const generateItineraryPdf = async (application, stay, encoding) => {
  const reservationSummary = [
    {
      title: 'Guest(s)',
      value:
        application?.PrimaryGuest.items.map((item) => humanName(item)).join() +
        ',' +
        application?.AdditionalGuests.items.map((item) => humanName(item)).join(),
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
          : mapEnumValue(stay.room_type_actual),
    },
    {
      title: 'Total Nights',
      value:
        stay.requested_check_in && stay.requested_check_out
          ? calculateNumberOfNights(stay.requested_check_in, stay.requested_check_out)
          : 'Unknown',
    },
  ];

  const fileName = tmp.tmpNameSync();

  const pdf = await ReactPDF.renderToFile(
    <Document>
      <Page style={styles.page}>
        <View style={styles.headerSection}>
          <View style={styles.hotelLogo}>
            <Image
              src="https://resources.fisherhouse.org/assets/hfh_logo.jpg"
              alt="Hotels for Heros Logo"
            />
          </View>
        </View>
        <View style={styles.page}>
          <View style={styles.headerBreakLine}></View>
          <View style={styles.hotelInfoContainer}>
            <View style={styles.hotelInfos}>
              {app.hotelLogo && (
                <Image style={styles.footerLogo} src={app.hotelLogo} alt="Hotel Brand Logo" />
              )}
            </View>

            <View style={styles.hotelInfo}>
              <Text>{stay.HotelBooked.name}</Text>
              <Text>{stay.HotelBooked.address}</Text>
              <Text>{stay.HotelBooked.address_2}</Text>
              <Text>
                {stay.HotelBooked.city}, {stay.HotelBooked.state}, {stay.HotelBooked.zip}
              </Text>
              <Text>
                {stay.HotelBooked.telephone}
                {stay.HotelBooked.extension ? ' x' + stay.HotelBooked.extension : ''}
              </Text>
            </View>
          </View>
          <Text style={[styles.strong, { fontSize: '20pt', paddingBottom: '10pt' }]}>
            Confirmation Number:{' '}
            <Text style={styles.confirmationNumberNumber}>{stay.confirmation_number}</Text>
          </Text>
          <ApplicationSummary
            sectionTitle="Reservation Information"
            listItems={reservationSummary}
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerDescription}>
            Guests are responsible for incidentals and additional charges beyond the cost of the
            room.
            {'\n'}Hotels will require a credit card on file as standard policy upon check-in.
          </Text>
          <Text style={styles.hotelInfo}>Program of Fisher House Foundation</Text>
          <Image
            style={styles.footerLogos}
            src="https://resources.fisherhouse.org/assets/fhf_email.png"
            alt="Hotels for Heros Logo"
          />
        </View>
      </Page>
    </Document>,
    fileName
  );

  return fs.readFileSync(fileName, { encoding });
};

exports.generateAdminPdf = generateAdminPdf;
exports.generateLiaisonPdf = generateLiaisonPdf;
exports.generateItineraryPdf = generateItineraryPdf;
