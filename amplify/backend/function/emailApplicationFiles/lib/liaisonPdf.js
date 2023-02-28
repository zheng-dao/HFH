import React from 'react';
import ReactPDF, { Text, Document, Page, View } from '@react-pdf/renderer';
import styles from './Stylesheet';
import ApplicationSummary from './ApplicationSummary';
import humanName from './humanName';
import mapEnumValue from './mapEnumValue';
import tmp from 'tmp';
import fs from 'node:fs';
import StaySummary from './staySummary';
import formatPhoneNumber from './formatPhoneNumber';

const handler = async (app) => {
  const adminSummary = [
    {
      title: 'Name',
      value: app.application?.AssignedTo ? humanName(app.application.AssignedTo) : '',
    },
    {
      title: 'Job Title',
      value: app.application?.AssignedTo?.job,
    },
    {
      title: 'Email',
      value: app.application?.AssignedTo?.username,
    },
    {
      title: 'Telephone',
      value: formatPhoneNumber(
        app.application?.AssignedTo?.telephone,
        app.application?.AssignedTo?.extension
      ),
    },
    {
      title: app.application?.AssignedTo?.Affiliation?.type
        ? mapEnumValue(app.application?.AssignedTo?.Affiliation?.type)
        : 'Affiliation',
      value: app.application?.AssignedTo?.Affiliation?.name,
    },
  ];

  const liaisonSummary = [
    {
      title: 'Name',
      value: app.application?.User ? humanName(app.application.User) : '',
    },
    {
      title: 'Job Title',
      value: app.application?.User?.job,
    },
    {
      title: 'Email',
      value: app.application?.User?.username,
    },
    {
      title: 'Telephone',
      value: formatPhoneNumber(app.application?.User?.telephone, app.application?.User?.extension),
    },
    {
      title: app.application?.User?.Affiliation?.type
        ? mapEnumValue(app.application?.User?.Affiliation?.type)
        : 'Affiliation',
      value: app.application?.User?.Affiliation?.name,
    },
  ];

  let referrerSummary = [
    {
      title: 'Were case details collected by someone other than yourself?',
      value:
        app.applicant?.collected_outside_fisherhouse == null
          ? ''
          : app.applicant?.collected_outside_fisherhouse
          ? 'Yes'
          : 'No',
    },
  ];

  if (app.applicant?.collected_outside_fisherhouse) {
    referrerSummary.push({
      title: 'Referred by',
      value: app.applicant ? humanName(app.applicant) : 'Unknown',
    });
    referrerSummary.push({ title: 'Job Title', value: app.applicant?.job });
    referrerSummary.push({ title: 'Email', value: app.applicant?.email });
    referrerSummary.push({
      title: 'Telephone',
      value: formatPhoneNumber(app.applicant?.telephone, app.applicant?.extension),
    });
    referrerSummary.push({
      title: app.applicant?.Affiliation?.type
        ? mapEnumValue(app.applicant?.Affiliation?.type)
        : 'Affiliation',
      value: app.applicant?.Affiliation?.name,
    });
  }

  let serviceMemberSummary = [
    {
      title: 'Service Member',
      value: app.application?.ServiceMember ? humanName(app.application?.ServiceMember) : 'Unknown',
    },
  ];
  if (app.application?.ServiceMember?.email) {
    serviceMemberSummary.push({
      title: 'Email',
      value: app.application?.ServiceMember?.email,
    });
  }
  serviceMemberSummary.push(
    {
      title: 'Telephone',
      value: formatPhoneNumber(
        app.application?.ServiceMember?.telephone,
        app.application?.ServiceMember?.extension
      ),
    },
    {
      title: 'Branch of Service',
      value: mapEnumValue(app.application?.ServiceMember?.branch_of_service),
    },
    {
      title: 'Current Status',
      value: mapEnumValue(app.application?.ServiceMember?.current_status),
    },
    {
      title:
        app.application?.ServiceMember?.current_status == 'VETERAN'
          ? 'VA Assigned'
          : 'Base Assigned',
      value: app.application?.ServiceMember?.BaseAssignedTo?.name,
    },
    {
      title:
        "Is the family on military travel orders (ITO's) or eligible for lodging reimbursement?",
      value:
        app.application?.ServiceMember?.on_military_travel_orders == null
          ? ''
          : app.application?.ServiceMember?.on_military_travel_orders
          ? 'Yes'
          : 'No',
    },
    {
      title: 'Is the patient someone other than the Service Member?',
      value:
        app.application?.ServiceMember?.other_patient == null
          ? ''
          : app.application?.ServiceMember?.other_patient
          ? 'Yes'
          : 'No',
    }
  );
  if (
    app.application?.ServiceMember?.other_patient == true ||
    app.application?.ServiceMember?.other_patient == 'true'
  ) {
    serviceMemberSummary.push(
      {
        title: 'Patient',
        value: app.application?.Patient ? humanName(app.application?.Patient) : '',
      },
      {
        title: 'Relationship to Service Member',
        value: app.application?.Patient?.relationship
          ? mapEnumValue(app.application?.Patient?.relationship)
          : '',
      }
    );
  }
  serviceMemberSummary.push({
    title: 'Treatment Facility',
    value: app.application?.ServiceMember?.TreatmentFacility?.name,
  });

  const primaryGuest = app.application?.PrimaryGuest?.items[0] || {};

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

  if (app.application?.AdditionalGuests.items) {
    let AGs = app.application?.AdditionalGuests.items;
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
      value: mapEnumValue(app.application?.InitialStay.items[0].room_type_requests),
    },
  ];
  if (app.application?.InitialStay.items[0].room_type_requests == 'OTHER') {
    lodgingPreferencesSummary.push({
      title: 'Requested Room Description',
      value: app.application?.InitialStay.items[0].room_description,
    });
  }
  lodgingPreferencesSummary.push(
    {
      title: 'Preferred Room Features',
      value: app.application?.InitialStay.items[0].room_feature_requests
        ? app.application?.InitialStay.items[0].room_feature_requests
            .map((item) => mapEnumValue(item))
            .join(', ')
        : '',
    },
    {
      title: 'Special Requests',
      value: app.application?.InitialStay.items[0].special_requests,
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

            <StaySummary stay={app.application?.InitialStay.items[0]} />

            {app.application?.ExtendedStays.items.map((item) => (
              <StaySummary key={item.id} stay={item} />
            ))}
          </View>
        </View>
      </Page>
    </Document>,
    fileName
  );

  return fs.readFileSync(fileName, { encoding: 'base64' });
};

export default handler;
