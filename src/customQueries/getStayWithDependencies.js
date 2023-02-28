export const getStay = /* GraphQL */ `
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
