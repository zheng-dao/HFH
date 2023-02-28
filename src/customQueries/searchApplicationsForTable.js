export const searchApplicationSearchRecords = /* GraphQL */ `
  query SearchApplicationSearchRecords(
    $filter: SearchableApplicationSearchRecordFilterInput
    $sort: [SearchableApplicationSearchRecordSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableApplicationSearchRecordAggregationInput]
  ) {
    searchApplicationSearchRecords(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        Application {
          id
          StaysInApplication(filter: { type: { eq: INITIAL } }) {
            items {
              id
              actual_check_in
              actual_check_out
              requested_check_in
              requested_check_out
              HotelBooked {
                name
              }
            }
          }
          ServiceMember {
            first_name
            middle_initial
            last_name
          }
          User {
            first_name
            middle_initial
            last_name
            AffiliationID
          }
          AssignedTo {
            first_name
            middle_initial
            last_name
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
