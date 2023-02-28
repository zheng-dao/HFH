import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import humanName from '@utils/humanName';
import { mapEnumValue } from '@utils/mapEnumValue';
import ApplicationSummary from './ApplicationSummary';
import styles from './Stylesheet';
import { SERVICEMEMBERSTATUS, ROOMTYPE } from '@src/API';
import StaySummary from './StaySummary';
import formatPhoneNumber from '@utils/formatPhoneNumber';

const LiaisonPdf = (props) => {
  if (props.application?.InitialStay == null) {
    return null;
  }

  const adminSummary = [
    {
      title: 'Name',
      value: props.application?.AssignedTo ? humanName(props.application.AssignedTo) : '',
    },
    {
      title: 'Job Title',
      value: props.application?.AssignedTo?.job,
    },
    {
      title: 'Email',
      value: props.application?.AssignedTo?.username,
    },
    {
      title: 'Telephone',
      value: formatPhoneNumber(
        props.application?.AssignedTo?.telephone,
        props.application?.AssignedTo?.extension
      ),
    },
    {
      title: props.application?.AssignedTo?.Affiliation?.type
        ? mapEnumValue(props.application?.AssignedTo?.Affiliation?.type)
        : 'Affiliation',
      value: props.application?.AssignedTo?.Affiliation?.name,
    },
  ];

  const liaisonSummary = [
    {
      title: 'Name',
      value: props.application?.User ? humanName(props.application.User) : '',
    },
    {
      title: 'Job Title',
      value: props.application?.User?.job,
    },
    {
      title: 'Email',
      value: props.application?.User?.username,
    },
    {
      title: 'Telephone',
      value: formatPhoneNumber(
        props.application?.User?.telephone,
        props.application?.User?.extension
      ),
    },
    {
      title: props.application?.User?.Affiliation?.type
        ? mapEnumValue(props.application?.User?.Affiliation?.type)
        : 'Affiliation',
      value: props.application?.User?.Affiliation?.name,
    },
  ];

  let referrerSummary = [
    {
      title: 'Were case details collected by someone other than yourself?',
      value:
        props.applicant?.collected_outside_fisherhouse == null
          ? ''
          : props.applicant?.collected_outside_fisherhouse
            ? 'Yes'
            : 'No',
    },
  ];

  if (props.applicant?.collected_outside_fisherhouse) {
    referrerSummary.push({
      title: 'Referred by',
      value: props.applicant ? humanName(props.applicant) : 'Unknown',
    });
    referrerSummary.push({ title: 'Job Title', value: props.applicant?.job });
    referrerSummary.push({ title: 'Email', value: props.applicant?.email });
    referrerSummary.push({
      title: 'Telephone',
      value: formatPhoneNumber(props.applicant?.telephone, props.applicant?.extension),
    });
    referrerSummary.push({
      title: props.applicant?.affiliation_type
        ? mapEnumValue(props.applicant?.affiliation_type)
        : 'Affiliation',
      value: props.applicant?.Affiliation?.name,
    });
  }

  let serviceMemberSummary = [
    {
      title: 'Service Member',
      value: props.application?.ServiceMember
        ? humanName(props.application?.ServiceMember)
        : 'Unknown',
    },
  ];
  if (props.application?.ServiceMember?.email) {
    serviceMemberSummary.push({
      title: 'Email',
      value: props.application?.ServiceMember?.email,
    });
  }
  serviceMemberSummary.push(
    {
      title: 'Telephone',
      value: formatPhoneNumber(
        props.application?.ServiceMember?.telephone,
        props.application?.ServiceMember?.extension
      ),
    },
    {
      title: 'Branch of Service',
      value: mapEnumValue(props.application?.ServiceMember?.branch_of_service),
    },
    {
      title: 'Current Status',
      value: mapEnumValue(props.application?.ServiceMember?.current_status),
    },
    {
      title:
        props.application?.ServiceMember?.current_status == SERVICEMEMBERSTATUS.VETERAN
          ? 'VA Assigned'
          : 'Base Assigned',
      value: props.application?.ServiceMember?.BaseAssignedTo?.name,
    },
    {
      title:
        "Is the family on military travel orders (ITO's) or eligible for lodging reimbursement?",
      value:
        props.application?.ServiceMember?.on_military_travel_orders == null
          ? ''
          : props.application?.ServiceMember?.on_military_travel_orders
            ? 'Yes'
            : 'No',
    },
    {
      title: 'Is the patient someone other than the Service Member?',
      value:
        props.application?.ServiceMember?.other_patient == null
          ? ''
          : props.application?.ServiceMember?.other_patient
            ? 'Yes'
            : 'No',
    }
  );
  if (
    props.application?.ServiceMember?.other_patient == true ||
    props.application?.ServiceMember?.other_patient == 'true'
  ) {
    serviceMemberSummary.push(
      {
        title: 'Patient',
        value: props.application?.Patient ? humanName(props.application?.Patient) : '',
      },
      {
        title: 'Relationship to Service Member',
        value: props.application?.Patient?.relationship
          ? mapEnumValue(props.application?.Patient?.relationship)
          : '',
      }
    );
  }
  serviceMemberSummary.push({
    title: 'Treatment Facility',
    value: props.application?.ServiceMember?.TreatmentFacility?.name,
  });

  const primaryGuest = props.application?.PrimaryGuest?.items[0] || {};

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

  if (props.application?.AdditionalGuests.items) {
    let AGs = props.application?.AdditionalGuests.items;
    [...AGs]
      .sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      })
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
      value: mapEnumValue(props.application?.InitialStay.items[0].room_type_requests),
    },
  ];
  if (props.application?.InitialStay.items[0].room_type_requests == ROOMTYPE.OTHER) {
    lodgingPreferencesSummary.push({
      title: 'Requested Room Description',
      value: props.application?.InitialStay.items[0].room_description,
    });
  }
  if (
    props.application?.InitialStay.items[0].room_feature_requests &&
    Array.isArray(props.application?.InitialStay.items[0].room_feature_requests) &&
    props.application?.InitialStay.items[0].room_feature_requests.length > 0
  ) {
    lodgingPreferencesSummary.push({
      title: 'Preferred Room Features',
      value: props.application?.InitialStay.items[0].room_feature_requests
        ? props.application?.InitialStay.items[0].room_feature_requests
          .map((item) => mapEnumValue(item))
          .join(', ')
        : '',
    });
  }
  if (props.application?.InitialStay.items[0].special_requests) {
    lodgingPreferencesSummary.push({
      title: 'Special Requests',
      value: props.application?.InitialStay.items[0].special_requests,
    });
  }

  let sortedExtendedItems = [...props.application?.ExtendedStays.items].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
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

            <View break>
              <ApplicationSummary sectionTitle="Guests" listItems={primaryGuestSummary} />
            </View>

            {additionalGuestSummaries.map((item, index) => (
              <ApplicationSummary key={index} listItems={item} />
            ))}

            <ApplicationSummary
              sectionTitle="Lodging Preferences"
              listItems={lodgingPreferencesSummary}
            />

            <View break>
              <StaySummary
                stay={props.application?.InitialStay.items[0]}
                maskStayStatus
                isAdministrator={false}
              />
            </View>

            {sortedExtendedItems.map((item) => (
              <View break key={item.id}>
                <StaySummary key={item.id} stay={item} maskStayStatus isAdministrator={false} />
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default LiaisonPdf;
