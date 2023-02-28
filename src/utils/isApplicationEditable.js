import { APPLICATIONSTATUS } from '@src/API';
import useAuth from '@contexts/AuthContext';

const EDITABLE_STATUS = [APPLICATIONSTATUS.DRAFT, APPLICATIONSTATUS.RETURNED];

export default function isApplicationEditable(application, liaisonCanEdit = false) {
  const { isAdministrator, profile } = useAuth();

  if (liaisonCanEdit) {
    if (application?.applicationUserId == profile?.id && profile?.id != null) {
      return true;
    }
  }

  if (isAdministrator()) {
    // If this isn't the assigned admin, then they can't edit.
    if (application?.applicationAssignedToId == profile?.id && profile?.id != null) {
      return true;
    }
    return false;
  } else {
    // If this isn't the assigned liaison, then they can't edit.
    if (application?.applicationUserId != profile?.id && profile?.id != null) {
      return false;
    }
    return EDITABLE_STATUS.includes(application?.status);
  }
}
