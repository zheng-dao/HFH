export const listHotelPropertiesWithRelationships = /* GraphQL */ `
  query ListHotelProperties(
    $filter: ModelHotelPropertyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHotelProperties(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
    }
  }
`;
