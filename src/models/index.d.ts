import { ModelInit, MutableModel, PersistentModelConstructor } from '@aws-amplify/datastore';

export enum Staytype {
  INITIAL = 'INITIAL',
  EXTENDED = 'EXTENDED',
}

export enum Paymenttypestatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum Paymenttypetype {
  SYSTEM = 'SYSTEM',
  USERGENERATED = 'USERGENERATED',
}

export enum Staystatus {
  DRAFT = 'DRAFT',
  RETURNED = 'RETURNED',
  REQUESTED = 'REQUESTED',
  EXCEPTION = 'EXCEPTION',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  COMPLETED = 'COMPLETED',
  REVIEWED = 'REVIEWED',
  CLOSED = 'CLOSED',
}

export enum Roomtype {
  KING1 = 'KING1',
  QUEEN2 = 'QUEEN2',
  DOUBLE2 = 'DOUBLE2',
  OTHER = 'OTHER',
}

export enum Roomfeatures {
  HEARINGACCESSIBLE = 'HEARINGACCESSIBLE',
  ROLLINSHOWER = 'ROLLINSHOWER',
  NEARANELEVATOR = 'NEARANELEVATOR',
  MOBILITYACCESSIBLE = 'MOBILITYACCESSIBLE',
  LOWERFLOOR = 'LOWERFLOOR',
}

export enum Hotelpropertystatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  BLACKLISTED = 'BLACKLISTED',
}

export enum Affiliationtype {
  FISHERHOUSE = 'FISHERHOUSE',
  MEDICALCENTER = 'MEDICALCENTER',
  BASE = 'BASE',
  ORGANIZATION = 'ORGANIZATION',
}

export enum Affiliationstatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum Branchesofservice {
  AIRFORCE = 'AIRFORCE',
  COASTGUARD = 'COASTGUARD',
  NAVY = 'NAVY',
  ARMY = 'ARMY',
  MARINES = 'MARINES',
}

export enum Hotelchainstatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum Hotelbrandstatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum Applicationstatus {
  REQUESTED = 'REQUESTED',
  EXCEPTION = 'EXCEPTION',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  DRAFT = 'DRAFT',
  RETURNED = 'RETURNED',
  DECLINED = 'DECLINED',
  REVIEWED = 'REVIEWED',
  CLOSED = 'CLOSED',
}

export enum Timezone {
  EASTERN = 'EASTERN',
  CENTRAL = 'CENTRAL',
  MOUNTAIN = 'MOUNTAIN',
  PACIFIC = 'PACIFIC',
}

export enum Userstatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum Readstatus {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

export enum Relationshiptoservicemember {
  AUNT = 'AUNT',
  BOYFRIEND = 'BOYFRIEND',
  BROTHER = 'BROTHER',
  BROTHERINLAW = 'BROTHERINLAW',
  CAREGIVER = 'CAREGIVER',
  COUSIN = 'COUSIN',
  DAUGHTER = 'DAUGHTER',
  DAUGHTERINLAW = 'DAUGHTERINLAW',
  EXHUSBAND = 'EXHUSBAND',
  EXWIFE = 'EXWIFE',
  FATHER = 'FATHER',
  FATHERINLAW = 'FATHERINLAW',
  FIANCE = 'FIANCE',
  FIANCEE = 'FIANCEE',
  FRIEND = 'FRIEND',
  GIRLFRIEND = 'GIRLFRIEND',
  GRANDCHILD = 'GRANDCHILD',
  GRANDFATHER = 'GRANDFATHER',
  GRANDMOTHER = 'GRANDMOTHER',
  HUSBAND = 'HUSBAND',
  MOTHER = 'MOTHER',
  MOTHERINLAW = 'MOTHERINLAW',
  NEPHEW = 'NEPHEW',
  NIECE = 'NIECE',
  NONMEDICALASSISTANT = 'NONMEDICALASSISTANT',
  SELF = 'SELF',
  SISTER = 'SISTER',
  SISTERINLAW = 'SISTERINLAW',
  SON = 'SON',
  STEPDAUGHTER = 'STEPDAUGHTER',
  STEPSON = 'STEPSON',
  UNCLE = 'UNCLE',
  WIFE = 'WIFE',
}

export enum Servicememberstatus {
  ACTIVEDUTY = 'ACTIVEDUTY',
  RESERVE = 'RESERVE',
  NATIONALGUARD = 'NATIONALGUARD',
  VETERAN = 'VETERAN',
}

export enum Guesttype {
  PRIMARY = 'PRIMARY',
  ADDITIONAL = 'ADDITIONAL',
}

export enum Groupstatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum Noteaction {
  NEW_APPLICATION = 'NEW_APPLICATION',
  REQUEST_INITIAL_STAY = 'REQUEST_INITIAL_STAY',
  REQUEST_EXCEPTION = 'REQUEST_EXCEPTION',
  REQUEST_EXTENDED_STAY = 'REQUEST_EXTENDED_STAY',
  COMPLETE_INITIAL_STAY = 'COMPLETE_INITIAL_STAY',
  COMPLETE_EXTENDED_STAY = 'COMPLETE_EXTENDED_STAY',
  CHANGE_MANAGER = 'CHANGE_MANAGER',
  ADD_NOTE = 'ADD_NOTE',
  REQUEST = 'REQUEST',
  RETURN = 'RETURN',
  DECLINE = 'DECLINE',
  APPROVE = 'APPROVE',
  COMPLETE = 'COMPLETE',
  REVIEWED = 'REVIEWED',
  UNREVIEWED = 'UNREVIEWED',
  CLOSE = 'CLOSE',
  CHANGE_ADMIN = 'CHANGE_ADMIN',
  CHANGE_DATA = 'CHANGE_DATA',
  REGRESS = 'REGRESS',
  APPROVE_EXTENDED_STAY = 'APPROVE_EXTENDED_STAY',
  REGRESS_EXTENDED_STAY = 'REGRESS_EXTENDED_STAY',
  ADD_GROUP = 'ADD_GROUP',
  REMOVE_GROUP = 'REMOVE_GROUP',
}

export enum Cardtype {
  AMEX = 'AMEX',
  MASTERCARD = 'MASTERCARD',
  VISA = 'VISA',
}

export enum Cardstatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export declare class S3Object {
  readonly key: string;
  readonly user?: string | null;
  constructor(init: ModelInit<S3Object>);
}

type NoteMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type ApplicationMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type StayMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type PaymentTypeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type HotelPropertyMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type AffiliationMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type HotelChainMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type HotelBrandMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type PatientMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type ServiceMemberMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type GuestMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type ApplicantMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type GroupMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type ConfigurationSettingMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type CardMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type ApplicationSearchRecordMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type StaySearchRecordMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

export declare class Note {
  readonly id: string;
  readonly message: string;
  readonly timestamp: string;
  readonly remote_address: string;
  readonly Application: Application;
  readonly User: User;
  readonly action?: Noteaction | keyof typeof Noteaction | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly noteUserId: string;
  constructor(init: ModelInit<Note, NoteMetaData>);
  static copyOf(
    source: Note,
    mutator: (draft: MutableModel<Note, NoteMetaData>) => MutableModel<Note, NoteMetaData> | void
  ): Note;
}

export declare class Application {
  readonly id: string;
  readonly StaysInApplication?: (Stay | null)[] | null;
  readonly status?: Applicationstatus | keyof typeof Applicationstatus | null;
  readonly User?: User | null;
  readonly AssignedTo?: User | null;
  readonly liaison_read?: Readstatus | keyof typeof Readstatus | null;
  readonly admin_read?: Readstatus | keyof typeof Readstatus | null;
  readonly Patient?: Patient | null;
  readonly ServiceMember?: ServiceMember | null;
  readonly exception_narrative?: string | null;
  readonly Guests?: (Guest | null)[] | null;
  readonly liaison_terms_of_use_agreement?: boolean | null;
  readonly sm_terms_of_use_agreement?: boolean | null;
  readonly Applicant?: Applicant | null;
  readonly applicationGroupId?: string | null;
  readonly Group?: Group | null;
  readonly Notes?: (Note | null)[] | null;
  readonly AffiliationID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly applicationUserId?: string | null;
  readonly applicationAssignedToId?: string | null;
  readonly applicationPatientId?: string | null;
  readonly applicationServiceMemberId?: string | null;
  readonly applicationApplicantId?: string | null;
  constructor(init: ModelInit<Application, ApplicationMetaData>);
  static copyOf(
    source: Application,
    mutator: (
      draft: MutableModel<Application, ApplicationMetaData>
    ) => MutableModel<Application, ApplicationMetaData> | void
  ): Application;
}

export declare class Stay {
  readonly id: string;
  readonly applicationID?: string | null;
  readonly type?: Staytype | keyof typeof Staytype | null;
  readonly state?: string | null;
  readonly reservation_number?: string | null;
  readonly payment_type?: string | null;
  readonly PaymentTypeID?: string | null;
  readonly payment_method?: PaymentType | null;
  readonly payment_points_used?: string | null;
  readonly payment_cost_of_reservation?: string | null;
  readonly checkout_points_used?: string | null;
  readonly checkout_cost_of_reservation?: string | null;
  readonly requested_check_in?: string | null;
  readonly requested_check_out?: string | null;
  readonly status?: Staystatus | keyof typeof Staystatus | null;
  readonly actual_check_in?: string | null;
  readonly actual_check_out?: string | null;
  readonly guest_stayed_at_hotel?: boolean | null;
  readonly reason_guest_did_not_stay?: string | null;
  readonly payment_incidental_cost?: string | null;
  readonly charge_type?: string | null;
  readonly card?: string | null;
  readonly note?: string | null;
  readonly reconciled?: boolean | null;
  readonly ready_for_final_reconcile?: boolean | null;
  readonly comment?: string | null;
  readonly comparable_cost?: string | null;
  readonly certificate_number?: string | null;
  readonly confirmation_number?: string | null;
  readonly card_used_for_incidentals?: boolean | null;
  readonly room_type_requests?: Roomtype | keyof typeof Roomtype | null;
  readonly room_feature_requests?: (Roomfeatures | null)[] | keyof typeof Roomfeatures | null;
  readonly room_type_actual?: Roomtype | keyof typeof Roomtype | null;
  readonly room_feature_actual?: (Roomfeatures | null)[] | keyof typeof Roomfeatures | null;
  readonly room_description?: string | null;
  readonly room_description_actual?: string | null;
  readonly reason_decline?: string | null;
  readonly reason_return?: string | null;
  readonly charge_reconcile?: boolean | null;
  readonly hotel_reconcile?: boolean | null;
  readonly points_reconcile?: boolean | null;
  readonly giftcard_reconcile?: boolean | null;
  readonly batch_no?: string | null;
  readonly city?: string | null;
  readonly HotelPropertyID?: string | null;
  readonly HotelBooked?: HotelProperty | null;
  readonly Application?: Application | null;
  readonly FisherHouse?: Affiliation | null;
  readonly narrative?: string | null;
  readonly special_requests?: string | null;
  readonly hotel_files?: (S3Object | null)[] | null;
  readonly notified_about_checkout?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly stayFisherHouseId?: string | null;
  constructor(init: ModelInit<Stay, StayMetaData>);
  static copyOf(
    source: Stay,
    mutator: (draft: MutableModel<Stay, StayMetaData>) => MutableModel<Stay, StayMetaData> | void
  ): Stay;
}

export declare class PaymentType {
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly status?: Paymenttypestatus | keyof typeof Paymenttypestatus | null;
  readonly type?: Paymenttypetype | keyof typeof Paymenttypetype | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<PaymentType, PaymentTypeMetaData>);
  static copyOf(
    source: PaymentType,
    mutator: (
      draft: MutableModel<PaymentType, PaymentTypeMetaData>
    ) => MutableModel<PaymentType, PaymentTypeMetaData> | void
  ): PaymentType;
}

export declare class HotelProperty {
  readonly id: string;
  readonly name: string;
  readonly address?: string | null;
  readonly address_2?: string | null;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly zip?: string | null;
  readonly contact_name?: string | null;
  readonly contact_position?: string | null;
  readonly telephone?: string | null;
  readonly email?: string | null;
  readonly is_blacklist?: boolean | null;
  readonly status?: Hotelpropertystatus | keyof typeof Hotelpropertystatus | null;
  readonly extension?: string | null;
  readonly FisherHouseID?: string | null;
  readonly HotelChainID?: string | null;
  readonly HotelBrandID?: string | null;
  readonly FisherHouse?: Affiliation | null;
  readonly HotelChain?: HotelChain | null;
  readonly HotelBrand?: HotelBrand | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<HotelProperty, HotelPropertyMetaData>);
  static copyOf(
    source: HotelProperty,
    mutator: (
      draft: MutableModel<HotelProperty, HotelPropertyMetaData>
    ) => MutableModel<HotelProperty, HotelPropertyMetaData> | void
  ): HotelProperty;
}

export declare class Affiliation {
  readonly id: string;
  readonly name?: string | null;
  readonly type: Affiliationtype | keyof typeof Affiliationtype;
  readonly status: Affiliationstatus | keyof typeof Affiliationstatus;
  readonly display_name?: string | null;
  readonly address?: string | null;
  readonly address_2?: string | null;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly zip?: string | null;
  readonly branch?: Branchesofservice | keyof typeof Branchesofservice | null;
  readonly AssociatedAffiliation?: Affiliation | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly affiliationAssociatedAffiliationId?: string | null;
  constructor(init: ModelInit<Affiliation, AffiliationMetaData>);
  static copyOf(
    source: Affiliation,
    mutator: (
      draft: MutableModel<Affiliation, AffiliationMetaData>
    ) => MutableModel<Affiliation, AffiliationMetaData> | void
  ): Affiliation;
}

export declare class HotelChain {
  readonly id: string;
  readonly name: string;
  readonly status?: Hotelchainstatus | keyof typeof Hotelchainstatus | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<HotelChain, HotelChainMetaData>);
  static copyOf(
    source: HotelChain,
    mutator: (
      draft: MutableModel<HotelChain, HotelChainMetaData>
    ) => MutableModel<HotelChain, HotelChainMetaData> | void
  ): HotelChain;
}

export declare class HotelBrand {
  readonly id: string;
  readonly name: string;
  readonly status?: Hotelbrandstatus | keyof typeof Hotelbrandstatus | null;
  readonly HotelChain?: HotelChain | null;
  readonly logo?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly hotelBrandHotelChainId?: string | null;
  constructor(init: ModelInit<HotelBrand, HotelBrandMetaData>);
  static copyOf(
    source: HotelBrand,
    mutator: (
      draft: MutableModel<HotelBrand, HotelBrandMetaData>
    ) => MutableModel<HotelBrand, HotelBrandMetaData> | void
  ): HotelBrand;
}

export declare class User {
  readonly id: string;
  readonly username?: string | null;
  readonly first_name?: string | null;
  readonly last_name?: string | null;
  readonly middle_initial?: string | null;
  readonly telephone?: string | null;
  readonly signature?: string | null;
  readonly job?: string | null;
  readonly admin_approval?: boolean | null;
  readonly expiration_date?: string | null;
  readonly extension?: string | null;
  readonly affiliation?: string | null;
  readonly timezone?: Timezone | keyof typeof Timezone | null;
  readonly observes_dst?: string | null;
  readonly receive_emails?: boolean | null;
  readonly status?: Userstatus | keyof typeof Userstatus | null;
  readonly AffiliationID?: string | null;
  readonly Affiliation?: Affiliation | null;
  readonly affiliation_type?: Affiliationtype | keyof typeof Affiliationtype | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(
    source: User,
    mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void
  ): User;
}

export declare class Patient {
  readonly id: string;
  readonly first_name?: string | null;
  readonly middle_initial?: string | null;
  readonly last_name?: string | null;
  readonly relationship?:
    | Relationshiptoservicemember
    | keyof typeof Relationshiptoservicemember
    | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Patient, PatientMetaData>);
  static copyOf(
    source: Patient,
    mutator: (
      draft: MutableModel<Patient, PatientMetaData>
    ) => MutableModel<Patient, PatientMetaData> | void
  ): Patient;
}

export declare class ServiceMember {
  readonly id: string;
  readonly first_name?: string | null;
  readonly middle_initial?: string | null;
  readonly last_name?: string | null;
  readonly email?: string | null;
  readonly telephone?: string | null;
  readonly extension?: string | null;
  readonly branch_of_service?: Branchesofservice | keyof typeof Branchesofservice | null;
  readonly current_status?: Servicememberstatus | keyof typeof Servicememberstatus | null;
  readonly on_military_travel_orders?: boolean | null;
  readonly other_patient?: boolean | null;
  readonly lodging_explanation?: string | null;
  readonly unidentified_explanation?: string | null;
  readonly BaseAssignedTo?: Affiliation | null;
  readonly TreatmentFacility?: Affiliation | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly serviceMemberBaseAssignedToId?: string | null;
  readonly serviceMemberTreatmentFacilityId?: string | null;
  constructor(init: ModelInit<ServiceMember, ServiceMemberMetaData>);
  static copyOf(
    source: ServiceMember,
    mutator: (
      draft: MutableModel<ServiceMember, ServiceMemberMetaData>
    ) => MutableModel<ServiceMember, ServiceMemberMetaData> | void
  ): ServiceMember;
}

export declare class Guest {
  readonly id: string;
  readonly first_name?: string | null;
  readonly relationship?: string | null;
  readonly middle_initial?: string | null;
  readonly last_name?: string | null;
  readonly email?: string | null;
  readonly telephone?: string | null;
  readonly extension?: string | null;
  readonly applicationID?: string | null;
  readonly type?: Guesttype | keyof typeof Guesttype | null;
  readonly under_age_three?: boolean | null;
  readonly address?: string | null;
  readonly address_2?: string | null;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly zip?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Guest, GuestMetaData>);
  static copyOf(
    source: Guest,
    mutator: (
      draft: MutableModel<Guest, GuestMetaData>
    ) => MutableModel<Guest, GuestMetaData> | void
  ): Guest;
}

export declare class Applicant {
  readonly id: string;
  readonly first_name?: string | null;
  readonly last_name?: string | null;
  readonly email?: string | null;
  readonly telephone?: string | null;
  readonly signature?: string | null;
  readonly job?: string | null;
  readonly branch_of_service?: string | null;
  readonly current_status?: string | null;
  readonly base_assigned_to?: string | null;
  readonly relation_to_service_member?: string | null;
  readonly referrer_date?: string | null;
  readonly user_type?: string | null;
  readonly middle_initial?: string | null;
  readonly patient_type?: string | null;
  readonly extension?: string | null;
  readonly family_lodge?: string | null;
  readonly location_name?: string | null;
  readonly location_address?: string | null;
  readonly lodging_explanation?: string | null;
  readonly Affiliation?: Affiliation | null;
  readonly affiliation_type?: Affiliationtype | keyof typeof Affiliationtype | null;
  readonly collected_outside_fisherhouse?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly applicantAffiliationId?: string | null;
  constructor(init: ModelInit<Applicant, ApplicantMetaData>);
  static copyOf(
    source: Applicant,
    mutator: (
      draft: MutableModel<Applicant, ApplicantMetaData>
    ) => MutableModel<Applicant, ApplicantMetaData> | void
  ): Applicant;
}

export declare class Group {
  readonly id: string;
  readonly name: string;
  readonly status: Groupstatus | keyof typeof Groupstatus;
  readonly creator?: User | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly groupCreatorId?: string | null;
  constructor(init: ModelInit<Group, GroupMetaData>);
  static copyOf(
    source: Group,
    mutator: (
      draft: MutableModel<Group, GroupMetaData>
    ) => MutableModel<Group, GroupMetaData> | void
  ): Group;
}

export declare class ConfigurationSetting {
  readonly id: string;
  readonly name?: string | null;
  readonly value?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ConfigurationSetting, ConfigurationSettingMetaData>);
  static copyOf(
    source: ConfigurationSetting,
    mutator: (
      draft: MutableModel<ConfigurationSetting, ConfigurationSettingMetaData>
    ) => MutableModel<ConfigurationSetting, ConfigurationSettingMetaData> | void
  ): ConfigurationSetting;
}

export declare class Card {
  readonly id: string;
  readonly name?: string | null;
  readonly number?: string | null;
  readonly status?: Cardstatus | keyof typeof Cardstatus | null;
  readonly type?: Cardtype | keyof typeof Cardtype | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Card, CardMetaData>);
  static copyOf(
    source: Card,
    mutator: (draft: MutableModel<Card, CardMetaData>) => MutableModel<Card, CardMetaData> | void
  ): Card;
}

export declare class ApplicationSearchRecord {
  readonly id: string;
  readonly applicationID: string;
  readonly Application?: Application | null;
  readonly applicationStatus?: Applicationstatus | keyof typeof Applicationstatus | null;
  readonly staysStatus?: (Staystatus | null)[] | keyof typeof Staystatus | null;
  readonly checkInDates?: (string | null)[] | null;
  readonly checkOutDates?: (string | null)[] | null;
  readonly primaryCheckInDate?: string | null;
  readonly primaryCheckOutDate?: string | null;
  readonly noteActions?: (string | null)[] | null;
  readonly assignedAdminID?: string | null;
  readonly assignedAdminName?: string | null;
  readonly assignedLiaisonID?: string | null;
  readonly assignedLiaisonName?: string | null;
  readonly groupID?: string | null;
  readonly groupName?: string | null;
  readonly confirmationNumber?: (string | null)[] | null;
  readonly referrerName?: string | null;
  readonly referrerEmail?: string | null;
  readonly serviceMemberName?: string | null;
  readonly serviceMemberFirstName?: string | null;
  readonly serviceMemberLastName?: string | null;
  readonly serviceMemberEmail?: string | null;
  readonly serviceMemberBranchOfService?: string | null;
  readonly serviceMemberDutyStatus?: string | null;
  readonly adminIsUnread?: boolean | null;
  readonly liaisonIsUnread?: boolean | null;
  readonly guestFirstNames?: (string | null)[] | null;
  readonly guestLastNames?: (string | null)[] | null;
  readonly guestEmails?: (string | null)[] | null;
  readonly liaisonAffiliationID?: string | null;
  readonly liaisonAffiliationName?: string | null;
  readonly referrerAffiliationID?: string | null;
  readonly referrerAffiliationName?: string | null;
  readonly adminAffiliationID?: string | null;
  readonly adminAffiliationName?: string | null;
  readonly treatmentCenterID?: string | null;
  readonly treatmentCenterName?: string | null;
  readonly baseAssignedID?: string | null;
  readonly baseAssignedName?: string | null;
  readonly vaAssignedID?: string | null;
  readonly vaAssignedName?: string | null;
  readonly hotelChainID?: (string | null)[] | null;
  readonly hotelChainName?: (string | null)[] | null;
  readonly hotelBrandID?: (string | null)[] | null;
  readonly hotelBrandName?: (string | null)[] | null;
  readonly hotelPropertyName?: string | null;
  readonly assignedAffiliationID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ApplicationSearchRecord, ApplicationSearchRecordMetaData>);
  static copyOf(
    source: ApplicationSearchRecord,
    mutator: (
      draft: MutableModel<ApplicationSearchRecord, ApplicationSearchRecordMetaData>
    ) => MutableModel<ApplicationSearchRecord, ApplicationSearchRecordMetaData> | void
  ): ApplicationSearchRecord;
}

export declare class StaySearchRecord {
  readonly id: string;
  readonly applicationID: string;
  readonly stayID: string;
  readonly Application?: Application | null;
  readonly Stay?: Stay | null;
  readonly applicationStatus?: Applicationstatus | keyof typeof Applicationstatus | null;
  readonly staysStatus?: Staystatus | keyof typeof Staystatus | null;
  readonly checkInDates?: string | null;
  readonly checkOutDates?: string | null;
  readonly primaryCheckInDate?: string | null;
  readonly primaryCheckOutDate?: string | null;
  readonly noteActions?: (string | null)[] | null;
  readonly assignedAdminID?: string | null;
  readonly assignedAdminName?: string | null;
  readonly assignedLiaisonID?: string | null;
  readonly assignedLiaisonName?: string | null;
  readonly groupID?: string | null;
  readonly groupName?: string | null;
  readonly confirmationNumber?: string | null;
  readonly referrerName?: string | null;
  readonly referrerEmail?: string | null;
  readonly serviceMemberName?: string | null;
  readonly serviceMemberEmail?: string | null;
  readonly serviceMemberBranchOfService?: string | null;
  readonly serviceMemberDutyStatus?: string | null;
  readonly adminIsUnread?: boolean | null;
  readonly liaisonIsUnread?: boolean | null;
  readonly guestNames?: (string | null)[] | null;
  readonly guestEmails?: (string | null)[] | null;
  readonly liaisonAffiliationID?: string | null;
  readonly liaisonAffiliationName?: string | null;
  readonly referrerAffiliationID?: string | null;
  readonly referrerAffiliationName?: string | null;
  readonly adminAffiliationID?: string | null;
  readonly adminAffiliationName?: string | null;
  readonly treatmentCenterID?: string | null;
  readonly treatmentCenterName?: string | null;
  readonly baseAssignedID?: string | null;
  readonly baseAssignedName?: string | null;
  readonly vaAssignedID?: string | null;
  readonly vaAssignedName?: string | null;
  readonly hotelChainID?: (string | null)[] | null;
  readonly hotelChainName?: (string | null)[] | null;
  readonly hotelBrandID?: (string | null)[] | null;
  readonly hotelBrandName?: (string | null)[] | null;
  readonly hotelPropertyName?: string | null;
  readonly assignedAffiliationID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<StaySearchRecord, StaySearchRecordMetaData>);
  static copyOf(
    source: StaySearchRecord,
    mutator: (
      draft: MutableModel<StaySearchRecord, StaySearchRecordMetaData>
    ) => MutableModel<StaySearchRecord, StaySearchRecordMetaData> | void
  ): StaySearchRecord;
}
