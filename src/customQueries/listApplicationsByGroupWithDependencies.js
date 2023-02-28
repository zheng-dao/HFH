export const applicationByGroupId = /* GraphQL */ `
  query ApplicationByGroupId(
    $applicationGroupId: ID!
    $status: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ApplicationByGroupId(
      applicationGroupId: $applicationGroupId
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
              name
              address
              city
              state
              zip
              telephone
              contact_name
              extension
              email
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
              name
              address
              city
              state
              zip
              telephone
            }
          }
          nextToken
        }
        status
        AffiliationID
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
            status
            city
            state
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
      }
      nextToken
    }
  }
`;
