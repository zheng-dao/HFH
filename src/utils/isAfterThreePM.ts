import { utcToZonedTime } from 'date-fns-tz';

const isAfterThreePM = (dateToCheck: Date): boolean => {
  const dateToCheckInNewYorkTime = utcToZonedTime(dateToCheck, 'America/New_York');

  return dateToCheckInNewYorkTime.getHours() >= 15;
};

export default isAfterThreePM;
