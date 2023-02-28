import { format } from 'date-fns';
import { makeTimezoneAwareDate } from './makeTimezoneAwareDate';

const retrieveFirstCheckin = (stay) => {
  const initial_check_in = stay.actual_check_in
    ? stay.actual_check_in
    : stay.requested_check_in
    ? stay.requested_check_in
    : '';

  if (initial_check_in == '') {
    return '';
  }

  return format(makeTimezoneAwareDate(initial_check_in), 'MM/dd/yyyy');
};

export default retrieveFirstCheckin;
