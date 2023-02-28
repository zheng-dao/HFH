/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGroup = /* GraphQL */ `
  mutation CreateGroup(
    $input: CreateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    createGroup(input: $input, condition: $condition) {
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
export const updateGroup = /* GraphQL */ `
  mutation UpdateGroup(
    $input: UpdateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    updateGroup(input: $input, condition: $condition) {
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
export const deleteGroup = /* GraphQL */ `
  mutation DeleteGroup(
    $input: DeleteGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    deleteGroup(input: $input, condition: $condition) {
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
export const createAffiliation = /* GraphQL */ `
  mutation CreateAffiliation(
    $input: CreateAffiliationInput!
    $condition: ModelAffiliationConditionInput
  ) {
    createAffiliation(input: $input, condition: $condition) {
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
export const updateAffiliation = /* GraphQL */ `
  mutation UpdateAffiliation(
    $input: UpdateAffiliationInput!
    $condition: ModelAffiliationConditionInput
  ) {
    updateAffiliation(input: $input, condition: $condition) {
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
export const deleteAffiliation = /* GraphQL */ `
  mutation DeleteAffiliation(
    $input: DeleteAffiliationInput!
    $condition: ModelAffiliationConditionInput
  ) {
    deleteAffiliation(input: $input, condition: $condition) {
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
export const createNote = /* GraphQL */ `
  mutation CreateNote(
    $input: CreateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    createNote(input: $input, condition: $condition) {
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
export const updateNote = /* GraphQL */ `
  mutation UpdateNote(
    $input: UpdateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    updateNote(input: $input, condition: $condition) {
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
export const deleteNote = /* GraphQL */ `
  mutation DeleteNote(
    $input: DeleteNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    deleteNote(input: $input, condition: $condition) {
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
export const createServiceMember = /* GraphQL */ `
  mutation CreateServiceMember(
    $input: CreateServiceMemberInput!
    $condition: ModelServiceMemberConditionInput
  ) {
    createServiceMember(input: $input, condition: $condition) {
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
export const updateServiceMember = /* GraphQL */ `
  mutation UpdateServiceMember(
    $input: UpdateServiceMemberInput!
    $condition: ModelServiceMemberConditionInput
  ) {
    updateServiceMember(input: $input, condition: $condition) {
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
export const deleteServiceMember = /* GraphQL */ `
  mutation DeleteServiceMember(
    $input: DeleteServiceMemberInput!
    $condition: ModelServiceMemberConditionInput
  ) {
    deleteServiceMember(input: $input, condition: $condition) {
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
export const createPatient = /* GraphQL */ `
  mutation CreatePatient(
    $input: CreatePatientInput!
    $condition: ModelPatientConditionInput
  ) {
    createPatient(input: $input, condition: $condition) {
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
export const updatePatient = /* GraphQL */ `
  mutation UpdatePatient(
    $input: UpdatePatientInput!
    $condition: ModelPatientConditionInput
  ) {
    updatePatient(input: $input, condition: $condition) {
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
export const deletePatient = /* GraphQL */ `
  mutation DeletePatient(
    $input: DeletePatientInput!
    $condition: ModelPatientConditionInput
  ) {
    deletePatient(input: $input, condition: $condition) {
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
export const createConfigurationSetting = /* GraphQL */ `
  mutation CreateConfigurationSetting(
    $input: CreateConfigurationSettingInput!
    $condition: ModelConfigurationSettingConditionInput
  ) {
    createConfigurationSetting(input: $input, condition: $condition) {
      id
      name
      value
      createdAt
      updatedAt
    }
  }
`;
export const updateConfigurationSetting = /* GraphQL */ `
  mutation UpdateConfigurationSetting(
    $input: UpdateConfigurationSettingInput!
    $condition: ModelConfigurationSettingConditionInput
  ) {
    updateConfigurationSetting(input: $input, condition: $condition) {
      id
      name
      value
      createdAt
      updatedAt
    }
  }
`;
export const deleteConfigurationSetting = /* GraphQL */ `
  mutation DeleteConfigurationSetting(
    $input: DeleteConfigurationSettingInput!
    $condition: ModelConfigurationSettingConditionInput
  ) {
    deleteConfigurationSetting(input: $input, condition: $condition) {
      id
      name
      value
      createdAt
      updatedAt
    }
  }
`;
export const createHotelProperty = /* GraphQL */ `
  mutation CreateHotelProperty(
    $input: CreateHotelPropertyInput!
    $condition: ModelHotelPropertyConditionInput
  ) {
    createHotelProperty(input: $input, condition: $condition) {
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
export const updateHotelProperty = /* GraphQL */ `
  mutation UpdateHotelProperty(
    $input: UpdateHotelPropertyInput!
    $condition: ModelHotelPropertyConditionInput
  ) {
    updateHotelProperty(input: $input, condition: $condition) {
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
export const deleteHotelProperty = /* GraphQL */ `
  mutation DeleteHotelProperty(
    $input: DeleteHotelPropertyInput!
    $condition: ModelHotelPropertyConditionInput
  ) {
    deleteHotelProperty(input: $input, condition: $condition) {
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
export const createHotelBrand = /* GraphQL */ `
  mutation CreateHotelBrand(
    $input: CreateHotelBrandInput!
    $condition: ModelHotelBrandConditionInput
  ) {
    createHotelBrand(input: $input, condition: $condition) {
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
export const updateHotelBrand = /* GraphQL */ `
  mutation UpdateHotelBrand(
    $input: UpdateHotelBrandInput!
    $condition: ModelHotelBrandConditionInput
  ) {
    updateHotelBrand(input: $input, condition: $condition) {
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
export const deleteHotelBrand = /* GraphQL */ `
  mutation DeleteHotelBrand(
    $input: DeleteHotelBrandInput!
    $condition: ModelHotelBrandConditionInput
  ) {
    deleteHotelBrand(input: $input, condition: $condition) {
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
export const createHotelChain = /* GraphQL */ `
  mutation CreateHotelChain(
    $input: CreateHotelChainInput!
    $condition: ModelHotelChainConditionInput
  ) {
    createHotelChain(input: $input, condition: $condition) {
      id
      name
      status
      createdAt
      updatedAt
    }
  }
`;
export const updateHotelChain = /* GraphQL */ `
  mutation UpdateHotelChain(
    $input: UpdateHotelChainInput!
    $condition: ModelHotelChainConditionInput
  ) {
    updateHotelChain(input: $input, condition: $condition) {
      id
      name
      status
      createdAt
      updatedAt
    }
  }
`;
export const deleteHotelChain = /* GraphQL */ `
  mutation DeleteHotelChain(
    $input: DeleteHotelChainInput!
    $condition: ModelHotelChainConditionInput
  ) {
    deleteHotelChain(input: $input, condition: $condition) {
      id
      name
      status
      createdAt
      updatedAt
    }
  }
`;
export const createCard = /* GraphQL */ `
  mutation CreateCard(
    $input: CreateCardInput!
    $condition: ModelCardConditionInput
  ) {
    createCard(input: $input, condition: $condition) {
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
export const updateCard = /* GraphQL */ `
  mutation UpdateCard(
    $input: UpdateCardInput!
    $condition: ModelCardConditionInput
  ) {
    updateCard(input: $input, condition: $condition) {
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
export const deleteCard = /* GraphQL */ `
  mutation DeleteCard(
    $input: DeleteCardInput!
    $condition: ModelCardConditionInput
  ) {
    deleteCard(input: $input, condition: $condition) {
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
export const createPaymentType = /* GraphQL */ `
  mutation CreatePaymentType(
    $input: CreatePaymentTypeInput!
    $condition: ModelPaymentTypeConditionInput
  ) {
    createPaymentType(input: $input, condition: $condition) {
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
export const updatePaymentType = /* GraphQL */ `
  mutation UpdatePaymentType(
    $input: UpdatePaymentTypeInput!
    $condition: ModelPaymentTypeConditionInput
  ) {
    updatePaymentType(input: $input, condition: $condition) {
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
export const deletePaymentType = /* GraphQL */ `
  mutation DeletePaymentType(
    $input: DeletePaymentTypeInput!
    $condition: ModelPaymentTypeConditionInput
  ) {
    deletePaymentType(input: $input, condition: $condition) {
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
export const createGuest = /* GraphQL */ `
  mutation CreateGuest(
    $input: CreateGuestInput!
    $condition: ModelGuestConditionInput
  ) {
    createGuest(input: $input, condition: $condition) {
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
export const updateGuest = /* GraphQL */ `
  mutation UpdateGuest(
    $input: UpdateGuestInput!
    $condition: ModelGuestConditionInput
  ) {
    updateGuest(input: $input, condition: $condition) {
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
export const deleteGuest = /* GraphQL */ `
  mutation DeleteGuest(
    $input: DeleteGuestInput!
    $condition: ModelGuestConditionInput
  ) {
    deleteGuest(input: $input, condition: $condition) {
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
export const createApplicant = /* GraphQL */ `
  mutation CreateApplicant(
    $input: CreateApplicantInput!
    $condition: ModelApplicantConditionInput
  ) {
    createApplicant(input: $input, condition: $condition) {
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
export const updateApplicant = /* GraphQL */ `
  mutation UpdateApplicant(
    $input: UpdateApplicantInput!
    $condition: ModelApplicantConditionInput
  ) {
    updateApplicant(input: $input, condition: $condition) {
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
export const deleteApplicant = /* GraphQL */ `
  mutation DeleteApplicant(
    $input: DeleteApplicantInput!
    $condition: ModelApplicantConditionInput
  ) {
    deleteApplicant(input: $input, condition: $condition) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createStay = /* GraphQL */ `
  mutation CreateStay(
    $input: CreateStayInput!
    $condition: ModelStayConditionInput
  ) {
    createStay(input: $input, condition: $condition) {
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
export const updateStay = /* GraphQL */ `
  mutation UpdateStay(
    $input: UpdateStayInput!
    $condition: ModelStayConditionInput
  ) {
    updateStay(input: $input, condition: $condition) {
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
export const deleteStay = /* GraphQL */ `
  mutation DeleteStay(
    $input: DeleteStayInput!
    $condition: ModelStayConditionInput
  ) {
    deleteStay(input: $input, condition: $condition) {
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
export const createApplication = /* GraphQL */ `
  mutation CreateApplication(
    $input: CreateApplicationInput!
    $condition: ModelApplicationConditionInput
  ) {
    createApplication(input: $input, condition: $condition) {
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
export const updateApplication = /* GraphQL */ `
  mutation UpdateApplication(
    $input: UpdateApplicationInput!
    $condition: ModelApplicationConditionInput
  ) {
    updateApplication(input: $input, condition: $condition) {
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
export const deleteApplication = /* GraphQL */ `
  mutation DeleteApplication(
    $input: DeleteApplicationInput!
    $condition: ModelApplicationConditionInput
  ) {
    deleteApplication(input: $input, condition: $condition) {
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
export const createApplicationSearchRecord = /* GraphQL */ `
  mutation CreateApplicationSearchRecord(
    $input: CreateApplicationSearchRecordInput!
    $condition: ModelApplicationSearchRecordConditionInput
  ) {
    createApplicationSearchRecord(input: $input, condition: $condition) {
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
export const updateApplicationSearchRecord = /* GraphQL */ `
  mutation UpdateApplicationSearchRecord(
    $input: UpdateApplicationSearchRecordInput!
    $condition: ModelApplicationSearchRecordConditionInput
  ) {
    updateApplicationSearchRecord(input: $input, condition: $condition) {
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
export const deleteApplicationSearchRecord = /* GraphQL */ `
  mutation DeleteApplicationSearchRecord(
    $input: DeleteApplicationSearchRecordInput!
    $condition: ModelApplicationSearchRecordConditionInput
  ) {
    deleteApplicationSearchRecord(input: $input, condition: $condition) {
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
export const createStaySearchRecord = /* GraphQL */ `
  mutation CreateStaySearchRecord(
    $input: CreateStaySearchRecordInput!
    $condition: ModelStaySearchRecordConditionInput
  ) {
    createStaySearchRecord(input: $input, condition: $condition) {
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
export const updateStaySearchRecord = /* GraphQL */ `
  mutation UpdateStaySearchRecord(
    $input: UpdateStaySearchRecordInput!
    $condition: ModelStaySearchRecordConditionInput
  ) {
    updateStaySearchRecord(input: $input, condition: $condition) {
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
export const deleteStaySearchRecord = /* GraphQL */ `
  mutation DeleteStaySearchRecord(
    $input: DeleteStaySearchRecordInput!
    $condition: ModelStaySearchRecordConditionInput
  ) {
    deleteStaySearchRecord(input: $input, condition: $condition) {
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
