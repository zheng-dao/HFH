export const listApplicationsForTable = /* GraphQL */ `
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
          status
          liaison_read
          admin_read
          createdAt
          updatedAt
          ServiceMember {
            first_name
            middle_initial
            last_name
          }
          Applicant {
            first_name
            last_name
          }
          AssignedTo {
            first_name
            middle_initial
            last_name
            AffiliationID
          }
          User {
            first_name
            middle_initial
            last_name
            AffiliationID
          }
          StaysInApplication(limit: 1, filter: { type: { eq: INITIAL } }) {
            items {
              requested_check_in
              requested_check_out
              HotelBooked {
                name
              }
            }
          }
        }
      }
      nextToken
      total
    }
  }
`;
