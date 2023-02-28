import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import HFHLogo from '@public/img/hfh_logo.svg';
import humanName from '@utils/humanName';
import { mapEnumValue } from '@utils/mapEnumValue';
import format from 'date-fns/format';
import { makeTimezoneAwareDate } from '@utils/makeTimezoneAwareDate';
import ApplicationSummary from './ApplicationSummary';
import styles from './Stylesheet';
import calculateNumberOfNights from '@utils/calculateNumberOfNights';
import { ROOMTYPE } from '@src/API';

const ItineraryPdf = (props) => {
  if (props.stay == null) {
    // return null;
  }

  const reservationSummary = [
    {
      title: 'Guest(s)',
      value: props.application?.PrimaryGuest.items.map((item) => humanName(item)).join() + ((props.application?.AdditionalGuests.items && props.application?.AdditionalGuests.items.length > 0) ? ', ' : '') + props.application?.AdditionalGuests.items.map((item) => humanName(item)).join(', '),
    },
    {
      title: 'Check-in',
      value: props.stay.requested_check_in ? format(makeTimezoneAwareDate(props.stay.requested_check_in), 'MM/dd/yyyy') : ''
    },
    {
      title: 'Check-out',
      value: props.stay.requested_check_out ? format(makeTimezoneAwareDate(props.stay.requested_check_out), 'MM/dd/yyyy') : ''
    },
    {
      title: 'Room',
      value: props.stay.room_type_actual === ROOMTYPE.OTHER ? props.stay.room_description_actual : mapEnumValue(props.stay.room_type_actual),
    },
    {
      title: 'Total Nights',
      value:
        props.stay.requested_check_in && props.stay.requested_check_out
          ? calculateNumberOfNights(props.stay.requested_check_in, props.stay.requested_check_out)
          : 'Unknown',
    },
  ];

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.headerSection}>
          <View style={styles.hotelLogo}>
            <Image
              src="https://resources.fisherhouse.org/assets/hfh_logo.jpg"
              alt="Hotels for Heros Logo"
            />
          </View>
        </View>
        <View style={styles.page}>
          <View style={styles.headerBreakLine}></View>
          <View style={styles.hotelInfoContainer}>
            <View style={styles.hotelInfos}>
              {
                props.hotelLogo && <Image style={styles.footerLogo} src={props.hotelLogo} alt="Hotel Brand Logo" />
              }
            </View>

            <View style={styles.hotelInfo}>
              <Text>{props.stay.HotelBooked.name}</Text>
              <Text>{props.stay.HotelBooked.address}</Text>
              <Text>{props.stay.HotelBooked.address_2}</Text>
              <Text>{props.stay.HotelBooked.city}, {props.stay.HotelBooked.state}, {props.stay.HotelBooked.zip}</Text>
              <Text>{props.stay.HotelBooked.telephone}{props.stay.HotelBooked.extension ? ' x' + props.stay.HotelBooked.extension : ''}</Text>
            </View>

          </View>
          <Text style={[styles.strong, { fontSize: '20pt', paddingBottom: '10pt' }]}>
            Confirmation Number: <Text style={styles.confirmationNumberNumber}>{props.stay.confirmation_number}</Text>
          </Text>
          <ApplicationSummary
            sectionTitle="Reservation Information"
            listItems={reservationSummary}
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerDescription}>Guests are responsible for incidentals and additional charges beyond the cost of the room.
            {'\n'}Hotels will require a credit card on file as standard policy upon check-in.</Text>
          <Text style={styles.hotelInfo}>
            Program of Fisher House Foundation
          </Text>
          <Image
            style={styles.footerLogos}
            src='https://resources.fisherhouse.org/assets/fhf_email.png'
            alt="Hotels for Heros Logo"
          />
        </View>
      </Page>
    </Document >
  );
};

export default ItineraryPdf;
