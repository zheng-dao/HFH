export const searchStays = /* GraphQL */ `
  query SearchStays(
    $filter: SearchableStayFilterInput
    $sort: [SearchableStaySortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableStayAggregationInput]
  ) {
    searchStays(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        applicationID
        type
        state
        reservation_number
        payment_type
        PaymentTypeID
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
        notified_about_checkout
        createdAt
        updatedAt
        stayFisherHouseId
        HotelBooked {
          name
        }
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
