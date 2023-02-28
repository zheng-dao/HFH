/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateNoteByApplicationId = /* GraphQL */ `
  subscription OnCreateNoteByApplicationId($applicationID: ID) {
    onCreateNoteByApplicationId(applicationID: $applicationID) {
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
export const onCreateGroup = /* GraphQL */ `
  subscription OnCreateGroup($filter: ModelSubscriptionGroupFilterInput) {
    onCreateGroup(filter: $filter) {
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
export const onUpdateGroup = /* GraphQL */ `
  subscription OnUpdateGroup($filter: ModelSubscriptionGroupFilterInput) {
    onUpdateGroup(filter: $filter) {
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
export const onDeleteGroup = /* GraphQL */ `
  subscription OnDeleteGroup($filter: ModelSubscriptionGroupFilterInput) {
    onDeleteGroup(filter: $filter) {
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
export const onCreateAffiliation = /* GraphQL */ `
  subscription OnCreateAffiliation(
    $filter: ModelSubscriptionAffiliationFilterInput
    $owner: String
  ) {
    onCreateAffiliation(filter: $filter, owner: $owner) {
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
  subscription OnUpdateAffiliation(
    $filter: ModelSubscriptionAffiliationFilterInput
    $owner: String
  ) {
    onUpdateAffiliation(filter: $filter, owner: $owner) {
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
  subscription OnDeleteAffiliation(
    $filter: ModelSubscriptionAffiliationFilterInput
    $owner: String
  ) {
    onDeleteAffiliation(filter: $filter, owner: $owner) {
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
export const onCreateNote = /* GraphQL */ `
  subscription OnCreateNote($filter: ModelSubscriptionNoteFilterInput) {
    onCreateNote(filter: $filter) {
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
export const onUpdateNote = /* GraphQL */ `
  subscription OnUpdateNote($filter: ModelSubscriptionNoteFilterInput) {
    onUpdateNote(filter: $filter) {
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
export const onDeleteNote = /* GraphQL */ `
  subscription OnDeleteNote($filter: ModelSubscriptionNoteFilterInput) {
    onDeleteNote(filter: $filter) {
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
export const onCreateServiceMember = /* GraphQL */ `
  subscription OnCreateServiceMember(
    $filter: ModelSubscriptionServiceMemberFilterInput
  ) {
    onCreateServiceMember(filter: $filter) {
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
export const onUpdateServiceMember = /* GraphQL */ `
  subscription OnUpdateServiceMember(
    $filter: ModelSubscriptionServiceMemberFilterInput
  ) {
    onUpdateServiceMember(filter: $filter) {
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
export const onDeleteServiceMember = /* GraphQL */ `
  subscription OnDeleteServiceMember(
    $filter: ModelSubscriptionServiceMemberFilterInput
  ) {
    onDeleteServiceMember(filter: $filter) {
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
export const onCreatePatient = /* GraphQL */ `
  subscription OnCreatePatient($filter: ModelSubscriptionPatientFilterInput) {
    onCreatePatient(filter: $filter) {
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
export const onUpdatePatient = /* GraphQL */ `
  subscription OnUpdatePatient($filter: ModelSubscriptionPatientFilterInput) {
    onUpdatePatient(filter: $filter) {
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
export const onDeletePatient = /* GraphQL */ `
  subscription OnDeletePatient($filter: ModelSubscriptionPatientFilterInput) {
    onDeletePatient(filter: $filter) {
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
export const onCreateConfigurationSetting = /* GraphQL */ `
  subscription OnCreateConfigurationSetting(
    $filter: ModelSubscriptionConfigurationSettingFilterInput
  ) {
    onCreateConfigurationSetting(filter: $filter) {
      id
      name
      value
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateConfigurationSetting = /* GraphQL */ `
  subscription OnUpdateConfigurationSetting(
    $filter: ModelSubscriptionConfigurationSettingFilterInput
  ) {
    onUpdateConfigurationSetting(filter: $filter) {
      id
      name
      value
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteConfigurationSetting = /* GraphQL */ `
  subscription OnDeleteConfigurationSetting(
    $filter: ModelSubscriptionConfigurationSettingFilterInput
  ) {
    onDeleteConfigurationSetting(filter: $filter) {
      id
      name
      value
      createdAt
      updatedAt
    }
  }
`;
export const onCreateHotelProperty = /* GraphQL */ `
  subscription OnCreateHotelProperty(
    $filter: ModelSubscriptionHotelPropertyFilterInput
  ) {
    onCreateHotelProperty(filter: $filter) {
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
export const onUpdateHotelProperty = /* GraphQL */ `
  subscription OnUpdateHotelProperty(
    $filter: ModelSubscriptionHotelPropertyFilterInput
  ) {
    onUpdateHotelProperty(filter: $filter) {
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
export const onDeleteHotelProperty = /* GraphQL */ `
  subscription OnDeleteHotelProperty(
    $filter: ModelSubscriptionHotelPropertyFilterInput
  ) {
    onDeleteHotelProperty(filter: $filter) {
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
export const onCreateHotelBrand = /* GraphQL */ `
  subscription OnCreateHotelBrand(
    $filter: ModelSubscriptionHotelBrandFilterInput
  ) {
    onCreateHotelBrand(filter: $filter) {
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
export const onUpdateHotelBrand = /* GraphQL */ `
  subscription OnUpdateHotelBrand(
    $filter: ModelSubscriptionHotelBrandFilterInput
  ) {
    onUpdateHotelBrand(filter: $filter) {
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
export const onDeleteHotelBrand = /* GraphQL */ `
  subscription OnDeleteHotelBrand(
    $filter: ModelSubscriptionHotelBrandFilterInput
  ) {
    onDeleteHotelBrand(filter: $filter) {
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
export const onCreateHotelChain = /* GraphQL */ `
  subscription OnCreateHotelChain(
    $filter: ModelSubscriptionHotelChainFilterInput
  ) {
    onCreateHotelChain(filter: $filter) {
      id
      name
      status
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateHotelChain = /* GraphQL */ `
  subscription OnUpdateHotelChain(
    $filter: ModelSubscriptionHotelChainFilterInput
  ) {
    onUpdateHotelChain(filter: $filter) {
      id
      name
      status
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteHotelChain = /* GraphQL */ `
  subscription OnDeleteHotelChain(
    $filter: ModelSubscriptionHotelChainFilterInput
  ) {
    onDeleteHotelChain(filter: $filter) {
      id
      name
      status
      createdAt
      updatedAt
    }
  }
`;
export const onCreateCard = /* GraphQL */ `
  subscription OnCreateCard($filter: ModelSubscriptionCardFilterInput) {
    onCreateCard(filter: $filter) {
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
export const onUpdateCard = /* GraphQL */ `
  subscription OnUpdateCard($filter: ModelSubscriptionCardFilterInput) {
    onUpdateCard(filter: $filter) {
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
export const onDeleteCard = /* GraphQL */ `
  subscription OnDeleteCard($filter: ModelSubscriptionCardFilterInput) {
    onDeleteCard(filter: $filter) {
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
export const onCreatePaymentType = /* GraphQL */ `
  subscription OnCreatePaymentType(
    $filter: ModelSubscriptionPaymentTypeFilterInput
  ) {
    onCreatePaymentType(filter: $filter) {
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
export const onUpdatePaymentType = /* GraphQL */ `
  subscription OnUpdatePaymentType(
    $filter: ModelSubscriptionPaymentTypeFilterInput
  ) {
    onUpdatePaymentType(filter: $filter) {
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
export const onDeletePaymentType = /* GraphQL */ `
  subscription OnDeletePaymentType(
    $filter: ModelSubscriptionPaymentTypeFilterInput
  ) {
    onDeletePaymentType(filter: $filter) {
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
export const onCreateGuest = /* GraphQL */ `
  subscription OnCreateGuest($filter: ModelSubscriptionGuestFilterInput) {
    onCreateGuest(filter: $filter) {
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
export const onUpdateGuest = /* GraphQL */ `
  subscription OnUpdateGuest($filter: ModelSubscriptionGuestFilterInput) {
    onUpdateGuest(filter: $filter) {
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
export const onDeleteGuest = /* GraphQL */ `
  subscription OnDeleteGuest($filter: ModelSubscriptionGuestFilterInput) {
    onDeleteGuest(filter: $filter) {
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
export const onCreateApplicant = /* GraphQL */ `
  subscription OnCreateApplicant(
    $filter: ModelSubscriptionApplicantFilterInput
  ) {
    onCreateApplicant(filter: $filter) {
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
export const onUpdateApplicant = /* GraphQL */ `
  subscription OnUpdateApplicant(
    $filter: ModelSubscriptionApplicantFilterInput
  ) {
    onUpdateApplicant(filter: $filter) {
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
export const onDeleteApplicant = /* GraphQL */ `
  subscription OnDeleteApplicant(
    $filter: ModelSubscriptionApplicantFilterInput
  ) {
    onDeleteApplicant(filter: $filter) {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onUpdateUser(filter: $filter, owner: $owner) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onDeleteUser(filter: $filter, owner: $owner) {
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
export const onCreateStay = /* GraphQL */ `
  subscription OnCreateStay($filter: ModelSubscriptionStayFilterInput) {
    onCreateStay(filter: $filter) {
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
export const onUpdateStay = /* GraphQL */ `
  subscription OnUpdateStay($filter: ModelSubscriptionStayFilterInput) {
    onUpdateStay(filter: $filter) {
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
export const onDeleteStay = /* GraphQL */ `
  subscription OnDeleteStay($filter: ModelSubscriptionStayFilterInput) {
    onDeleteStay(filter: $filter) {
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
export const onCreateApplication = /* GraphQL */ `
  subscription OnCreateApplication(
    $filter: ModelSubscriptionApplicationFilterInput
  ) {
    onCreateApplication(filter: $filter) {
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
export const onUpdateApplication = /* GraphQL */ `
  subscription OnUpdateApplication(
    $filter: ModelSubscriptionApplicationFilterInput
  ) {
    onUpdateApplication(filter: $filter) {
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
export const onDeleteApplication = /* GraphQL */ `
  subscription OnDeleteApplication(
    $filter: ModelSubscriptionApplicationFilterInput
  ) {
    onDeleteApplication(filter: $filter) {
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
export const onCreateApplicationSearchRecord = /* GraphQL */ `
  subscription OnCreateApplicationSearchRecord(
    $filter: ModelSubscriptionApplicationSearchRecordFilterInput
  ) {
    onCreateApplicationSearchRecord(filter: $filter) {
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
export const onUpdateApplicationSearchRecord = /* GraphQL */ `
  subscription OnUpdateApplicationSearchRecord(
    $filter: ModelSubscriptionApplicationSearchRecordFilterInput
  ) {
    onUpdateApplicationSearchRecord(filter: $filter) {
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
export const onDeleteApplicationSearchRecord = /* GraphQL */ `
  subscription OnDeleteApplicationSearchRecord(
    $filter: ModelSubscriptionApplicationSearchRecordFilterInput
  ) {
    onDeleteApplicationSearchRecord(filter: $filter) {
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
export const onCreateStaySearchRecord = /* GraphQL */ `
  subscription OnCreateStaySearchRecord(
    $filter: ModelSubscriptionStaySearchRecordFilterInput
  ) {
    onCreateStaySearchRecord(filter: $filter) {
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
export const onUpdateStaySearchRecord = /* GraphQL */ `
  subscription OnUpdateStaySearchRecord(
    $filter: ModelSubscriptionStaySearchRecordFilterInput
  ) {
    onUpdateStaySearchRecord(filter: $filter) {
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
export const onDeleteStaySearchRecord = /* GraphQL */ `
  subscription OnDeleteStaySearchRecord(
    $filter: ModelSubscriptionStaySearchRecordFilterInput
  ) {
    onDeleteStaySearchRecord(filter: $filter) {
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
