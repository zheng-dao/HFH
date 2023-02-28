// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Staytype = {
  INITIAL: 'INITIAL',
  EXTENDED: 'EXTENDED',
};

const Paymenttypestatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
};

const Paymenttypetype = {
  SYSTEM: 'SYSTEM',
  USERGENERATED: 'USERGENERATED',
};

const Staystatus = {
  DRAFT: 'DRAFT',
  RETURNED: 'RETURNED',
  REQUESTED: 'REQUESTED',
  EXCEPTION: 'EXCEPTION',
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
  COMPLETED: 'COMPLETED',
  REVIEWED: 'REVIEWED',
  CLOSED: 'CLOSED',
};

const Roomtype = {
  KING1: 'KING1',
  QUEEN2: 'QUEEN2',
  DOUBLE2: 'DOUBLE2',
  OTHER: 'OTHER',
};

const Roomfeatures = {
  HEARINGACCESSIBLE: 'HEARINGACCESSIBLE',
  ROLLINSHOWER: 'ROLLINSHOWER',
  NEARANELEVATOR: 'NEARANELEVATOR',
  MOBILITYACCESSIBLE: 'MOBILITYACCESSIBLE',
  LOWERFLOOR: 'LOWERFLOOR',
};

const Hotelpropertystatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
  BLACKLISTED: 'BLACKLISTED',
};

const Affiliationtype = {
  FISHERHOUSE: 'FISHERHOUSE',
  MEDICALCENTER: 'MEDICALCENTER',
  BASE: 'BASE',
  ORGANIZATION: 'ORGANIZATION',
};

const Affiliationstatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
};

const Branchesofservice = {
  AIRFORCE: 'AIRFORCE',
  COASTGUARD: 'COASTGUARD',
  NAVY: 'NAVY',
  ARMY: 'ARMY',
  MARINES: 'MARINES',
};

const Hotelchainstatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
};

const Hotelbrandstatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
};

const Applicationstatus = {
  REQUESTED: 'REQUESTED',
  EXCEPTION: 'EXCEPTION',
  APPROVED: 'APPROVED',
  COMPLETED: 'COMPLETED',
  DRAFT: 'DRAFT',
  RETURNED: 'RETURNED',
  DECLINED: 'DECLINED',
  REVIEWED: 'REVIEWED',
  CLOSED: 'CLOSED',
};

const Timezone = {
  EASTERN: 'EASTERN',
  CENTRAL: 'CENTRAL',
  MOUNTAIN: 'MOUNTAIN',
  PACIFIC: 'PACIFIC',
};

const Userstatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

const Readstatus = {
  READ: 'READ',
  UNREAD: 'UNREAD',
};

const Relationshiptoservicemember = {
  AUNT: 'AUNT',
  BOYFRIEND: 'BOYFRIEND',
  BROTHER: 'BROTHER',
  BROTHERINLAW: 'BROTHERINLAW',
  CAREGIVER: 'CAREGIVER',
  COUSIN: 'COUSIN',
  DAUGHTER: 'DAUGHTER',
  DAUGHTERINLAW: 'DAUGHTERINLAW',
  EXHUSBAND: 'EXHUSBAND',
  EXWIFE: 'EXWIFE',
  FATHER: 'FATHER',
  FATHERINLAW: 'FATHERINLAW',
  FIANCE: 'FIANCE',
  FIANCEE: 'FIANCEE',
  FRIEND: 'FRIEND',
  GIRLFRIEND: 'GIRLFRIEND',
  GRANDCHILD: 'GRANDCHILD',
  GRANDFATHER: 'GRANDFATHER',
  GRANDMOTHER: 'GRANDMOTHER',
  HUSBAND: 'HUSBAND',
  MOTHER: 'MOTHER',
  MOTHERINLAW: 'MOTHERINLAW',
  NEPHEW: 'NEPHEW',
  NIECE: 'NIECE',
  NONMEDICALASSISTANT: 'NONMEDICALASSISTANT',
  SELF: 'SELF',
  SISTER: 'SISTER',
  SISTERINLAW: 'SISTERINLAW',
  SON: 'SON',
  STEPDAUGHTER: 'STEPDAUGHTER',
  STEPSON: 'STEPSON',
  UNCLE: 'UNCLE',
  WIFE: 'WIFE',
};

const Servicememberstatus = {
  ACTIVEDUTY: 'ACTIVEDUTY',
  RESERVE: 'RESERVE',
  NATIONALGUARD: 'NATIONALGUARD',
  VETERAN: 'VETERAN',
};

const Guesttype = {
  PRIMARY: 'PRIMARY',
  ADDITIONAL: 'ADDITIONAL',
};

const Groupstatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
};

const Noteaction = {
  NEW_APPLICATION: 'NEW_APPLICATION',
  REQUEST_INITIAL_STAY: 'REQUEST_INITIAL_STAY',
  REQUEST_EXCEPTION: 'REQUEST_EXCEPTION',
  REQUEST_EXTENDED_STAY: 'REQUEST_EXTENDED_STAY',
  COMPLETE_INITIAL_STAY: 'COMPLETE_INITIAL_STAY',
  COMPLETE_EXTENDED_STAY: 'COMPLETE_EXTENDED_STAY',
  CHANGE_MANAGER: 'CHANGE_MANAGER',
  ADD_NOTE: 'ADD_NOTE',
  REQUEST: 'REQUEST',
  RETURN: 'RETURN',
  DECLINE: 'DECLINE',
  APPROVE: 'APPROVE',
  COMPLETE: 'COMPLETE',
  REVIEWED: 'REVIEWED',
  UNREVIEWED: 'UNREVIEWED',
  CLOSE: 'CLOSE',
  CHANGE_ADMIN: 'CHANGE_ADMIN',
  CHANGE_DATA: 'CHANGE_DATA',
  REGRESS: 'REGRESS',
  APPROVE_EXTENDED_STAY: 'APPROVE_EXTENDED_STAY',
  REGRESS_EXTENDED_STAY: 'REGRESS_EXTENDED_STAY',
  ADD_GROUP: 'ADD_GROUP',
  REMOVE_GROUP: 'REMOVE_GROUP',
};

const Cardtype = {
  AMEX: 'AMEX',
  MASTERCARD: 'MASTERCARD',
  VISA: 'VISA',
};

const Cardstatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
};

const {
  Note,
  Application,
  Stay,
  PaymentType,
  HotelProperty,
  Affiliation,
  HotelChain,
  HotelBrand,
  User,
  Patient,
  ServiceMember,
  Guest,
  Applicant,
  Group,
  ConfigurationSetting,
  Card,
  ApplicationSearchRecord,
  StaySearchRecord,
  S3Object,
} = initSchema(schema);

export {
  Note,
  Application,
  Stay,
  PaymentType,
  HotelProperty,
  Affiliation,
  HotelChain,
  HotelBrand,
  User,
  Patient,
  ServiceMember,
  Guest,
  Applicant,
  Group,
  ConfigurationSetting,
  Card,
  ApplicationSearchRecord,
  StaySearchRecord,
  Staytype,
  Paymenttypestatus,
  Paymenttypetype,
  Staystatus,
  Roomtype,
  Roomfeatures,
  Hotelpropertystatus,
  Affiliationtype,
  Affiliationstatus,
  Branchesofservice,
  Hotelchainstatus,
  Hotelbrandstatus,
  Applicationstatus,
  Timezone,
  Userstatus,
  Readstatus,
  Relationshiptoservicemember,
  Servicememberstatus,
  Guesttype,
  Groupstatus,
  Noteaction,
  Cardtype,
  Cardstatus,
  S3Object,
};
