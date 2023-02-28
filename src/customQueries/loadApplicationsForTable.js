export const listApplicationsForTable = /* GraphQL */ `
  query SearchApplications(
    $filter: SearchableApplicationFilterInput
    $sort: [SearchableApplicationSortInput]
    $limit: Int
  ) {
    searchApplications(filter: $filter, sort: $sort, limit: $limit) {
      items {
        id
        status
        liaison_read
        admin_read
        createdAt
        updatedAt
        ServiceMember {
          first_name
          last_name
        }
        Applicant {
          first_name
          last_name
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
      nextToken
      total
    }
  }
`;
