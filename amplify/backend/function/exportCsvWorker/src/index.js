/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["MAILCHIMP_API_KEY"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/* Amplify Params - DO NOT EDIT
	API_HOTELSFORHEROES_GRAPHQLAPIENDPOINTOUTPUT
	API_HOTELSFORHEROES_GRAPHQLAPIIDOUTPUT
	API_HOTELSFORHEROES_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const aws = require('aws-sdk');

const { makeRequest } = require('/opt/nodejs/makeRequest.js');
const gql = require('graphql-tag');
const { print } = require('graphql');
const Papa = require('papaparse');
const mailchimp = require('@mailchimp/mailchimp_transactional');

const getConfigurationSettingByName = /* GraphQL */ gql`
  query GetConfigurationSettingByName(
    $name: String!
    $sortDirection: ModelSortDirection
    $filter: ModelConfigurationSettingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getConfigurationSettingByName(
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        value
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

const searchStaySearchRecords = /* GraphQL */ gql`
  query SearchStaySearchRecords(
    $filter: SearchableStaySearchRecordFilterInput
    $sort: [SearchableStaySearchRecordSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableStaySearchRecordAggregationInput]
  ) {
    searchStaySearchRecords(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        Stay {
          id
          actual_check_in
          actual_check_out
          requested_check_in
          requested_check_out
          type
          status
          HotelBooked {
            name
          }
        }
        Application {
          id
          ServiceMember {
            first_name
            middle_initial
            last_name
          }
          User {
            first_name
            middle_initial
            last_name
          }
          AssignedTo {
            first_name
            middle_initial
            last_name
            AffiliationID
          }
          status
        }
        primaryCheckInDate
        primaryCheckOutDate
      }
      nextToken
      total
    }
  }
`;

const getStay = /* GraphQL */ gql`
  query GetStay($id: ID!) {
    getStay(id: $id) {
      id
      status
      requested_check_in
      requested_check_out
      narrative
      special_requests
      reservation_number
      confirmation_number
      actual_check_in
      actual_check_out
      # Nights of lodging
      reason_guest_did_not_stay
      room_type_actual
      room_description
      payment_type
      comparable_cost
      payment_cost_of_reservation
      certificate_number
      payment_points_used
      card
      # Card name
      charge_reconcile
      hotel_reconcile
      createdAt
      updatedAt
      payment_method {
        id
        name
      }
      HotelBooked {
        id
        name
        HotelChain {
          id
          name
        }
        HotelBrand {
          id
          name
        }
        city
        state
        contact_name
        telephone
        extension
        email
      }
      Application {
        id
        status
        exception_narrative
        createdAt
        updatedAt
        AssignedTo {
          id
          first_name
          middle_initial
          last_name
        }
        User {
          id
          first_name
          middle_initial
          last_name
          Affiliation {
            id
            name
          }
        }
        Applicant {
          id
          first_name
          middle_initial
          last_name
          email
          telephone
          extension
          job
          collected_outside_fisherhouse
          Affiliation {
            id
            name
          }
        }
        ServiceMember {
          id
          first_name
          middle_initial
          last_name
          email
          telephone
          extension
          branch_of_service
          current_status
          on_military_travel_orders
          other_patient
          BaseAssignedTo {
            id
            name
          }
          TreatmentFacility {
            id
            name
          }
        }
        Patient {
          id
          first_name
          middle_initial
          last_name
          relationship
        }
        Guests {
          items {
            id
            first_name
            middle_initial
            last_name
            relationship
            email
            telephone
            extension
          }
        }
      }
    }
  }
`;

const getApplication = /* GraphQL */ gql`
  query GetApplication($id: ID!) {
    getApplication(id: $id) {
      id
      InitialStay: StaysInApplication(filter: { type: { eq: INITIAL } }) {
        items {
          id
          applicationID
          type
          state
          reservation_number
          payment_type
          PaymentTypeID
          payment_method {
            id
            name
            type
            status
          }
          payment_points_used
          payment_cost_of_reservation
          checkout_points_used
          checkout_cost_of_reservation
          requested_check_in
          requested_check_out
          status
          actual_check_in
          actual_check_out
          guest_stayed_at_hotel
          reason_guest_did_not_stay
          payment_incidental_cost
          charge_type
          card
          note
          reconciled
          ready_for_final_reconcile
          comment
          comparable_cost
          certificate_number
          confirmation_number
          card_used_for_incidentals
          room_type_requests
          room_feature_requests
          room_type_actual
          room_feature_actual
          room_description
          room_description_actual
          reason_decline
          reason_return
          charge_reconcile
          hotel_reconcile
          points_reconcile
          giftcard_reconcile
          batch_no
          city
          HotelPropertyID
          narrative
          special_requests
          createdAt
          updatedAt
          stayFisherHouseId
          hotel_files {
            key
            user
          }
          HotelBooked {
            id
            name
            address
            address_2
            city
            state
            zip
            telephone
            contact_name
            contact_position
            extension
            email
            HotelChain {
              name
            }
            HotelBrand {
              name
              logo
              # address
              # address_2
              # city
              # state
              # zip
              # extension
              # telephone
            }
          }
        }
        nextToken
      }
      ExtendedStays: StaysInApplication(filter: { type: { eq: EXTENDED } }) {
        items {
          id
          applicationID
          type
          state
          reservation_number
          payment_type
          PaymentTypeID
          payment_method {
            id
            name
            type
            status
          }
          payment_points_used
          payment_cost_of_reservation
          checkout_points_used
          checkout_cost_of_reservation
          requested_check_in
          requested_check_out
          status
          actual_check_in
          actual_check_out
          guest_stayed_at_hotel
          reason_guest_did_not_stay
          payment_incidental_cost
          charge_type
          card
          note
          reconciled
          ready_for_final_reconcile
          comment
          comparable_cost
          certificate_number
          confirmation_number
          card_used_for_incidentals
          room_type_requests
          room_feature_requests
          room_type_actual
          room_feature_actual
          room_description
          room_description_actual
          reason_decline
          reason_return
          charge_reconcile
          hotel_reconcile
          points_reconcile
          giftcard_reconcile
          batch_no
          city
          HotelPropertyID
          narrative
          special_requests
          createdAt
          updatedAt
          stayFisherHouseId
          hotel_files {
            key
            user
          }
          HotelBooked {
            id
            name
            address
            address_2
            city
            state
            zip
            telephone
            extension
            contact_name
            contact_position
            HotelChain {
              name
            }
            HotelBrand {
              name
            }
          }
        }
        nextToken
      }
      status
      User {
        id
        username
        first_name
        last_name
        middle_initial
        telephone
        signature
        job
        admin_approval
        expiration_date
        extension
        affiliation
        timezone
        observes_dst
        receive_emails
        status
        AffiliationID
        affiliation_type
        createdAt
        updatedAt
        owner
        Affiliation {
          name
          type
        }
      }
      AssignedTo {
        id
        username
        first_name
        last_name
        middle_initial
        telephone
        signature
        job
        admin_approval
        expiration_date
        extension
        affiliation
        timezone
        observes_dst
        receive_emails
        status
        AffiliationID
        affiliation_type
        createdAt
        updatedAt
        owner
        Affiliation {
          name
          type
        }
      }
      liaison_read
      admin_read
      Patient {
        id
        first_name
        middle_initial
        last_name
        relationship
        createdAt
        updatedAt
      }
      ServiceMember {
        id
        first_name
        middle_initial
        last_name
        email
        telephone
        extension
        branch_of_service
        current_status
        on_military_travel_orders
        other_patient
        lodging_explanation
        unidentified_explanation
        createdAt
        updatedAt
        TreatmentFacility {
          id
          name
          address
          address_2
          status
          city
          state
          zip
        }
        BaseAssignedTo {
          id
          name
          status
        }
        serviceMemberBaseAssignedToId
        serviceMemberTreatmentFacilityId
      }
      exception_narrative
      PrimaryGuest: Guests(filter: { type: { eq: PRIMARY } }) {
        items {
          id
          first_name
          relationship
          middle_initial
          last_name
          email
          telephone
          extension
          applicationID
          type
          under_age_three
          address
          address_2
          city
          state
          zip
          createdAt
          updatedAt
        }
        nextToken
      }
      AdditionalGuests: Guests(filter: { type: { eq: ADDITIONAL } }) {
        items {
          id
          first_name
          relationship
          middle_initial
          last_name
          email
          telephone
          extension
          applicationID
          type
          under_age_three
          address
          address_2
          city
          state
          zip
          createdAt
          updatedAt
        }
        nextToken
      }
      liaison_terms_of_use_agreement
      sm_terms_of_use_agreement
      Applicant {
        id
        first_name
        last_name
        email
        telephone
        signature
        job
        branch_of_service
        current_status
        base_assigned_to
        relation_to_service_member
        referrer_date
        user_type
        middle_initial
        patient_type
        extension
        family_lodge
        location_name
        location_address
        lodging_explanation
        affiliation_type
        collected_outside_fisherhouse
        createdAt
        updatedAt
        applicantAffiliationId
        Affiliation {
          id
          name
          status
          city
          state
          type
        }
      }
      Group {
        id
        name
        status
        createdAt
        updatedAt
      }
      Notes {
        nextToken
      }
      createdAt
      updatedAt
      applicationUserId
      applicationAssignedToId
      applicationPatientId
      applicationServiceMemberId
      applicationApplicantId
      applicationGroupId
      AffiliationID
    }
  }
`;

const getAllApplications = async (filter, nextToken) => {
  const results = await makeRequest(print(searchStaySearchRecords), 'SearchStaySearchRecords', {
    filter,
    nextToken,
  });

  let finalResults = [];
  if (
    results?.data?.searchStaySearchRecords?.nextToken &&
    results?.data?.searchStaySearchRecords?.nextToken.length > 0
  ) {
    const moreResults = await getAllApplications(
      filter,
      results.data.searchStaySearchRecords.nextToken
    );
    finalResults = results.data.searchStaySearchRecords.items.concat(moreResults);
  } else {
    finalResults = results.data.searchStaySearchRecords.items;
  }
  return finalResults;
};

function humanName(person, withWrapperTags = false) {
  const first_name = person?.first_name || '';
  const last_name = person?.last_name || '';
  const name = first_name + ' ' + (person?.middle_initial ?? '') + ' ' + last_name;
  return name.replace(/\s+/g, ' ').trim();
}

const makeTimezoneAwareDate = (input) => {
  const dt = new Date(input);
  return new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
};

const calculateNumberOfNights = (start, end) => {
  const timezoneAwareStart = makeTimezoneAwareDate(start);
  const timezoneAwareEnd = makeTimezoneAwareDate(end);

  const timeDiff = Math.abs(timezoneAwareEnd.getTime() - timezoneAwareStart.getTime());

  const numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return numberOfNights;
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const { Parameter } = await new aws.SSM()
    .getParameter({
      Name: process.env['MAILCHIMP_API_KEY'],
      WithDecryption: true,
    })
    .promise();

  const fromEmailAddress = await makeRequest(
    print(getConfigurationSettingByName),
    'GetConfigurationSettingByName',
    { name: 'system_email_address' }
  );

  const fromEmailAddressToUse = fromEmailAddress.data.getConfigurationSettingByName
    ? fromEmailAddress.data.getConfigurationSettingByName.items[0].value
    : 'donotreply@fisherhouse.org';

  const replyToEmailAddress = await makeRequest(
    print(getConfigurationSettingByName),
    'GetConfigurationSettingByName',
    { name: 'system_replyto_address' }
  );

  const replayToEmailAddressToUse = replyToEmailAddress.data.getConfigurationSettingByName
    ? replyToEmailAddress.data.getConfigurationSettingByName.items[0].value
    : 'donotreply@fisherhouse.org';

  let output = [];

  let row = {};

  const titleCase = (str) => {
    return str;
  };

  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    const allApplications = await getAllApplications(body.filter, null);
    console.log('Processing total applications', allApplications.length);
    for (const applicationToProcess of allApplications) {
      if (!applicationToProcess?.Stay?.id || !applicationToProcess?.Application?.id) {
        continue;
      }
      const res = await makeRequest(print(getStay), 'GetStay', {
        id: applicationToProcess.Stay.id,
      });
      const app = await makeRequest(print(getApplication), 'GetApplication', {
        id: applicationToProcess.Application.id,
      });

      row = {};

      body.fields.forEach((field) => {
        switch (field.key) {
          case 'stay|id':
            row[field.label] = res.data.getStay.id;
            break;

          case 'stay|status':
            row[field.label] = titleCase(res.data.getStay.status);
            break;

          case 'stay|requested_check_in':
            row[field.label] = res.data.getStay.requested_check_in;
            break;

          case 'stay|requested_check_out':
            row[field.label] = res.data.getStay.requested_check_out;
            break;

          case 'stay|narrative':
            row[field.label] = res.data.getStay.narrative;
            break;

          case 'stay|special_requests':
            row[field.label] = res.data.getStay.special_requests;
            break;

          case 'stay|reservation_number':
            row[field.label] = res.data.getStay.confirmation_number;
            break;

          case 'stay|actual_check_in':
            row[field.label] = res.data.getStay.actual_check_in;
            break;

          case 'stay|actual_check_out':
            row[field.label] = res.data.getStay.actual_check_out;
            break;

          case 'stay|nights_of_lodging':
            if (res.data.getStay.actual_check_in && res.data.getStay.actual_check_out) {
              row[field.label] = calculateNumberOfNights(
                res.data.getStay.actual_check_in,
                res.data.getStay.actual_check_out
              );
            } else {
              row[field.label] = '';
            }
            break;

          case 'stay|change_reason':
            row[field.label] = res.data.getStay.reason_guest_did_not_stay;
            break;

          case 'stay|room_type':
            row[field.label] = titleCase(res.data.getStay.room_type_actual);
            break;

          case 'stay|room_description':
            row[field.label] = res.data.getStay.room_description;
            break;

          case 'stay|payment_type':
            row[field.label] = res.data.getStay.payment_type;
            break;

          case 'stay|comparable_cost':
            row[field.label] = res.data.getStay.comparable_cost;
            break;

          case 'stay|total_charge':
            row[field.label] = res.data.getStay.payment_cost_of_reservation;
            break;

          case 'stay|certificate_number':
            row[field.label] = res.data.getStay.certificate_number;
            break;

          case 'stay|points_used':
            row[field.label] = res.data.getStay.payment_points_used;
            break;

          case 'stay|card_name':
            row[field.label] = res.data.getStay.card;
            break;

          case 'stay|charge_reconcile':
            row[field.label] = res.data.getStay.charge_reconcile ? 'Reconciled' : '';
            break;

          case 'stay|hotel_reconcile':
            row[field.label] = res.data.getStay.hotel_reconcile ? 'Reconciled' : '';
            break;

          case 'stay|custom_payment_reconcile':
            row[field.label] = res.data.getStay.payment_type ? 'Reconciled' : '';
            break;

          case 'stay|points_reconcile':
            row[field.label] = res.data.getStay.payment_points_used ? 'Reconciled' : '';
            break;

          case 'stay|created_at':
            let stayCreated = new Date(res.data.getStay.createdAt);
            row[field.label] = `${stayCreated.getFullYear()}-${
              stayCreated.getMonth() + 1
            }-${stayCreated.getDate()} ${stayCreated.getHours()}:${
              stayCreated.getMinutes() > 9
                ? stayCreated.getMinutes()
                : '0' + stayCreated.getMinutes()
            }:${stayCreated.getSeconds()} UTC`;
            break;

          case 'stay|updated_at':
            let stayUpdated = new Date(res.data.getStay.createdAt);
            row[field.label] = `${stayUpdated.getFullYear()}-${
              stayUpdated.getMonth() + 1
            }-${stayUpdated.getDate()} ${stayUpdated.getHours()}:${
              stayUpdated.getMinutes() > 9
                ? stayUpdated.getMinutes()
                : '0' + stayUpdated.getMinutes()
            }:${stayUpdated.getSeconds()} UTC`;
            break;

          case 'stay|hotel_chain':
            row[field.label] = res.data.getStay.HotelBooked?.HotelChain?.name;
            break;

          case 'stay|hotel_brand':
            row[field.label] = res.data.getStay.HotelBooked?.HotelBrand?.name;
            break;

          case 'stay|hotel_property':
            row[field.label] = res.data.getStay.HotelBooked?.name;
            break;

          case 'stay|hotel_city':
            row[field.label] = res.data.getStay.HotelBooked?.city;
            break;

          case 'stay|hotel_state':
            row[field.label] = res.data.getStay.HotelBooked?.state;
            break;

          case 'stay|hotel_contact_name':
            row[field.label] = res.data.getStay.HotelBooked?.contact_name;
            break;

          case 'stay|hotel_contact_email':
            row[field.label] = res.data.getStay.HotelBooked?.email;
            break;

          case 'stay|hotel_contact_telephone':
            row[field.label] = res.data.getStay.HotelBooked?.telephone;
            break;

          case 'stay|hotel_contact_extension':
            row[field.label] = res.data.getStay.HotelBooked?.extension;
            break;

          case 'stay|card_name':
            row[field.label] = res.data.getStay.card;
            break;

          case 'application|id':
            row[field.label] = app.data.getApplication.id;
            break;

          case 'application|status':
            row[field.label] = app.data.getApplication.status;
            break;

          case 'application|liaison_name':
            row[field.label] = app.data.getApplication.User
              ? humanName(app.data.getApplication.User)
              : '';
            break;

          case 'application|liaison_affiliation':
            row[field.label] = app.data.getApplication.User?.Affiliation?.name;
            break;

          case 'application|base_va_name':
            row[field.label] = app.data.getApplication.ServiceMember?.BaseAssignedTo?.name;
            break;

          case 'application|number_of_guests':
            row[field.label] =
              app.data.getApplication.AdditionalGuests?.items ||
              app.data.getApplication.PrimaryGuest.items
                ? app.data.getApplication.AdditionalGuests.items.length +
                  app.data.getApplication.PrimaryGuest.items.length
                : 0;
            break;

          case 'application|guest_details':
            row[field.label] = app.data.getApplication.PrimaryGuest?.items
              .map((item) => humanName(item) + ' (' + item.relationship + ')')
              .concat(
                app.data.getApplication.AdditionalGuests.items
                  .sort((a, b) => {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                  })
                  .map((item) => humanName(item) + ' (' + item.relationship + ')')
              )
              .join(' | ');
            break;

          case 'application|guest_names':
            row[field.label] = app.data.getApplication.PrimaryGuest?.items
              .map((item) => humanName(item))
              .concat(app.data.getApplication.AdditionalGuests.items.map((item) => humanName(item)))
              .join();
            break;

          case 'application|guest_relationships':
            row[field.label] = app.data.getApplication.PrimaryGuest?.items
              .map((item) => item.relationship)
              .concat(
                app.data.getApplication.AdditionalGuests.items.map((item) => item.relationship)
              )
              .join();
            break;

          case 'application|guest_email':
            row[field.label] = app.data.getApplication.PrimaryGuest?.items
              .map((item) => item.email)
              // .concat(app.data.getApplication.AdditionalGuests.items.map((item) => item.email))
              .join();
            break;

          case 'application|guest_telephone':
            row[field.label] = app.data.getApplication.PrimaryGuest?.items
              .map((item) => item.telephone)
              // .concat(app.data.getApplication.AdditionalGuests.items.map((item) => item.telephone))
              .join();
            break;

          case 'application|guest_extension':
            row[field.label] = app.data.getApplication.PrimaryGuest?.items
              .map((item) => item.extension)
              // .concat(app.data.getApplication.AdditionalGuests.items.map((item) => item.extension))
              .join();
            break;

          case 'application|exception_narrative':
            row[field.label] = app.data.getApplication.exception_narrative;
            break;

          case 'application|created_at':
            let applicationCreated = new Date(app.data.getApplication.createdAt);
            row[field.label] = `${applicationCreated.getFullYear()}-${
              applicationCreated.getMonth() + 1
            }-${applicationCreated.getDate()} ${applicationCreated.getHours()}:${applicationCreated.getMinutes()}:${applicationCreated.getSeconds()} UTC`;
            break;

          case 'application|updated_at':
            let applicationUpdated = new Date(app.data.getApplication.updatedAt);
            row[field.label] = `${applicationUpdated.getFullYear()}-${
              applicationUpdated.getMonth() + 1
            }-${applicationUpdated.getDate()} ${applicationUpdated.getHours()}:${applicationUpdated.getMinutes()}:${applicationUpdated.getSeconds()} UTC`;
            break;

          case 'application|referrer_name':
            row[field.label] = app.data.getApplication.Applicant
              ? humanName(app.data.getApplication.Applicant)
              : '';
            break;

          case 'application|referrer_email':
            row[field.label] = app.data.getApplication?.Applicant?.email;
            break;

          case 'application|referrer_telephone':
            row[field.label] = app.data.getApplication?.Applicant?.telephone;
            break;

          case 'application|referrer_extension':
            row[field.label] = app.data.getApplication?.Applicant?.extension;
            break;

          case 'application|referrer_title':
            row[field.label] = app.data.getApplication?.Applicant?.job;
            break;

          case 'application|referrer_affiliation':
            row[field.label] = app.data.getApplication?.Applicant?.Affiliation?.name;
            break;

          case 'application|sm_name':
            row[field.label] = app.data.getApplication?.ServiceMember
              ? humanName(app.data.getApplication.ServiceMember)
              : '';
            break;

          case 'application|sm_email':
            row[field.label] = app.data.getApplication?.ServiceMember?.email;
            break;

          case 'application|sm_telephone':
            row[field.label] = app.data.getApplication?.ServiceMember?.telephone;
            break;

          case 'application|sm_extension':
            row[field.label] = app.data.getApplication?.ServiceMember?.extension;
            break;

          case 'application|sm_branch_of_service':
            row[field.label] = titleCase(
              app.data.getApplication?.ServiceMember?.branch_of_service
                ? app.data.getApplication?.ServiceMember?.branch_of_service
                : ''
            );
            break;

          case 'application|sm_status':
            row[field.label] = titleCase(
              app.data.getApplication?.ServiceMember?.current_status
                ? app.data.getApplication?.ServiceMember?.current_status
                : ''
            );
            break;

          case 'application|sm_on_travel_orders':
            row[field.label] = app.data.getApplication?.ServiceMember?.on_military_travel_orders
              ? 'Yes'
              : 'No';
            break;

          case 'application|sm_other_patient':
            row[field.label] = app.data.getApplication?.ServiceMember?.other_patient ? 'Yes' : 'No';
            break;

          case 'application|patient_name':
            row[field.label] = app.data.getApplication?.Patient
              ? humanName(app.data.getApplication.Patient)
              : '';
            break;

          case 'application|patient_relationship':
            row[field.label] = titleCase(app.data.getApplication?.Patient?.relationship);
            break;

          case 'application|sm_treatment_facility':
            row[field.label] = app.data.getApplication?.ServiceMember?.TreatmentFacility?.name;
            break;

          case 'application|narrative_and_exceptions':
            let ne = res.data.getStay.narrative;

            if (app.data.getApplication?.ServiceMember?.lodging_explanation) {
              ne = ne + ' | ' + app.data.getApplication?.ServiceMember?.lodging_explanation;
            }
            if (app.data.getApplication?.ServiceMember?.unidentified_explanation) {
              ne = ne + ' | ' + app.data.getApplication?.ServiceMember?.unidentified_explanation;
            }
            if (app.data.getApplication?.exception_narrative) {
              ne = ne + ' | ' + app.data.getApplication?.exception_narrative;
            }
            row[field.label] = ne;
            break;

          case 'application|assigned_to':
            row[field.label] = app.data.getApplication?.AssignedTo
              ? humanName(app.data.getApplication?.AssignedTo)
              : 'Unassigned';
            break;

          case 'application|referral':
            row[field.label] =
              app.data.getApplication?.Applicant?.collected_outside_fisherhouse === true
                ? 'Yes'
                : app.data.getApplication?.Applicant?.collected_outside_fisherhouse === false
                ? 'No'
                : '';
            break;

          case 'application|sm_military_order_explanation':
            row[field.label] = app.data.getApplication?.ServiceMember?.lodging_explanation;
            break;

          default:
            break;
        }
      });
      output.push(row);
    }

    console.log('Completed output of length', output.length);
    const csv = Papa.unparse(output);

    const messageTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
  
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Hotels for Heroes Export</title>
        </head>
        
        <body style="text-align: center;">
        
        <table cellpadding="0" cellspacing="0" border="0" align="center" style="text-align: left; margin: 0 auto; max-width: 480px; font-size: 14pt;font-family: sans-serif; color: #333;">
        <tr>
            <td>
            <p style="text-align: left; margin: 4em 1em 1em 1em;">Dear ${body.name},</p>
            <p style="text-align: left; margin: 0 1em 3em 1em;">
              Attached is the file you requested. The search that you used when creating this export was:
              <a href="${body.searchUrl}">${body.searchUrl}</a>
            </p>
            <p style="text-align: left; margin: 0 1em 3em 1em;">
            Thank you.<br/>
            The System
            </p>
            </td>
        </tr>
        <tr>
            <td style="text-align: center;">
              <div style="background-color: #fff; padding 5px; border-radius: 5px;">
                <img style="width: 80%; height: auto; margin: 5px;" src="https://resources.fisherhouse.org/v1.0.0/images/hfh_email.gif" />
              </div>
            </td>
        </tr>
        </table>
        
        </body>
        
        </html>
        `;

    let attachments = [];

    attachments.push({
      type: 'text/csv',
      name:
        'CSV Export ' +
        new Date().getMonth() +
        '-' +
        new Date().getDay() +
        '-' +
        new Date().getFullYear() +
        '.csv',
      content: Buffer.from(csv).toString('base64'),
    });

    const message = {
      html: messageTemplate,
      subject: 'Requested Export File',
      from_email: fromEmailAddressToUse,
      from_name: 'Hotels for Heroes',
      attachments,
      headers: {
        'Reply-To': replayToEmailAddressToUse,
      },
      to: [
        {
          email: body.email,
        },
      ],
    };
    const mailchimpClient = mailchimp(Parameter.Value);
    const res = await mailchimpClient.messages.send({ message });
  }

  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
    body: JSON.stringify('Hello from Lambda!'),
  };
};
