export const searchStaySearchRecords = /* GraphQL */ `
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
