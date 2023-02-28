import { STAYSTATUS } from '@src/API';

export default function stayStatusOptions(currentStatus, isException) {
  const requestedOrException = isException ? STAYSTATUS.EXCEPTION : STAYSTATUS.REQUESTED;
  if (currentStatus == STAYSTATUS.APPROVED) {
    return {
      [requestedOrException]: requestedOrException,
    };
  } else if (currentStatus == STAYSTATUS.DECLINED) {
    return {
      [requestedOrException]: requestedOrException,
    };
  } else if (currentStatus == STAYSTATUS.COMPLETED) {
    return {
      [STAYSTATUS.APPROVED]: STAYSTATUS.APPROVED,
      [requestedOrException]: requestedOrException,
    };
  } else if (currentStatus == STAYSTATUS.REVIEWED) {
    return {
      [STAYSTATUS.COMPLETED]: STAYSTATUS.COMPLETED,
      [STAYSTATUS.APPROVED]: STAYSTATUS.APPROVED,
      [requestedOrException]: requestedOrException,
    };
  } else if (currentStatus == STAYSTATUS.CLOSED) {
    return {
      [STAYSTATUS.REVIEWED]: STAYSTATUS.REVIEWED,
      [STAYSTATUS.COMPLETED]: STAYSTATUS.COMPLETED,
      [STAYSTATUS.APPROVED]: STAYSTATUS.APPROVED,
      [requestedOrException]: requestedOrException,
    };
  }
  return {};
}
