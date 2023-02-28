/* Amplify Params - DO NOT EDIT
	API_HOTELSFORHEROES_GRAPHQLAPIENDPOINTOUTPUT
	API_HOTELSFORHEROES_GRAPHQLAPIIDOUTPUT
	API_HOTELSFORHEROES_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const https = require('https');
const urlParse = require('url').URL;
const appsyncUrl = process.env.API_HOTELSFORHEROES_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;

const getApplication = /* GraphQL */ gql`
  query GetApplication($id: ID!) {
    getApplication(id: $id) {
      id
      status
      StaysInApplication {
        items {
          id
          requested_check_in
          requested_check_out
          status
          confirmation_number
          HotelPropertyID
          type
          HotelBooked {
            name
            HotelBrand {
              id
              name
            }
            HotelChain {
              id
              name
            }
          }
        }
        nextToken
      }
      User {
        id
        username
        first_name
        last_name
        middle_initial
        AffiliationID
        affiliation_type
        Affiliation {
          name
        }
      }
      AssignedTo {
        id
        username
        first_name
        last_name
        middle_initial
        affiliation
        AffiliationID
        affiliation_type
        Affiliation {
          name
        }
      }
      ServiceMember {
        id
        first_name
        middle_initial
        last_name
        email
        branch_of_service
        current_status
        serviceMemberBaseAssignedToId
        serviceMemberTreatmentFacilityId
        TreatmentFacility {
          name
        }
        BaseAssignedTo {
          name
        }
      }
      Guests {
        items {
          id
          first_name
          middle_initial
          last_name
          email
        }
        nextToken
      }
      Applicant {
        id
        first_name
        last_name
        email
        base_assigned_to
        middle_initial
        affiliation_type
        applicantAffiliationId
        Affiliation {
          name
        }
      }
      Group {
        id
        name
      }
      Notes {
        items {
          id
          action
          noteUserId
          timestamp
        }
        nextToken
      }
      createdAt
      updatedAt
      admin_read
      liaison_read
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

const getASRByApplicationId = /* GraphQL */ gql`
  query GetASR($applicationID: ID!) {
    getApplicationSearchRecordsByApplicationID(applicationID: $applicationID) {
      items {
        id
      }
      nextToken
    }
  }
`;

const getSSRByApplicationId = /* GraphQL */ gql`
  query GetSSR($applicationID: ID!) {
    getStaySearchRecordsByApplicationID(applicationID: $applicationID) {
      items {
        id
      }
      nextToken
    }
  }
`;

const getSSRByStayId = /* GraphQL */ gql`
  query GetSSR($stayID: ID!) {
    getStaySearchRecordsByStayID(stayID: $stayID) {
      items {
        id
      }
      nextToken
    }
  }
`;

const createApplicationSearchRecord = /* GraphQL */ gql`
  mutation CreateApplicationSearchRecord($input: CreateApplicationSearchRecordInput!) {
    createApplicationSearchRecord(input: $input) {
      id
    }
  }
`;

const createStaySearchRecord = /* GraphQL */ gql`
  mutation CreateStaySearchRecord($input: CreateStaySearchRecordInput!) {
    createStaySearchRecord(input: $input) {
      id
    }
  }
`;

const updateApplicationSearchRecord = /* GraphQL */ gql`
  mutation UpdateApplicationSearchRecord($input: UpdateApplicationSearchRecordInput!) {
    updateApplicationSearchRecord(input: $input) {
      id
    }
  }
`;

const updateStaySearchRecord = /* GraphQL */ gql`
  mutation UpdateStaySearchRecord($input: UpdateStaySearchRecordInput!) {
    updateStaySearchRecord(input: $input) {
      id
    }
  }
`;

const deleteApplicationSearchRecord = /* GraphQL */ gql`
  mutation DeleteApplicationSearchRecord($input: DeleteApplicationSearchRecordInput!) {
    deleteApplicationSearchRecord(input: $input) {
      id
    }
  }
`;

const deleteStaySearchRecord = /* GraphQL */ gql`
  mutation DeleteStaySearchRecord($input: DeleteStaySearchRecordInput!) {
    deleteStaySearchRecord(input: $input) {
      id
    }
  }
`;

const humanName = (person) => {
  const name = person?.first_name + ' ' + (person?.middle_initial ?? '') + ' ' + person?.last_name;
  return name.replace(/\s+/g, ' ').trim();
};

const makeRequest = async (query, operationName, variables) => {
  const req = new AWS.HttpRequest(appsyncUrl, region);

  req.method = 'POST';
  req.path = '/graphql';
  req.headers.host = endpoint;
  req.headers['Content-Type'] = 'application/json';
  req.body = JSON.stringify({
    query,
    operationName,
    variables,
  });

  const signer = new AWS.Signers.V4(req, 'appsync', true);
  signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

  return await new Promise((resolve, reject) => {
    const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
      let data = '';

      result.on('data', (chunk) => {
        data += chunk;
      });

      result.on('end', () => {
        resolve(JSON.parse(data.toString()));
      });
    });

    httpRequest.write(req.body);
    httpRequest.end();
  });
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  for (const record of event.Records) {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);
    let applicationID = '';
    const newRecord = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
    if (newRecord['__typename'] == 'Application') {
      applicationID = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.Keys).id;
    } else if (newRecord['__typename'] == 'Stay') {
      applicationID = newRecord.applicationID;
    } else if (newRecord['__typename'] == 'Note') {
      applicationID = newRecord.noteApplicationId;
    } else if (newRecord['__typename'] == 'Guest') {
      applicationID = newRecord.applicationID;
    } else if (newRecord['__typename'] == 'ServiceMember') {
      applicationID = newRecord?.serviceMemberApplicationId;
    } else if (newRecord['__typename'] == 'Affiliation') {
    } else if (newRecord['__typename'] == 'User') {
    } else if (newRecord['__typename'] == 'Group') {
    } else if (newRecord['__typename'] == 'Patient') {
      applicationID = newRecord?.patientApplicationId;
    }
    console.log('Application ID is', applicationID);
    if (applicationID && applicationID.length > 0) {
      const applicationResult = await makeRequest(print(getApplication), 'GetApplication', {
        id: applicationID,
      });
      console.log('Application result is', applicationResult);
      if (applicationResult.data.getApplication) {
        const application = applicationResult.data.getApplication;
        // Now we need to look up if an Application Search Record exists.
        const asrLookupResult = await makeRequest(print(getASRByApplicationId), 'GetASR', {
          applicationID,
        });
        console.log('Application is', application);
        console.log('Available stays are', application.StaysInApplication.items);
        const stay = application.StaysInApplication.items.find((item) => item.type == 'INITIAL');

        if (asrLookupResult.data.getApplicationSearchRecordsByApplicationID.items.length > 0) {
          if (record.eventName == 'REMOVE' && applicationID.length > 0) {
            // We need to delete our mirror record.
            const ASRDeleteResult = await makeRequest(
              print(deleteApplicationSearchRecord),
              'DeleteApplicationSearchRecord',
              { id: asrLookupResult.data.getApplicationSearchRecordsByApplicationID.items[0].id }
            );
          } else {
            console.log(
              'Updating record',
              asrLookupResult.data.getApplicationSearchRecordsByApplicationID.items[0].id
            );
            // Update operation
            const updatedASR = {
              id: asrLookupResult.data.getApplicationSearchRecordsByApplicationID.items[0].id,
              applicationID,
              applicationStatus: application.status,
              staysStatus: application.StaysInApplication.items.map((item) => item.status),
              checkInDates: application.StaysInApplication.items.map(
                (item) => item.requested_check_in
              ),
              checkOutDates: application.StaysInApplication.items.map(
                (item) => item.requested_check_out
              ),
              noteActions: JSON.stringify(
                application.Notes.items.map((item) => {
                  return { user: item.noteUserId, action: item.action, timestamp: item.timestamp };
                })
              ),
              assignedAdminID: application.AssignedTo?.id || '',
              assignedAdminName: application.AssignedTo ? humanName(application.AssignedTo) : '',
              assignedLiaisonID: application.User?.id || '',
              assignedLiaisonName: application.User ? humanName(application.User) : '',
              groupID: application.Group?.id || '',
              groupName: application.Group?.name || '',
              confirmationNumber: application.StaysInApplication.items.map(
                (item) => item.confirmation_number
              ),
              referrerName: humanName(application.Applicant),
              referrerEmail: application.Applicant?.email,
              serviceMemberFirstName: application.ServiceMember
                ? application.ServiceMember.first_name
                : '',
              serviceMemberLastName: application.ServiceMember
                ? application.ServiceMember.last_name
                : '',
              serviceMemberEmail: application.ServiceMember?.email,
              guestFirstNames: application.Guests.items.map((item) => item.first_name),
              guestLastNames: application.Guests.items.map((item) => item.last_name),
              guestEmails: application.Guests.items.map((item) => item.email),
              liaisonAffiliationID: application.User?.AffiliationID,
              liaisonAffiliationName: application.User?.Affiliation?.name,
              referrerAffiliationID: application.Applicant?.AffiliationID || '',
              referrerAffiliationName: application.Applicant?.Affiliation?.name || '',
              treatmentCenterID: application.ServiceMember?.serviceMemberTreatmentFacilityId,
              treatmentCenterName: application.ServiceMember?.TreatmentFacility?.name || '',
              baseAssignedID: application.ServiceMember?.serviceMemberBaseAssignedToId,
              baseAssignedName: application.ServiceMember?.BaseAssignedTo?.name || '',
              vaAssignedID: application.ServiceMember?.serviceMemberBaseAssignedToId,
              vaAssignedName: application.ServiceMember?.BaseAssignedTo?.name || '',
              hotelChainID: application.StaysInApplication.items.map(
                (item) => item.HotelBooked?.HotelChain?.id || ''
              ),
              hotelChainName: application.StaysInApplication.items.map(
                (item) => item.HotelBooked?.HotelChain?.name || ''
              ),
              hotelBrandID: application.StaysInApplication.items.map(
                (item) => item.HotelBooked?.HotelBrand?.id || ''
              ),
              hotelBrandName: application.StaysInApplication.items.map(
                (item) => item.HotelBooked?.HotelBrand?.name || ''
              ),
              primaryCheckInDate: stay?.actual_check_in
                ? stay?.actual_check_in
                : stay?.requested_check_in,
              primaryCheckOutDate: stay?.actual_check_out
                ? stay?.actual_check_out
                : stay?.requested_check_out,
              serviceMemberBranchOfService: application.ServiceMember?.branch_of_service,
              serviceMemberDutyStatus: application.ServiceMember?.current_status,
              adminIsUnread: application.admin_read == 'UNREAD',
              liaisonIsUnread: application.liaison_read == 'UNREAD',
              adminAffiliationID: application.AssignedTo?.AffiliationID,
              adminAffiliationName: application.AssignedTo?.Affiliation?.name,
              hotelPropertyName: stay?.HotelBooked?.name,
              assignedAffiliationID: application.AffiliationID,
              primaryCheckinDateStamp: parseInt(
                new Date(
                  stay?.actual_check_in ? stay?.actual_check_in : stay?.requested_check_in
                ).getTime() / 1000
              ),
              primaryCheckoutDateStamp: parseInt(
                new Date(
                  stay?.actual_check_out ? stay.actual_check_out : stay?.requested_check_out
                ).getTime() / 1000
              ),
            };
            console.log('Stay is', stay);
            console.log('Date is 1 ', new Date(stay?.requested_check_in).getTime());
            console.log('Update request is', updatedASR);
            const ASRUpdateResult = await makeRequest(
              print(updateApplicationSearchRecord),
              'UpdateApplicationSearchRecord',
              { input: updatedASR }
            );
            console.log('Result from stay is', ASRUpdateResult);
          }
        } else {
          // Create operation
          const newASR = {
            applicationID,
            applicationStatus: application.status,
            staysStatus: application.StaysInApplication.items.map((item) => item.status),
            checkInDates: application.StaysInApplication.items.map(
              (item) => item.requested_check_in
            ),
            checkOutDates: application.StaysInApplication.items.map(
              (item) => item.requested_check_out
            ),
            noteActions: JSON.stringify(
              application.Notes.items.map((item) => {
                return { user: item.noteUserId, action: item.action, timestamp: item.timestamp };
              })
            ),
            assignedAdminID: application.AssignedTo?.id || '',
            assignedAdminName: application.AssignedTo ? humanName(application.AssignedTo) : '',
            assignedLiaisonID: application.User?.id || '',
            assignedLiaisonName: application.User ? humanName(application.User) : '',
            groupID: application.Group?.id || '',
            groupName: application.Group?.name || '',
            confirmationNumber: application.StaysInApplication.items.map(
              (item) => item.confirmation_number
            ),
            referrerName: humanName(application.Applicant),
            referrerEmail: application.Applicant?.email,
            serviceMemberFirstName: application.ServiceMember
              ? application.ServiceMember.first_name
              : '',
            serviceMemberLastName: application.ServiceMember
              ? application.ServiceMember.last_name
              : '',
            serviceMemberEmail: application.ServiceMember?.email,
            guestFirstNames: application.Guests.items.map((item) => item.first_name),
            guestLastNames: application.Guests.items.map((item) => item.last_name),            
            guestEmails: application.Guests.items.map((item) => item.email),
            liaisonAffiliationID: application.User?.AffiliationID,
            liaisonAffiliationName: application.User?.Affiliation?.name,
            referrerAffiliationID: application.Applicant?.AffiliationID || '',
            referrerAffiliationName: application.Applicant?.Affiliation?.name || '',
            treatmentCenterID: application.ServiceMember?.serviceMemberTreatmentFacilityId,
            treatmentCenterName: application.ServiceMember?.TreatmentFacility?.name || '',
            baseAssignedID: application.ServiceMember?.serviceMemberBaseAssignedToId,
            baseAssignedName: application.ServiceMember?.BaseAssignedTo?.name || '',
            vaAssignedID: application.ServiceMember?.serviceMemberBaseAssignedToId,
            vaAssignedName: application.ServiceMember?.BaseAssignedTo?.name || '',
            hotelChainID: application.StaysInApplication.items.map(
              (item) => item.HotelBooked?.HotelChain?.id || ''
            ),
            hotelChainName: application.StaysInApplication.items.map(
              (item) => item.HotelBooked?.HotelChain?.name || ''
            ),
            hotelBrandID: application.StaysInApplication.items.map(
              (item) => item.HotelBooked?.HotelBrand?.id || ''
            ),
            hotelBrandName: application.StaysInApplication.items.map(
              (item) => item.HotelBooked?.HotelBrand?.name || ''
            ),
            primaryCheckInDate: stay?.actual_check_in
              ? stay?.actual_check_in
              : stay?.requested_check_in,
            primaryCheckOutDate: stay?.actual_check_out
              ? stay?.actual_check_out
              : stay?.requested_check_out,
            serviceMemberBranchOfService: application.ServiceMember?.branch_of_service,
            serviceMemberDutyStatus: application.ServiceMember?.current_status,
            adminIsUnread: application.admin_read == 'UNREAD',
            liaisonIsUnread: application.liaison_read == 'UNREAD',
            adminAffiliationID: application.AssignedTo?.AffiliationID,
            adminAffiliationName: application.AssignedTo?.Affiliation?.name,
            hotelPropertyName: stay?.HotelBooked?.name,
            assignedAffiliationID: application.AffiliationID,
            primaryCheckinDateStamp: parseInt(
              new Date(
                stay?.actual_check_in ? stay?.actual_check_in : stay?.requested_check_in
              ).getTime() / 1000
            ),
            primaryCheckoutDateStamp: parseInt(
              new Date(
                stay?.actual_check_out ? stay.actual_check_out : stay?.requested_check_out
              ).getTime() / 1000
            ),
          };
          console.log('Date is 2 ', new Date(stay?.requested_check_in).getTime());
          const ASRCreationResult = await makeRequest(
            print(createApplicationSearchRecord),
            'CreateApplicationSearchRecord',
            { input: newASR }
          );
        }

        // Stays
        let ssrResult = null;
        let updateSSR = null;
        let createSSR = null;

        for (const stayInApp of application.StaysInApplication.items) {
          ssrResult = await makeRequest(print(getSSRByStayId), 'GetSSR', { stayID: stayInApp.id });

          if (ssrResult.data.getStaySearchRecordsByStayID.items.length > 0) {
            if (
              record.eventName == 'REMOVE' &&
              ssrResult.data.getStaySearchRecordsByStayID.items.length > 0
            ) {
              await makeRequest(print(deleteStaySearchRecord), 'DeleteStaySearchRecord', {
                id: ssrResult.data.getStaySearchRecordsByStayID.items[0].id,
              });
            } else {
              updateSSR = {
                id: ssrResult.data.getStaySearchRecordsByStayID.items[0].id,
                applicationID,
                stayID: stayInApp.id,
                applicationStatus: application.status,
                staysStatus: stayInApp.status,
                checkInDates: stayInApp.requested_check_in,
                checkOutDates: stayInApp.requested_check_out,
                noteActions: JSON.stringify(
                  application.Notes.items.map((item) => {
                    return {
                      user: item.noteUserId,
                      action: item.action,
                      timestamp: item.timestamp,
                    };
                  })
                ),
                assignedAdminID: application.AssignedTo?.id || '',
                assignedAdminName: application.AssignedTo ? humanName(application.AssignedTo) : '',
                assignedLiaisonID: application.User?.id || '',
                assignedLiaisonName: application.User ? humanName(application.User) : '',
                groupID: application.Group?.id || '',
                groupName: application.Group?.name || '',
                confirmationNumber: stayInApp.confirmation_number,
                referrerName: humanName(application.Applicant),
                referrerEmail: application.Applicant?.email,
                serviceMemberFirstName: application.ServiceMember
                  ? application.ServiceMember.first_name
                  : '',
                serviceMemberLastName: application.ServiceMember
                  ? application.ServiceMember.last_name
                  : '',
                serviceMemberEmail: application.ServiceMember?.email,
                guestFirstNames: application.Guests.items.map((item) => item.first_name),
                guestLastNames: application.Guests.items.map((item) => item.last_name),
                guestEmails: application.Guests.items.map((item) => item.email),
                liaisonAffiliationID: application.User?.AffiliationID,
                liaisonAffiliationName: application.User?.Affiliation?.name,
                referrerAffiliationID: application.Applicant?.AffiliationID || '',
                referrerAffiliationName: application.Applicant?.Affiliation?.name || '',
                treatmentCenterID: application.ServiceMember?.serviceMemberTreatmentFacilityId,
                treatmentCenterName: application.ServiceMember?.TreatmentFacility?.name || '',
                baseAssignedID: application.ServiceMember?.serviceMemberBaseAssignedToId,
                baseAssignedName: application.ServiceMember?.BaseAssignedTo?.name || '',
                vaAssignedID: application.ServiceMember?.serviceMemberBaseAssignedToId,
                vaAssignedName: application.ServiceMember?.BaseAssignedTo?.name || '',
                hotelChainID: [stayInApp.HotelBooked?.HotelChain?.id || ''],
                hotelChainName: [stayInApp.HotelBooked?.HotelChain?.name || ''],
                hotelBrandID: [stayInApp.HotelBooked?.HotelBrand?.id || ''],
                hotelBrandName: [stayInApp.HotelBooked?.HotelBrand?.name || ''],
                primaryCheckInDate: stayInApp?.actual_check_in
                  ? stayInApp?.actual_check_in
                  : stayInApp?.requested_check_in,
                primaryCheckOutDate: stayInApp?.actual_check_out
                  ? stayInApp?.actual_check_out
                  : stayInApp?.requested_check_out,
                serviceMemberBranchOfService: application.ServiceMember?.branch_of_service,
                serviceMemberDutyStatus: application.ServiceMember?.current_status,
                adminIsUnread: application.admin_read == 'UNREAD',
                liaisonIsUnread: application.liaison_read == 'UNREAD',
                adminAffiliationID: application.AssignedTo?.AffiliationID,
                adminAffiliationName: application.AssignedTo?.Affiliation?.name,
                hotelPropertyName: stay?.HotelBooked?.name,
                assignedAffiliationID: application.AffiliationID,
                primaryCheckinDateStamp: parseInt(
                  new Date(
                    stayInApp?.actual_check_in
                      ? stayInApp?.actual_check_in
                      : stayInApp?.requested_check_in
                  ).getTime() / 1000
                ),
                primaryCheckoutDateStamp: parseInt(
                  new Date(
                    stayInApp?.actual_check_out
                      ? stayInApp.actual_check_out
                      : stayInApp?.requested_check_out
                  ).getTime() / 1000
                ),
              };

              const updateStaySearchRecordResult = await makeRequest(
                print(updateStaySearchRecord),
                'UpdateStaySearchRecord',
                {
                  input: updateSSR,
                }
              );
              console.log('Result from update stay search record is', updateStaySearchRecordResult);
            }
          } else {
            createSSR = {
              applicationID,
              stayID: stayInApp.id,
              applicationStatus: application.status,
              staysStatus: stayInApp.status,
              checkInDates: stayInApp.requested_check_in,
              checkOutDates: stayInApp.requested_check_out,
              noteActions: JSON.stringify(
                application.Notes.items.map((item) => {
                  return { user: item.noteUserId, action: item.action, timestamp: item.timestamp };
                })
              ),
              assignedAdminID: application.AssignedTo?.id || '',
              assignedAdminName: application.AssignedTo ? humanName(application.AssignedTo) : '',
              assignedLiaisonID: application.User?.id || '',
              assignedLiaisonName: application.User ? humanName(application.User) : '',
              groupID: application.Group?.id || '',
              groupName: application.Group?.name || '',
              confirmationNumber: stayInApp.confirmation_number,
              referrerName: humanName(application.Applicant),
              referrerEmail: application.Applicant?.email,
              serviceMemberFirstName: application.ServiceMember
                ? application.ServiceMember.first_name
                : '',
              serviceMemberLastName: application.ServiceMember
                ? application.ServiceMember.last_name
                : '',
              serviceMemberEmail: application.ServiceMember?.email,
              guestFirstNames: application.Guests.items.map((item) => item.first_name),
              guestLastNames: application.Guests.items.map((item) => item.last_name),
              guestEmails: application.Guests.items.map((item) => item.email),
              liaisonAffiliationID: application.User?.AffiliationID,
              liaisonAffiliationName: application.User?.Affiliation?.name,
              referrerAffiliationID: application.Applicant?.AffiliationID || '',
              referrerAffiliationName: application.Applicant?.Affiliation?.name || '',
              treatmentCenterID: application.ServiceMember?.serviceMemberTreatmentFacilityId,
              treatmentCenterName: application.ServiceMember?.TreatmentFacility?.name || '',
              baseAssignedID: application.ServiceMember?.serviceMemberBaseAssignedToId,
              baseAssignedName: application.ServiceMember?.BaseAssignedTo?.name || '',
              vaAssignedID: application.ServiceMember?.serviceMemberBaseAssignedToId,
              vaAssignedName: application.ServiceMember?.BaseAssignedTo?.name || '',
              hotelChainID: [stayInApp.HotelBooked?.HotelChain?.id || ''],
              hotelChainName: [stayInApp.HotelBooked?.HotelChain?.name || ''],
              hotelBrandID: [stayInApp.HotelBooked?.HotelBrand?.id || ''],
              hotelBrandName: [stayInApp.HotelBooked?.HotelBrand?.name || ''],
              primaryCheckInDate: stayInApp?.actual_check_in
                ? stayInApp?.actual_check_in
                : stayInApp?.requested_check_in,
              primaryCheckOutDate: stayInApp?.actual_check_out
                ? stayInApp?.actual_check_out
                : stayInApp?.requested_check_out,
              serviceMemberBranchOfService: application.ServiceMember?.branch_of_service,
              serviceMemberDutyStatus: application.ServiceMember?.current_status,
              adminIsUnread: application.admin_read == 'UNREAD',
              liaisonIsUnread: application.liaison_read == 'UNREAD',
              adminAffiliationID: application.AssignedTo?.AffiliationID,
              adminAffiliationName: application.AssignedTo?.Affiliation?.name,
              hotelPropertyName: stay?.HotelBooked?.name,
              assignedAffiliationID: application.AffiliationID,
              primaryCheckinDateStamp: parseInt(
                new Date(
                  stayInApp?.actual_check_in
                    ? stayInApp?.actual_check_in
                    : stayInApp?.requested_check_in
                ).getTime() / 1000
              ),
              primaryCheckoutDateStamp: parseInt(
                new Date(
                  stayInApp?.actual_check_out
                    ? stayInApp.actual_check_out
                    : stayInApp?.requested_check_out
                ).getTime() / 1000
              ),
            };

            const createStaySearchResult = await makeRequest(
              print(createStaySearchRecord),
              'CreateStaySearchRecord',
              {
                input: createSSR,
              }
            );
            console.log('Output from create stay search result', createStaySearchResult);
          }
        }
      }
    }
  }

  return 'Successfully processed DynamoDB record';
};
