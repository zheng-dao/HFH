export const searchHotelBrands = /* GraphQL */ `
  query SearchHotelBrands(
    $filter: SearchableHotelBrandFilterInput
    $sort: [SearchableHotelBrandSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableHotelBrandAggregationInput]
  ) {
    searchHotelBrands(
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
        logo
        createdAt
        updatedAt
        hotelBrandHotelChainId
        HotelChain {
          id
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
