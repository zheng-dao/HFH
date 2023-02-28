export const mapEnumValue = (value) => {
  switch (value) {
    case 'FISHERHOUSE':
      return 'Fisher House';

    case 'BASE':
      return 'Base';

    case 'MEDICALCENTER':
      return 'Medical Center';

    case 'ORGANIZATION':
      return 'Organization';

    case 'AIRFORCE':
      return 'Air Force';

    case 'NAVY':
      return 'Navy';

    case 'MARINES':
      return 'Marines';

    case 'COASTGUARD':
      return 'Coast Guard';

    case 'ARMY':
      return 'Army';

    case 'ACTIVEDUTY':
      return 'Active Duty';

    case 'NATIONALGUARD':
      return 'National Guard';

    case 'RESERVE':
      return 'Reserve';

    case 'VETERAN':
      return 'Veteran';

    case 'AUNT':
      return 'Aunt';

    case 'BOYFRIEND':
      return 'Boyfriend';

    case 'BROTHER':
      return 'Brother';

    case 'BROTHERINLAW':
      return 'Brother-in-law';

    case 'CAREGIVER':
      return 'Caregiver';

    case 'COUSIN':
      return 'Cousin';

    case 'DAUGHTER':
      return 'Daughter';

    case 'DAUGHTERINLAW':
      return 'Daughter-in-law';

    case 'EXHUSBAND':
      return 'Ex-husband';

    case 'EXWIFE':
      return 'Ex-wife';

    case 'FATHER':
      return 'Father';

    case 'FATHERINLAW':
      return 'Father-in-law';

    case 'FIANCE':
      return 'Fiance';

    case 'FIANCEE':
      return 'Fiancee';

    case 'FRIEND':
      return 'Friend';

    case 'GIRLFRIEND':
      return 'Girlfriend';

    case 'GRANDCHILD':
      return 'Grandchild';

    case 'GRANDFATHER':
      return 'Grandfather';

    case 'GRANDMOTHER':
      return 'Grandmother';

    case 'HUSBAND':
      return 'Husband';

    case 'MOTHER':
      return 'Mother';

    case 'MOTHERINLAW':
      return 'Mother-in-law';

    case 'NEPHEW':
      return 'Nephew';

    case 'NIECE':
      return 'Niece';

    case 'NONMEDICALASSISTANT':
      return 'Non-medical Assistant';

    case 'SELF':
      return 'Self';

    case 'SISTER':
      return 'Sister';

    case 'SISTERINLAW':
      return 'Sister-in-law';

    case 'SON':
      return 'Son';

    case 'STEPDAUGHTER':
      return 'Step-daughter';

    case 'STEPSON':
      return 'Step-son';

    case 'UNCLE':
      return 'Uncle';

    case 'WIFE':
      return 'Wife';

    case 'KING1':
      return '1 King Bed';

    case 'QUEEN2':
      return '2 Queen Beds';

    case 'DOUBLE2':
      return '2 Double Beds';

    case 'OTHER':
      return 'Other';

    case 'HEARINGACCESSIBLE':
      return 'Hearing Accessible';

    case 'NEARANELEVATOR':
      return 'Near an Elevator';

    case 'LOWERFLOOR':
      return 'Lower Floor';

    case 'ROLLINSHOWER':
      return 'Roll-in Shower';

    case 'MOBILITYACCESSIBLE':
      return 'Mobility Accessible';

    case 'NEW_APPLICATION':
      return 'New Application';

    case 'REQUEST_INITIAL_STAY':
      return 'Request Initial Stay';

    case 'REQUEST_EXCEPTION':
      return 'Request Exception';

    case 'REQUEST_EXTENDED_STAY':
      return 'Request Extended Stay';

    case 'COMPLETE_INITIAL_STAY':
      return 'Complete Initial Stay';

    case 'COMPLETE_EXTENDED_STAY':
      return 'Complete Extended Stay';

    case 'CHANGE_MANAGER':
      return 'Change Liaison';

    case 'ADD_NOTE':
      return 'Add Note';

    case 'REQUEST':
      return 'Request';

    case 'RETURN':
      return 'Return';

    case 'DECLINE':
      return 'Decline';

    case 'APPROVE':
      return 'Approve Initial Stay';

    case 'COMPLETE':
      return 'Complete Initial Stay';

    case 'REVIEWED':
      return 'Reviewed';

    case 'UNREVIEWED':
      return 'Unreviewed';

    case 'CLOSE':
      return 'Close';

    case 'CHANGE_ADMIN':
      return 'Change Admin';

    case 'CHANGE_DATA':
      return 'Change Data';

    case 'REGRESS':
      return 'Regress Initial Stay';

    case 'true':
      return 'Yes';

    case 'false':
      return 'No';

    case 'READ':
      return 'Read';

    case 'UNREAD':
      return 'Unread';

    case 'APPROVE_EXTENDED_STAY':
      return 'Approve Extended Stay';

    case 'REGRESS_EXTENDED_STAY':
      return 'Regress Extended Stay';

    case 'ADD_GROUP':
      return 'Add Group';

    case 'REMOVE_GROUP':
      return 'Remove Group';

    default:
      if (typeof value == 'string') {
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      }
      return value;
  }
};
