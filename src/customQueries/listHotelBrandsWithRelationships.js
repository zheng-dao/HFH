export const listHotelBrandsWithRelationships = /* GraphQL */ `
  query ListHotelBrands($filter: ModelHotelBrandFilterInput, $limit: Int, $nextToken: String) {
    listHotelBrands(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
    }
  }
`;
