export const onCreateAffiliation = /* GraphQL */ `
  subscription OnCreateAffiliation {
    onCreateAffiliation {
      id
      name
      type
      status
      display_name
      address
      address_2
      city
      state
      zip
      branch
      AssociatedAffiliation {
        id
        name
        type
        status
        display_name
        address
        address_2
        city
        state
        zip
        branch
        createdAt
        updatedAt
        affiliationAssociatedAffiliationId
        owner
      }
      createdAt
      updatedAt
      affiliationAssociatedAffiliationId
      owner
    }
  }
`;
export const onUpdateAffiliation = /* GraphQL */ `
  subscription OnUpdateAffiliation {
    onUpdateAffiliation {
      id
      name
      type
      status
      display_name
      address
      address_2
      city
      state
      zip
      branch
      AssociatedAffiliation {
        id
        name
        type
        status
        display_name
        address
        address_2
        city
        state
        zip
        branch
        createdAt
        updatedAt
        affiliationAssociatedAffiliationId
        owner
      }
      createdAt
      updatedAt
      affiliationAssociatedAffiliationId
      owner
    }
  }
`;
export const onDeleteAffiliation = /* GraphQL */ `
  subscription OnDeleteAffiliation {
    onDeleteAffiliation {
      id
      name
      type
      status
      display_name
      address
      address_2
      city
      state
      zip
      branch
      AssociatedAffiliation {
        id
        name
        type
        status
        display_name
        address
        address_2
        city
        state
        zip
        branch
        createdAt
        updatedAt
        affiliationAssociatedAffiliationId
        owner
      }
      createdAt
      updatedAt
      affiliationAssociatedAffiliationId
      owner
    }
  }
`;
