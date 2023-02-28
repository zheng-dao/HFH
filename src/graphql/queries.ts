/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGroup = /* GraphQL */ `
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
      id
      name
      status
      creator {
        id
        username
        pending_email
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
        affiliation_type
        owner
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      groupCreatorId
    }
  }
`;
export const listGroups = /* GraphQL */ `
  query ListGroups(
    $filter: ModelGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        status
        createdAt
        updatedAt
        groupCreatorId
      }
      nextToken
    }
  }
`;
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
export const getAffiliation = /* GraphQL */ `
  query GetAffiliation($id: ID!) {
    getAffiliation(id: $id) {
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
export const listAffiliations = /* GraphQL */ `
  query ListAffiliations(
    $filter: ModelAffiliationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAffiliations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const searchAffiliations = /* GraphQL */ `
  query SearchAffiliations(
    $filter: SearchableAffiliationFilterInput
    $sort: [SearchableAffiliationSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableAffiliationAggregationInput]
  ) {
    searchAffiliations(
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
export const getNote = /* GraphQL */ `
  query GetNote($id: ID!) {
    getNote(id: $id) {
      id
      message
      timestamp
      remote_address
      noteApplicationId
      Application {
        id
        status
        liaison_read
        admin_read
        applicationPatientId
        applicationServiceMemberId
        exception_narrative
        liaison_terms_of_use_agreement
        sm_terms_of_use_agreement
        applicationGroupId
        AffiliationID
        createdAt
        updatedAt
        applicationUserId
        applicationAssignedToId
        applicationApplicantId
      }
      User {
        id
        username
        pending_email
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
        affiliation_type
        owner
        createdAt
        updatedAt
      }
      action
      createdAt
      updatedAt
      noteUserId
    }
  }
`;
export const listNotes = /* GraphQL */ `
  query ListNotes(
    $filter: ModelNoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        message
        timestamp
        remote_address
        noteApplicationId
        action
        createdAt
        updatedAt
        noteUserId
      }
      nextToken
    }
  }
`;
export const listNotesByApplicationAndTimestamp = /* GraphQL */ `
  query ListNotesByApplicationAndTimestamp(
    $noteApplicationId: ID!
    $timestamp: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelNoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotesByApplicationAndTimestamp(
      noteApplicationId: $noteApplicationId
      timestamp: $timestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        message
        timestamp
        remote_address
        noteApplicationId
        action
        createdAt
        updatedAt
        noteUserId
      }
      nextToken
    }
  }
`;
export const searchNotes = /* GraphQL */ `
  query SearchNotes(
    $filter: SearchableNoteFilterInput
    $sort: [SearchableNoteSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableNoteAggregationInput]
  ) {
    searchNotes(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        message
        timestamp
        remote_address
        noteApplicationId
        action
        createdAt
        updatedAt
        noteUserId
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
export const getServiceMember = /* GraphQL */ `
  query GetServiceMember($id: ID!) {
    getServiceMember(id: $id) {
      id
      first_name
      middle_initial
      last_name
      email
      telephone
      extension
      branch_of_service
      current_status
      on_military_travel_orders
      other_patient
      lodging_explanation
      unidentified_explanation
      BaseAssignedTo {
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
      TreatmentFacility {
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
      Application {
        id
        status
        liaison_read
        admin_read
        applicationPatientId
        applicationServiceMemberId
        exception_narrative
        liaison_terms_of_use_agreement
        sm_terms_of_use_agreement
        applicationGroupId
        AffiliationID
        createdAt
        updatedAt
        applicationUserId
        applicationAssignedToId
        applicationApplicantId
      }
      createdAt
      updatedAt
      serviceMemberBaseAssignedToId
      serviceMemberTreatmentFacilityId
      serviceMemberApplicationId
    }
  }
`;
export const listServiceMembers = /* GraphQL */ `
  query ListServiceMembers(
    $filter: ModelServiceMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listServiceMembers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        first_name
        middle_initial
        last_name
        email
        telephone
        extension
        branch_of_service
        current_status
        on_military_travel_orders
        other_patient
        lodging_explanation
        unidentified_explanation
        createdAt
        updatedAt
        serviceMemberBaseAssignedToId
        serviceMemberTreatmentFacilityId
        serviceMemberApplicationId
      }
      nextToken
    }
  }
`;
export const searchServiceMembers = /* GraphQL */ `
  query SearchServiceMembers(
    $filter: SearchableServiceMemberFilterInput
    $sort: [SearchableServiceMemberSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableServiceMemberAggregationInput]
  ) {
    searchServiceMembers(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        first_name
        middle_initial
        last_name
        email
        telephone
        extension
        branch_of_service
        current_status
        on_military_travel_orders
        other_patient
        lodging_explanation
        unidentified_explanation
        createdAt
        updatedAt
        serviceMemberBaseAssignedToId
        serviceMemberTreatmentFacilityId
        serviceMemberApplicationId
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
export const getPatient = /* GraphQL */ `
  query GetPatient($id: ID!) {
    getPatient(id: $id) {
      id
      first_name
      middle_initial
      last_name
      relationship
      Application {
        id
        status
        liaison_read
        admin_read
        applicationPatientId
        applicationServiceMemberId
        exception_narrative
        liaison_terms_of_use_agreement
        sm_terms_of_use_agreement
        applicationGroupId
        AffiliationID
        createdAt
        updatedAt
        applicationUserId
        applicationAssignedToId
        applicationApplicantId
      }
      createdAt
      updatedAt
      patientApplicationId
    }
  }
`;
export const listPatients = /* GraphQL */ `
  query ListPatients(
    $filter: ModelPatientFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPatients(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        first_name
        middle_initial
        last_name
        relationship
        createdAt
        updatedAt
        patientApplicationId
      }
      nextToken
    }
  }
`;
export const searchPatients = /* GraphQL */ `
  query SearchPatients(
    $filter: SearchablePatientFilterInput
    $sort: [SearchablePatientSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchablePatientAggregationInput]
  ) {
    searchPatients(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        first_name
        middle_initial
        last_name
        relationship
        createdAt
        updatedAt
        patientApplicationId
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
export const getConfigurationSetting = /* GraphQL */ `
  query GetConfigurationSetting($id: ID!) {
    getConfigurationSetting(id: $id) {
      id
      name
      value
      createdAt
      updatedAt
    }
  }
`;
export const listConfigurationSettings = /* GraphQL */ `
  query ListConfigurationSettings(
    $filter: ModelConfigurationSettingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listConfigurationSettings(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        value
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getConfigurationSettingByName = /* GraphQL */ `
  query GetConfigurationSettingByName(
    $name: String!
    $sortDirection: ModelSortDirection
    $filter: ModelConfigurationSettingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getConfigurationSettingByName(
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        value
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getHotelProperty = /* GraphQL */ `
  query GetHotelProperty($id: ID!) {
    getHotelProperty(id: $id) {
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
      FisherHouse {
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
      HotelChain {
        id
        name
        status
        createdAt
        updatedAt
      }
      HotelBrand {
        id
        name
        status
        logo
        createdAt
        updatedAt
        hotelBrandHotelChainId
      }
      createdAt
      updatedAt
    }
  }
`;
export const listHotelProperties = /* GraphQL */ `
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
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
export const getHotelBrand = /* GraphQL */ `
  query GetHotelBrand($id: ID!) {
    getHotelBrand(id: $id) {
      id
      name
      status
      HotelChain {
        id
        name
        status
        createdAt
        updatedAt
      }
      logo
      createdAt
      updatedAt
      hotelBrandHotelChainId
    }
  }
`;
export const listHotelBrands = /* GraphQL */ `
  query ListHotelBrands(
    $filter: ModelHotelBrandFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHotelBrands(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        status
        logo
        createdAt
        updatedAt
        hotelBrandHotelChainId
      }
      nextToken
    }
  }
`;
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
export const getHotelChain = /* GraphQL */ `
  query GetHotelChain($id: ID!) {
    getHotelChain(id: $id) {
      id
      name
      status
      createdAt
      updatedAt
    }
  }
`;
export const listHotelChains = /* GraphQL */ `
  query ListHotelChains(
    $filter: ModelHotelChainFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHotelChains(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const searchHotelChains = /* GraphQL */ `
  query SearchHotelChains(
    $filter: SearchableHotelChainFilterInput
    $sort: [SearchableHotelChainSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableHotelChainAggregationInput]
  ) {
    searchHotelChains(
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
export const getCard = /* GraphQL */ `
  query GetCard($id: ID!) {
    getCard(id: $id) {
      id
      name
      number
      status
      type
      createdAt
      updatedAt
    }
  }
`;
export const listCards = /* GraphQL */ `
  query ListCards(
    $filter: ModelCardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCards(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        number
        status
        type
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listCardsByStatus = /* GraphQL */ `
  query ListCardsByStatus(
    $status: CARDSTATUS!
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCardsByStatus(
      status: $status
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        number
        status
        type
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const searchCards = /* GraphQL */ `
  query SearchCards(
    $filter: SearchableCardFilterInput
    $sort: [SearchableCardSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableCardAggregationInput]
  ) {
    searchCards(
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
        number
        status
        type
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
export const getPaymentType = /* GraphQL */ `
  query GetPaymentType($id: ID!) {
    getPaymentType(id: $id) {
      id
      name
      description
      status
      type
      createdAt
      updatedAt
    }
  }
`;
export const listPaymentTypes = /* GraphQL */ `
  query ListPaymentTypes(
    $filter: ModelPaymentTypeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPaymentTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        status
        type
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listPaymentTypesByStatus = /* GraphQL */ `
  query ListPaymentTypesByStatus(
    $status: PAYMENTTYPESTATUS!
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPaymentTypeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPaymentTypesByStatus(
      status: $status
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        description
        status
        type
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const searchPaymentTypes = /* GraphQL */ `
  query SearchPaymentTypes(
    $filter: SearchablePaymentTypeFilterInput
    $sort: [SearchablePaymentTypeSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchablePaymentTypeAggregationInput]
  ) {
    searchPaymentTypes(
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
        description
        status
        type
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
export const getGuest = /* GraphQL */ `
  query GetGuest($id: ID!) {
    getGuest(id: $id) {
      id
      first_name
      relationship
      middle_initial
      last_name
      email
      telephone
      extension
      applicationID
      type
      under_age_three
      address
      address_2
      city
      state
      zip
      Application {
        id
        status
        liaison_read
        admin_read
        applicationPatientId
        applicationServiceMemberId
        exception_narrative
        liaison_terms_of_use_agreement
        sm_terms_of_use_agreement
        applicationGroupId
        AffiliationID
        createdAt
        updatedAt
        applicationUserId
        applicationAssignedToId
        applicationApplicantId
      }
      createdAt
      updatedAt
    }
  }
`;
export const listGuests = /* GraphQL */ `
  query ListGuests(
    $filter: ModelGuestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGuests(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        first_name
        relationship
        middle_initial
        last_name
        email
        telephone
        extension
        applicationID
        type
        under_age_three
        address
        address_2
        city
        state
        zip
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const searchGuests = /* GraphQL */ `
  query SearchGuests(
    $filter: SearchableGuestFilterInput
    $sort: [SearchableGuestSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableGuestAggregationInput]
  ) {
    searchGuests(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        first_name
        relationship
        middle_initial
        last_name
        email
        telephone
        extension
        applicationID
        type
        under_age_three
        address
        address_2
        city
        state
        zip
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
export const getApplicant = /* GraphQL */ `
  query GetApplicant($id: ID!) {
    getApplicant(id: $id) {
      id
      first_name
      last_name
      email
      telephone
      signature
      job
      branch_of_service
      current_status
      base_assigned_to
      relation_to_service_member
      referrer_date
      user_type
      middle_initial
      patient_type
      extension
      family_lodge
      location_name
      location_address
      lodging_explanation
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
      collected_outside_fisherhouse
      Application {
        id
        status
        liaison_read
        admin_read
        applicationPatientId
        applicationServiceMemberId
        exception_narrative
        liaison_terms_of_use_agreement
        sm_terms_of_use_agreement
        applicationGroupId
        AffiliationID
        createdAt
        updatedAt
        applicationUserId
        applicationAssignedToId
        applicationApplicantId
      }
      createdAt
      updatedAt
      applicantAffiliationId
      applicantApplicationId
    }
  }
`;
export const listApplicants = /* GraphQL */ `
  query ListApplicants(
    $filter: ModelApplicantFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApplicants(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        first_name
        last_name
        email
        telephone
        signature
        job
        branch_of_service
        current_status
        base_assigned_to
        relation_to_service_member
        referrer_date
        user_type
        middle_initial
        patient_type
        extension
        family_lodge
        location_name
        location_address
        lodging_explanation
        affiliation_type
        collected_outside_fisherhouse
        createdAt
        updatedAt
        applicantAffiliationId
        applicantApplicationId
      }
      nextToken
    }
  }
`;
export const searchApplicants = /* GraphQL */ `
  query SearchApplicants(
    $filter: SearchableApplicantFilterInput
    $sort: [SearchableApplicantSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableApplicantAggregationInput]
  ) {
    searchApplicants(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        first_name
        last_name
        email
        telephone
        signature
        job
        branch_of_service
        current_status
        base_assigned_to
        relation_to_service_member
        referrer_date
        user_type
        middle_initial
        patient_type
        extension
        family_lodge
        location_name
        location_address
        lodging_explanation
        affiliation_type
        collected_outside_fisherhouse
        createdAt
        updatedAt
        applicantAffiliationId
        applicantApplicationId
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
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      pending_email
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
      owner
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        pending_email
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
        affiliation_type
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const usersByEmail = /* GraphQL */ `
  query UsersByEmail(
    $username: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    UsersByEmail(
      username: $username
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        username
        pending_email
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
        affiliation_type
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const usersByStatus = /* GraphQL */ `
  query UsersByStatus(
    $status: USERSTATUS!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    UsersByStatus(
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        username
        pending_email
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
        affiliation_type
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const userByOwner = /* GraphQL */ `
  query UserByOwner(
    $owner: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    UserByOwner(
      owner: $owner
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        username
        pending_email
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
        affiliation_type
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const searchUsers = /* GraphQL */ `
  query SearchUsers(
    $filter: SearchableUserFilterInput
    $sort: [SearchableUserSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableUserAggregationInput]
  ) {
    searchUsers(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        username
        pending_email
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
        owner
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
export const getStay = /* GraphQL */ `
  query GetStay($id: ID!) {
    getStay(id: $id) {
      id
      applicationID
      type
      state
      reservation_number
      payment_type
      PaymentTypeID
      payment_method {
        id
        name
        description
        status
        type
        createdAt
        updatedAt
      }
      payment_points_used
      payment_cost_of_reservation
      checkout_points_used
      checkout_cost_of_reservation
      requested_check_in
      requested_check_out
      status
      actual_check_in
      actual_check_out
      guest_stayed_at_hotel
      reason_guest_did_not_stay
      payment_incidental_cost
      charge_type
      card
      note
      reconciled
      ready_for_final_reconcile
      comment
      comparable_cost
      certificate_number
      confirmation_number
      card_used_for_incidentals
      room_type_requests
      room_feature_requests
      room_type_actual
      room_feature_actual
      room_description
      room_description_actual
      reason_decline
      reason_return
      charge_reconcile
      hotel_reconcile
      points_reconcile
      giftcard_reconcile
      batch_no
      city
      HotelPropertyID
      HotelBooked {
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
        createdAt
        updatedAt
      }
      Application {
        id
        status
        liaison_read
        admin_read
        applicationPatientId
        applicationServiceMemberId
        exception_narrative
        liaison_terms_of_use_agreement
        sm_terms_of_use_agreement
        applicationGroupId
        AffiliationID
        createdAt
        updatedAt
        applicationUserId
        applicationAssignedToId
        applicationApplicantId
      }
      FisherHouse {
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
      narrative
      special_requests
      hotel_files {
        key
        user
      }
      notified_about_checkout
      createdAt
      updatedAt
      stayFisherHouseId
    }
  }
`;
export const listStays = /* GraphQL */ `
  query ListStays(
    $filter: ModelStayFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStays(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        applicationID
        type
        state
        reservation_number
        payment_type
        PaymentTypeID
        payment_points_used
        payment_cost_of_reservation
        checkout_points_used
        checkout_cost_of_reservation
        requested_check_in
        requested_check_out
        status
        actual_check_in
        actual_check_out
        guest_stayed_at_hotel
        reason_guest_did_not_stay
        payment_incidental_cost
        charge_type
        card
        note
        reconciled
        ready_for_final_reconcile
        comment
        comparable_cost
        certificate_number
        confirmation_number
        card_used_for_incidentals
        room_type_requests
        room_feature_requests
        room_type_actual
        room_feature_actual
        room_description
        room_description_actual
        reason_decline
        reason_return
        charge_reconcile
        hotel_reconcile
        points_reconcile
        giftcard_reconcile
        batch_no
        city
        HotelPropertyID
        narrative
        special_requests
        notified_about_checkout
        createdAt
        updatedAt
        stayFisherHouseId
      }
      nextToken
    }
  }
`;
export const listStaysByPaymentType = /* GraphQL */ `
  query ListStaysByPaymentType(
    $PaymentTypeID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelStayFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStaysByPaymentType(
      PaymentTypeID: $PaymentTypeID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicationID
        type
        state
        reservation_number
        payment_type
        PaymentTypeID
        payment_points_used
        payment_cost_of_reservation
        checkout_points_used
        checkout_cost_of_reservation
        requested_check_in
        requested_check_out
        status
        actual_check_in
        actual_check_out
        guest_stayed_at_hotel
        reason_guest_did_not_stay
        payment_incidental_cost
        charge_type
        card
        note
        reconciled
        ready_for_final_reconcile
        comment
        comparable_cost
        certificate_number
        confirmation_number
        card_used_for_incidentals
        room_type_requests
        room_feature_requests
        room_type_actual
        room_feature_actual
        room_description
        room_description_actual
        reason_decline
        reason_return
        charge_reconcile
        hotel_reconcile
        points_reconcile
        giftcard_reconcile
        batch_no
        city
        HotelPropertyID
        narrative
        special_requests
        notified_about_checkout
        createdAt
        updatedAt
        stayFisherHouseId
      }
      nextToken
    }
  }
`;
export const stayByNotificationAfterCheckout = /* GraphQL */ `
  query StayByNotificationAfterCheckout(
    $notified_about_checkout: Int!
    $status: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelStayFilterInput
    $limit: Int
    $nextToken: String
  ) {
    stayByNotificationAfterCheckout(
      notified_about_checkout: $notified_about_checkout
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicationID
        type
        state
        reservation_number
        payment_type
        PaymentTypeID
        payment_points_used
        payment_cost_of_reservation
        checkout_points_used
        checkout_cost_of_reservation
        requested_check_in
        requested_check_out
        status
        actual_check_in
        actual_check_out
        guest_stayed_at_hotel
        reason_guest_did_not_stay
        payment_incidental_cost
        charge_type
        card
        note
        reconciled
        ready_for_final_reconcile
        comment
        comparable_cost
        certificate_number
        confirmation_number
        card_used_for_incidentals
        room_type_requests
        room_feature_requests
        room_type_actual
        room_feature_actual
        room_description
        room_description_actual
        reason_decline
        reason_return
        charge_reconcile
        hotel_reconcile
        points_reconcile
        giftcard_reconcile
        batch_no
        city
        HotelPropertyID
        narrative
        special_requests
        notified_about_checkout
        createdAt
        updatedAt
        stayFisherHouseId
      }
      nextToken
    }
  }
`;
export const searchStays = /* GraphQL */ `
  query SearchStays(
    $filter: SearchableStayFilterInput
    $sort: [SearchableStaySortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableStayAggregationInput]
  ) {
    searchStays(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        applicationID
        type
        state
        reservation_number
        payment_type
        PaymentTypeID
        payment_points_used
        payment_cost_of_reservation
        checkout_points_used
        checkout_cost_of_reservation
        requested_check_in
        requested_check_out
        status
        actual_check_in
        actual_check_out
        guest_stayed_at_hotel
        reason_guest_did_not_stay
        payment_incidental_cost
        charge_type
        card
        note
        reconciled
        ready_for_final_reconcile
        comment
        comparable_cost
        certificate_number
        confirmation_number
        card_used_for_incidentals
        room_type_requests
        room_feature_requests
        room_type_actual
        room_feature_actual
        room_description
        room_description_actual
        reason_decline
        reason_return
        charge_reconcile
        hotel_reconcile
        points_reconcile
        giftcard_reconcile
        batch_no
        city
        HotelPropertyID
        narrative
        special_requests
        notified_about_checkout
        createdAt
        updatedAt
        stayFisherHouseId
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
export const getApplication = /* GraphQL */ `
  query GetApplication($id: ID!) {
    getApplication(id: $id) {
      id
      StaysInApplication {
        nextToken
      }
      status
      User {
        id
        username
        pending_email
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
        affiliation_type
        owner
        createdAt
        updatedAt
      }
      AssignedTo {
        id
        username
        pending_email
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
        affiliation_type
        owner
        createdAt
        updatedAt
      }
      liaison_read
      admin_read
      applicationPatientId
      Patient {
        id
        first_name
        middle_initial
        last_name
        relationship
        createdAt
        updatedAt
        patientApplicationId
      }
      applicationServiceMemberId
      ServiceMember {
        id
        first_name
        middle_initial
        last_name
        email
        telephone
        extension
        branch_of_service
        current_status
        on_military_travel_orders
        other_patient
        lodging_explanation
        unidentified_explanation
        createdAt
        updatedAt
        serviceMemberBaseAssignedToId
        serviceMemberTreatmentFacilityId
        serviceMemberApplicationId
      }
      exception_narrative
      Guests {
        nextToken
      }
      liaison_terms_of_use_agreement
      sm_terms_of_use_agreement
      Applicant {
        id
        first_name
        last_name
        email
        telephone
        signature
        job
        branch_of_service
        current_status
        base_assigned_to
        relation_to_service_member
        referrer_date
        user_type
        middle_initial
        patient_type
        extension
        family_lodge
        location_name
        location_address
        lodging_explanation
        affiliation_type
        collected_outside_fisherhouse
        createdAt
        updatedAt
        applicantAffiliationId
        applicantApplicationId
      }
      applicationGroupId
      Group {
        id
        name
        status
        createdAt
        updatedAt
        groupCreatorId
      }
      Notes {
        nextToken
      }
      AffiliationID
      createdAt
      updatedAt
      applicationUserId
      applicationAssignedToId
      applicationApplicantId
    }
  }
`;
export const listApplications = /* GraphQL */ `
  query ListApplications(
    $filter: ModelApplicationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApplications(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        status
        liaison_read
        admin_read
        applicationPatientId
        applicationServiceMemberId
        exception_narrative
        liaison_terms_of_use_agreement
        sm_terms_of_use_agreement
        applicationGroupId
        AffiliationID
        createdAt
        updatedAt
        applicationUserId
        applicationAssignedToId
        applicationApplicantId
      }
      nextToken
    }
  }
`;
export const listApplicationsByStatus = /* GraphQL */ `
  query ListApplicationsByStatus(
    $status: APPLICATIONSTATUS!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApplicationsByStatus(
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        status
        liaison_read
        admin_read
        applicationPatientId
        applicationServiceMemberId
        exception_narrative
        liaison_terms_of_use_agreement
        sm_terms_of_use_agreement
        applicationGroupId
        AffiliationID
        createdAt
        updatedAt
        applicationUserId
        applicationAssignedToId
        applicationApplicantId
      }
      nextToken
    }
  }
`;
export const listApplicationsByPatientId = /* GraphQL */ `
  query ListApplicationsByPatientId(
    $applicationPatientId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApplicationsByPatientId(
      applicationPatientId: $applicationPatientId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        status
        liaison_read
        admin_read
        applicationPatientId
        applicationServiceMemberId
        exception_narrative
        liaison_terms_of_use_agreement
        sm_terms_of_use_agreement
        applicationGroupId
        AffiliationID
        createdAt
        updatedAt
        applicationUserId
        applicationAssignedToId
        applicationApplicantId
      }
      nextToken
    }
  }
`;
export const listApplicationsByServiceMemberId = /* GraphQL */ `
  query ListApplicationsByServiceMemberId(
    $applicationServiceMemberId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApplicationsByServiceMemberId(
      applicationServiceMemberId: $applicationServiceMemberId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        status
        liaison_read
        admin_read
        applicationPatientId
        applicationServiceMemberId
        exception_narrative
        liaison_terms_of_use_agreement
        sm_terms_of_use_agreement
        applicationGroupId
        AffiliationID
        createdAt
        updatedAt
        applicationUserId
        applicationAssignedToId
        applicationApplicantId
      }
      nextToken
    }
  }
`;
export const applicationByGroupId = /* GraphQL */ `
  query ApplicationByGroupId(
    $applicationGroupId: ID!
    $status: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ApplicationByGroupId(
      applicationGroupId: $applicationGroupId
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        status
        liaison_read
        admin_read
        applicationPatientId
        applicationServiceMemberId
        exception_narrative
        liaison_terms_of_use_agreement
        sm_terms_of_use_agreement
        applicationGroupId
        AffiliationID
        createdAt
        updatedAt
        applicationUserId
        applicationAssignedToId
        applicationApplicantId
      }
      nextToken
    }
  }
`;
export const searchApplications = /* GraphQL */ `
  query SearchApplications(
    $filter: SearchableApplicationFilterInput
    $sort: [SearchableApplicationSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableApplicationAggregationInput]
  ) {
    searchApplications(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        status
        liaison_read
        admin_read
        applicationPatientId
        applicationServiceMemberId
        exception_narrative
        liaison_terms_of_use_agreement
        sm_terms_of_use_agreement
        applicationGroupId
        AffiliationID
        createdAt
        updatedAt
        applicationUserId
        applicationAssignedToId
        applicationApplicantId
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
export const getApplicationSearchRecord = /* GraphQL */ `
  query GetApplicationSearchRecord($id: ID!) {
    getApplicationSearchRecord(id: $id) {
      id
      applicationID
      Application {
        id
        status
        liaison_read
        admin_read
        applicationPatientId
        applicationServiceMemberId
        exception_narrative
        liaison_terms_of_use_agreement
        sm_terms_of_use_agreement
        applicationGroupId
        AffiliationID
        createdAt
        updatedAt
        applicationUserId
        applicationAssignedToId
        applicationApplicantId
      }
      applicationStatus
      staysStatus
      checkInDates
      checkOutDates
      primaryCheckInDate
      primaryCheckOutDate
      primaryCheckinDateStamp
      primaryCheckoutDateStamp
      noteActions
      assignedAdminID
      assignedAdminName
      assignedLiaisonID
      assignedLiaisonName
      groupID
      groupName
      confirmationNumber
      referrerName
      referrerEmail
      serviceMemberFirstName
      serviceMemberLastName
      serviceMemberEmail
      serviceMemberBranchOfService
      serviceMemberDutyStatus
      adminIsUnread
      liaisonIsUnread
      guestFirstNames
      guestLastNames
      guestEmails
      liaisonAffiliationID
      liaisonAffiliationName
      referrerAffiliationID
      referrerAffiliationName
      adminAffiliationID
      adminAffiliationName
      treatmentCenterID
      treatmentCenterName
      baseAssignedID
      baseAssignedName
      vaAssignedID
      vaAssignedName
      hotelChainID
      hotelChainName
      hotelBrandID
      hotelBrandName
      hotelPropertyName
      assignedAffiliationID
      createdAt
      updatedAt
    }
  }
`;
export const listApplicationSearchRecords = /* GraphQL */ `
  query ListApplicationSearchRecords(
    $filter: ModelApplicationSearchRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApplicationSearchRecords(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicationID
        applicationStatus
        staysStatus
        checkInDates
        checkOutDates
        primaryCheckInDate
        primaryCheckOutDate
        primaryCheckinDateStamp
        primaryCheckoutDateStamp
        noteActions
        assignedAdminID
        assignedAdminName
        assignedLiaisonID
        assignedLiaisonName
        groupID
        groupName
        confirmationNumber
        referrerName
        referrerEmail
        serviceMemberFirstName
        serviceMemberLastName
        serviceMemberEmail
        serviceMemberBranchOfService
        serviceMemberDutyStatus
        adminIsUnread
        liaisonIsUnread
        guestFirstNames
        guestLastNames
        guestEmails
        liaisonAffiliationID
        liaisonAffiliationName
        referrerAffiliationID
        referrerAffiliationName
        adminAffiliationID
        adminAffiliationName
        treatmentCenterID
        treatmentCenterName
        baseAssignedID
        baseAssignedName
        vaAssignedID
        vaAssignedName
        hotelChainID
        hotelChainName
        hotelBrandID
        hotelBrandName
        hotelPropertyName
        assignedAffiliationID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getApplicationSearchRecordsByApplicationID = /* GraphQL */ `
  query GetApplicationSearchRecordsByApplicationID(
    $applicationID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationSearchRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getApplicationSearchRecordsByApplicationID(
      applicationID: $applicationID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicationID
        applicationStatus
        staysStatus
        checkInDates
        checkOutDates
        primaryCheckInDate
        primaryCheckOutDate
        primaryCheckinDateStamp
        primaryCheckoutDateStamp
        noteActions
        assignedAdminID
        assignedAdminName
        assignedLiaisonID
        assignedLiaisonName
        groupID
        groupName
        confirmationNumber
        referrerName
        referrerEmail
        serviceMemberFirstName
        serviceMemberLastName
        serviceMemberEmail
        serviceMemberBranchOfService
        serviceMemberDutyStatus
        adminIsUnread
        liaisonIsUnread
        guestFirstNames
        guestLastNames
        guestEmails
        liaisonAffiliationID
        liaisonAffiliationName
        referrerAffiliationID
        referrerAffiliationName
        adminAffiliationID
        adminAffiliationName
        treatmentCenterID
        treatmentCenterName
        baseAssignedID
        baseAssignedName
        vaAssignedID
        vaAssignedName
        hotelChainID
        hotelChainName
        hotelBrandID
        hotelBrandName
        hotelPropertyName
        assignedAffiliationID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
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
        applicationID
        applicationStatus
        staysStatus
        checkInDates
        checkOutDates
        primaryCheckInDate
        primaryCheckOutDate
        primaryCheckinDateStamp
        primaryCheckoutDateStamp
        noteActions
        assignedAdminID
        assignedAdminName
        assignedLiaisonID
        assignedLiaisonName
        groupID
        groupName
        confirmationNumber
        referrerName
        referrerEmail
        serviceMemberFirstName
        serviceMemberLastName
        serviceMemberEmail
        serviceMemberBranchOfService
        serviceMemberDutyStatus
        adminIsUnread
        liaisonIsUnread
        guestFirstNames
        guestLastNames
        guestEmails
        liaisonAffiliationID
        liaisonAffiliationName
        referrerAffiliationID
        referrerAffiliationName
        adminAffiliationID
        adminAffiliationName
        treatmentCenterID
        treatmentCenterName
        baseAssignedID
        baseAssignedName
        vaAssignedID
        vaAssignedName
        hotelChainID
        hotelChainName
        hotelBrandID
        hotelBrandName
        hotelPropertyName
        assignedAffiliationID
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
export const getStaySearchRecord = /* GraphQL */ `
  query GetStaySearchRecord($id: ID!) {
    getStaySearchRecord(id: $id) {
      id
      applicationID
      stayID
      Application {
        id
        status
        liaison_read
        admin_read
        applicationPatientId
        applicationServiceMemberId
        exception_narrative
        liaison_terms_of_use_agreement
        sm_terms_of_use_agreement
        applicationGroupId
        AffiliationID
        createdAt
        updatedAt
        applicationUserId
        applicationAssignedToId
        applicationApplicantId
      }
      Stay {
        id
        applicationID
        type
        state
        reservation_number
        payment_type
        PaymentTypeID
        payment_points_used
        payment_cost_of_reservation
        checkout_points_used
        checkout_cost_of_reservation
        requested_check_in
        requested_check_out
        status
        actual_check_in
        actual_check_out
        guest_stayed_at_hotel
        reason_guest_did_not_stay
        payment_incidental_cost
        charge_type
        card
        note
        reconciled
        ready_for_final_reconcile
        comment
        comparable_cost
        certificate_number
        confirmation_number
        card_used_for_incidentals
        room_type_requests
        room_feature_requests
        room_type_actual
        room_feature_actual
        room_description
        room_description_actual
        reason_decline
        reason_return
        charge_reconcile
        hotel_reconcile
        points_reconcile
        giftcard_reconcile
        batch_no
        city
        HotelPropertyID
        narrative
        special_requests
        notified_about_checkout
        createdAt
        updatedAt
        stayFisherHouseId
      }
      applicationStatus
      staysStatus
      checkInDates
      checkOutDates
      primaryCheckInDate
      primaryCheckOutDate
      primaryCheckinDateStamp
      primaryCheckoutDateStamp
      noteActions
      assignedAdminID
      assignedAdminName
      assignedLiaisonID
      assignedLiaisonName
      groupID
      groupName
      confirmationNumber
      referrerName
      referrerEmail
      serviceMemberFirstName
      serviceMemberLastName
      serviceMemberEmail
      serviceMemberBranchOfService
      serviceMemberDutyStatus
      adminIsUnread
      liaisonIsUnread
      guestFirstNames
      guestLastNames
      guestEmails
      liaisonAffiliationID
      liaisonAffiliationName
      referrerAffiliationID
      referrerAffiliationName
      adminAffiliationID
      adminAffiliationName
      treatmentCenterID
      treatmentCenterName
      baseAssignedID
      baseAssignedName
      vaAssignedID
      vaAssignedName
      hotelChainID
      hotelChainName
      hotelBrandID
      hotelBrandName
      hotelPropertyName
      assignedAffiliationID
      createdAt
      updatedAt
    }
  }
`;
export const listStaySearchRecords = /* GraphQL */ `
  query ListStaySearchRecords(
    $filter: ModelStaySearchRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStaySearchRecords(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicationID
        stayID
        applicationStatus
        staysStatus
        checkInDates
        checkOutDates
        primaryCheckInDate
        primaryCheckOutDate
        primaryCheckinDateStamp
        primaryCheckoutDateStamp
        noteActions
        assignedAdminID
        assignedAdminName
        assignedLiaisonID
        assignedLiaisonName
        groupID
        groupName
        confirmationNumber
        referrerName
        referrerEmail
        serviceMemberFirstName
        serviceMemberLastName
        serviceMemberEmail
        serviceMemberBranchOfService
        serviceMemberDutyStatus
        adminIsUnread
        liaisonIsUnread
        guestFirstNames
        guestLastNames
        guestEmails
        liaisonAffiliationID
        liaisonAffiliationName
        referrerAffiliationID
        referrerAffiliationName
        adminAffiliationID
        adminAffiliationName
        treatmentCenterID
        treatmentCenterName
        baseAssignedID
        baseAssignedName
        vaAssignedID
        vaAssignedName
        hotelChainID
        hotelChainName
        hotelBrandID
        hotelBrandName
        hotelPropertyName
        assignedAffiliationID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getStaySearchRecordsByApplicationID = /* GraphQL */ `
  query GetStaySearchRecordsByApplicationID(
    $applicationID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelStaySearchRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getStaySearchRecordsByApplicationID(
      applicationID: $applicationID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicationID
        stayID
        applicationStatus
        staysStatus
        checkInDates
        checkOutDates
        primaryCheckInDate
        primaryCheckOutDate
        primaryCheckinDateStamp
        primaryCheckoutDateStamp
        noteActions
        assignedAdminID
        assignedAdminName
        assignedLiaisonID
        assignedLiaisonName
        groupID
        groupName
        confirmationNumber
        referrerName
        referrerEmail
        serviceMemberFirstName
        serviceMemberLastName
        serviceMemberEmail
        serviceMemberBranchOfService
        serviceMemberDutyStatus
        adminIsUnread
        liaisonIsUnread
        guestFirstNames
        guestLastNames
        guestEmails
        liaisonAffiliationID
        liaisonAffiliationName
        referrerAffiliationID
        referrerAffiliationName
        adminAffiliationID
        adminAffiliationName
        treatmentCenterID
        treatmentCenterName
        baseAssignedID
        baseAssignedName
        vaAssignedID
        vaAssignedName
        hotelChainID
        hotelChainName
        hotelBrandID
        hotelBrandName
        hotelPropertyName
        assignedAffiliationID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getStaySearchRecordsByStayID = /* GraphQL */ `
  query GetStaySearchRecordsByStayID(
    $stayID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelStaySearchRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getStaySearchRecordsByStayID(
      stayID: $stayID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicationID
        stayID
        applicationStatus
        staysStatus
        checkInDates
        checkOutDates
        primaryCheckInDate
        primaryCheckOutDate
        primaryCheckinDateStamp
        primaryCheckoutDateStamp
        noteActions
        assignedAdminID
        assignedAdminName
        assignedLiaisonID
        assignedLiaisonName
        groupID
        groupName
        confirmationNumber
        referrerName
        referrerEmail
        serviceMemberFirstName
        serviceMemberLastName
        serviceMemberEmail
        serviceMemberBranchOfService
        serviceMemberDutyStatus
        adminIsUnread
        liaisonIsUnread
        guestFirstNames
        guestLastNames
        guestEmails
        liaisonAffiliationID
        liaisonAffiliationName
        referrerAffiliationID
        referrerAffiliationName
        adminAffiliationID
        adminAffiliationName
        treatmentCenterID
        treatmentCenterName
        baseAssignedID
        baseAssignedName
        vaAssignedID
        vaAssignedName
        hotelChainID
        hotelChainName
        hotelBrandID
        hotelBrandName
        hotelPropertyName
        assignedAffiliationID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const searchStaySearchRecords = /* GraphQL */ `
  query SearchStaySearchRecords(
    $filter: SearchableStaySearchRecordFilterInput
    $sort: [SearchableStaySearchRecordSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableStaySearchRecordAggregationInput]
  ) {
    searchStaySearchRecords(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        applicationID
        stayID
        applicationStatus
        staysStatus
        checkInDates
        checkOutDates
        primaryCheckInDate
        primaryCheckOutDate
        primaryCheckinDateStamp
        primaryCheckoutDateStamp
        noteActions
        assignedAdminID
        assignedAdminName
        assignedLiaisonID
        assignedLiaisonName
        groupID
        groupName
        confirmationNumber
        referrerName
        referrerEmail
        serviceMemberFirstName
        serviceMemberLastName
        serviceMemberEmail
        serviceMemberBranchOfService
        serviceMemberDutyStatus
        adminIsUnread
        liaisonIsUnread
        guestFirstNames
        guestLastNames
        guestEmails
        liaisonAffiliationID
        liaisonAffiliationName
        referrerAffiliationID
        referrerAffiliationName
        adminAffiliationID
        adminAffiliationName
        treatmentCenterID
        treatmentCenterName
        baseAssignedID
        baseAssignedName
        vaAssignedID
        vaAssignedName
        hotelChainID
        hotelChainName
        hotelBrandID
        hotelBrandName
        hotelPropertyName
        assignedAffiliationID
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
