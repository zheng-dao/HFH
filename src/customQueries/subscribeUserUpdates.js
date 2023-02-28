export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
      id
      username
      first_name
      last_name
      middle_initial
      telephone
      signature
      job
      admin_approval
      expiration_date
      extension
      affiliation
      timezone
      observes_dst
      receive_emails
      status
      AffiliationID
      Affiliation {
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
      affiliation_type
      createdAt
      updatedAt
      owner
    }
  }
`;
