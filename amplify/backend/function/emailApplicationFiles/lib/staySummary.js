import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import ApplicationSummary from './ApplicationSummary';
import mapEnumValue from './mapEnumValue';
import { format } from 'date-fns';
import makeTimezoneAwareDate from './makeTimezoneAwareDate';
import styles from './Stylesheet';
import formatPhoneNumber from './formatPhoneNumber';
import maskLiaisonStayStatus from './maskLiaisonStayStatus';

const StaySummary = ({ stay, maskStayStatus }) => {
  let summaryBoxOne = [
    {
      title: 'Status',
      value: mapEnumValue(maskStayStatus ? maskLiaisonStayStatus(stay?.status) : stay?.status),
    },
    {
      title: 'Narrative',
      value: stay?.narrative,
    },
  ];
  let summaryBoxTwo = [
    {
      title: 'Reservation Number',
      value: stay?.confirmation_number,
    },
    {
      title: 'Hotel Chain',
      value: stay?.HotelBooked?.HotelChain?.name,
    },
    {
      title: 'Hotel Brand',
      value: stay?.HotelBooked?.HotelBrand?.name,
    },
    {
      title: 'Hotel Name',
      value: stay?.HotelBooked?.name,
    },
    {
      title: 'Hotel Address',
      value:
        (stay?.HotelBooked?.address || '') +
        ', ' +
        (stay?.HotelBooked?.address_2 || '') +
        ', ' +
        (stay?.HotelBooked?.city || '') +
        ', ' +
        (stay?.HotelBooked?.state || '') +
        ', ' +
        (stay?.HotelBooked?.zip || ''),
    },
    {
      title: 'Telephone',
      value: formatPhoneNumber(stay?.HotelBooked?.telephone, stay?.HotelBooked?.extension),
    },
  ];
  if (stay?.HotelBooked?.contact_name) {
    summaryBoxTwo.push({
      title: 'Contact Name',
      value: stay?.HotelBooked?.contact_name,
    });
  }
  if (stay?.HotelBooked?.contact_position) {
    summaryBoxTwo.push({
      title: 'Contact Position',
      value: stay?.HotelBooked?.contact_position,
    });
  }
  let summaryBoxThree = [
    {
      title: 'Actual Room Type',
      value: stay?.room_type_actual,
    },
  ];
  if (stay?.room_type_actual == 'OTHER') {
    summaryBoxThree.push({
      title: 'Actual Room Description',
      value: stay?.room_description_actual,
    });
  }
  let summaryBoxFour = [
    {
      title: 'Did the guest(s) stay at the hotel?',
      value: stay?.guest_stayed_at_hotel == null ? '' : stay?.guest_stayed_at_hotel ? 'Yes' : 'No',
    },
    {
      title: 'Requested Stay Dates',
      value:
        (stay?.requested_check_in
          ? format(makeTimezoneAwareDate(stay?.requested_check_in), 'yyyy-MM-dd')
          : '') +
        ' - ' +
        (stay?.requested_check_out
          ? format(makeTimezoneAwareDate(stay?.requested_check_out), 'yyyy-MM-dd')
          : ''),
    },
    {
      title: 'Actual Stay Dates',
      value:
        (stay?.actual_check_in
          ? format(makeTimezoneAwareDate(stay?.actual_check_in), 'yyyy-MM-dd')
          : '') +
        ' - ' +
        (stay?.actual_check_out
          ? format(makeTimezoneAwareDate(stay?.actual_check_out), 'yyyy-MM-dd')
          : ''),
    },
  ];
  const shouldShowReasonForChangeBox =
    (!stay?.guest_stayed_at_hotel && stay?.guest_stayed_at_hotel != null) ||
    (stay?.actual_check_in && stay?.actual_check_in != stay?.requested_check_in) ||
    (stay?.actual_check_out && stay?.actual_check_out != stay?.requested_check_out);
  if (shouldShowReasonForChangeBox) {
    summaryBoxFour.push({
      title: 'Reason for Change',
      value: stay?.reason_guest_did_not_stay,
    });
  }

  let reconciliationSummary = [
    {
      title: 'Hotel Documents',
      value: stay?.hotel_files
        ? stay.hotel_files
            .map((item) => {
              const parts = item.key.split('/');
              return parts.pop();
            })
            .join(', ')
        : '',
    },
    {
      title: 'Payment Used',
      value: stay?.payment_method?.name,
    },
  ];
  if (stay.payment_method?.name == 'Points') {
    reconciliationSummary.push(
      {
        title: 'Points Used',
        value: stay?.payment_points_used,
      },
      {
        title: 'Comparable Cost',
        value: stay?.comparable_cost,
      }
    );
  } else if (stay.payment_method?.type == 'USERGENERATED') {
    reconciliationSummary.push(
      {
        title: stay.payment_method.name + ' Details',
        value: stay.certificate_number,
      },
      {
        title: 'Comparable Cost',
        value: stay?.comparable_cost,
      }
    );
  }
  if (stay.payment_method?.name == 'Credit Card' || stay.card_used_for_incidentals) {
    reconciliationSummary.push(
      {
        title: 'Card',
        value: stay.card,
      },
      {
        title: 'Total Cost',
        value: stay.payment_cost_of_reservation,
      }
    );
  }

  const calculateStayDates = (localStay) => {
    let output = '(';
    if (localStay.actual_check_in) {
      output += format(makeTimezoneAwareDate(localStay.actual_check_in), 'yyyy-MM-dd');
    } else if (localStay.requested_check_in) {
      output += format(makeTimezoneAwareDate(localStay.requested_check_in), 'yyyy-MM-dd');
    } else {
      output += '';
    }
    output += ' - ';
    if (localStay.actual_check_out) {
      output += format(makeTimezoneAwareDate(localStay.actual_check_out), 'yyyy-MM-dd');
    } else if (localStay.requested_check_out) {
      output += format(makeTimezoneAwareDate(localStay.requested_check_out), 'yyyy-MM-dd');
    } else {
      output += '';
    }
    output += ')';
    return output;
  };

  const stayTitle = () => {
    let output = '';
    if (stay?.type == 'INITIAL') {
      output += 'Initial Stay ';
    } else {
      output += 'Extended Stay ';
    }
    output += calculateStayDates(stay);
    return output;
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>{stayTitle()}</Text>
      <ApplicationSummary sectionTitle="" listItems={summaryBoxOne} />
      <ApplicationSummary sectionTitle="" listItems={summaryBoxTwo} />
      <ApplicationSummary sectionTitle="" listItems={summaryBoxThree} />
      <ApplicationSummary sectionTitle="" listItems={summaryBoxFour} />
      <ApplicationSummary sectionTitle="Reconciliation" listItems={reconciliationSummary} />
    </View>
  );
};

StaySummary.defaultProps = {
  stay: {},
  maskStayStatus: false,
};

export default StaySummary;
