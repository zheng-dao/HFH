import { Application } from '@src/models';

export const shouldCreateNoteAboutAdminChange = (
  application: Application,
  isAdministrator: boolean
) => {
  return isAdministrator && !(application.AffiliationID == null || application.AffiliationID == '');
};
