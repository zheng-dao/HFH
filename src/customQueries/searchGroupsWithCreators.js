export const searchGroups = /* GraphQL */ `
  query SearchGroups(
    $filter: SearchableGroupFilterInput
    $sort: [SearchableGroupSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableGroupAggregationInput]
  ) {
    searchGroups(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        name
        status
        createdAt
        updatedAt
        groupCreatorId
        creator {
          id
          first_name
          middle_initial
          last_name
        }
      }
      nextToken
      total
    }
  }
`;
