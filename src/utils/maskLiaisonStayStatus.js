import { STAYSTATUS } from '@src/API';

const maskLiaisonStayStatus = (status) => {
  if ([STAYSTATUS.REVIEWED, STAYSTATUS.CLOSED].includes(status)) {
    return STAYSTATUS.COMPLETED;
  }
  return status;
};

export default maskLiaisonStayStatus;
