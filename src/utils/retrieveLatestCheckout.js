import { format } from 'date-fns';
import { makeTimezoneAwareDate } from './makeTimezoneAwareDate';

const retrieveLatestCheckout = (stays) => {
  const checkoutDates = stays.map((item) => {
    return item.actual_check_out ?? item.requested_check_out;
  });
  const latestDate = new Date(
    Math.max(...checkoutDates.map((e) => (e ? makeTimezoneAwareDate(e) : '')))
  );
  if (latestDate.getTime() == 0) {
    return '';
  }
  try {
    const formattedDate = format(latestDate, 'MM/dd/yyyy');

    return formattedDate;
  } catch (e) {
    return '';
  }
};

export default retrieveLatestCheckout;
