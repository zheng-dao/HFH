const getApplication = /* GraphQL */ `
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
        }
        nextToken
      }
      User {
        id
        username
        first_name
        last_name
        middle_initial
        affiliation
        AffiliationID
        affiliation_type
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
      }
      ServiceMember {
        id
        first_name
        middle_initial
        last_name
        email
        serviceMemberBaseAssignedToId
        serviceMemberTreatmentFacilityId
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
      }
      Group {
        id
        name
      }
      Notes {
        items {
          id
          User {
            id
            first_name
            last_name
          }
          action
        }
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
    }
  }
`;
