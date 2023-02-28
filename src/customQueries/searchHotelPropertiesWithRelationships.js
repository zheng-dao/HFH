export const searchHotelProperties = /* GraphQL */ `
  query SearchHotelProperties(
    $filter: SearchableHotelPropertyFilterInput
    $sort: [SearchableHotelPropertySortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableHotelPropertyAggregationInput]
  ) {
    searchHotelProperties(
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
        address
        address_2
        city
        state
        zip
        contact_name
        contact_position
        telephone
        email
        is_blacklist
        status
        extension
        FisherHouseID
        HotelChainID
        HotelBrandID
        HotelChain {
          id
          name
        }
        HotelBrand {
          id
          name
        }
        createdAt
        updatedAt
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
