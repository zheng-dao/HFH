import { makeTimezoneAwareDate } from '@utils/makeTimezoneAwareDate';

const calculateNumberOfNights = (start, end) => {
  const timezoneAwareStart = makeTimezoneAwareDate(start);
  const timezoneAwareEnd = makeTimezoneAwareDate(end);

  const timeDiff = Math.abs(timezoneAwareEnd.getTime() - timezoneAwareStart.getTime());

  const numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return numberOfNights;
};

export default calculateNumberOfNights;
