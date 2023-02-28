import { APPLICATIONSTATUS } from '@src/API';
import useAuth from '@contexts/AuthContext';

const EDITABLE_STATUS = [APPLICATIONSTATUS.DRAFT, APPLICATIONSTATUS.RETURNED];

export default function isGroupEditable(applications, liaisonCanEdit = false) {
  const { isAdministrator, profile } = useAuth();

  if (liaisonCanEdit) {
    if (applications && Array.isArray(applications)) {
      let filtered = applications.filter(application => application?.applicationUserId === profile?.id && profile?.id !== null);
      if (filtered.length === applications.length) {
        return true;
      }
    }
  }

  if (isAdministrator()) {
    // If this isn't the assigned admin, then they can't edit.
    if (applications && Array.isArray(applications)) {
      let filtered = applications.filter(application => application?.applicationAssignedToId === profile?.id && profile?.id !== null);
      if (filtered.length === applications.length) {
        return true;
      }
      return false;
    }

  } else {
    // If this isn't the assigned liaison, then they can't edit.
    // if (application?.applicationUserId !== profile?.id && profile?.id !== null) {
    //   return false;
    // }
    // return EDITABLE_STATUS.includes(application?.status);
    if (applications && Array.isArray(applications)) {
      let filtered = applications.filter(application => application?.applicationUserId === profile?.id && profile?.id !== null);
      let statusFiltered = applications.filter(application => EDITABLE_STATUS.includes(application?.status));
      if (filtered.length === applications.length && statusFiltered.length === applications.length) {
        return true;
      }
      return false;
    }
  }
}
