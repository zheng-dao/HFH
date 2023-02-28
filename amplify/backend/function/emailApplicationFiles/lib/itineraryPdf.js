// TODO: itinerary pdf

import React from 'react';
import ReactPDF, { Image, Text, Document, Page, View } from '@react-pdf/renderer';
import styles from './Stylesheet';
import ApplicationSummary from './ApplicationSummary';
import humanName from './humanName';
import mapEnumValue from './mapEnumValue';
import tmp from 'tmp';
import fs from 'node:fs';

const handler = async (app) => {
  const reservationSummary = [
    {
      title: 'Guest(s)',
      value:
        app.application?.PrimaryGuest.items.map((item) => humanName(item)).join() +
        ',' +
        app.application?.AdditionalGuests.items.map((item) => humanName(item)).join(),
    },
    {
      title: 'Check-in',
      value: app.stay.requested_check_in,
    },
    {
      title: 'Check-out',
      value: app.stay.requested_check_out,
    },
    {
      title: 'Room',
      value:
        app.stay.room_type_actual === 'OTHER'
          ? app.stay.room_description_actual
          : mapEnumValue(app.stay.room_type_actual),
    },
    {
      title: 'Total Nights',
      value:
        app.stay.requested_check_in && app.stay.requested_check_out
          ? calculateNumberOfNights(app.stay.requested_check_in, app.stay.requested_check_out)
          : 'Unknown',
    },
  ];

  const fileName = tmp.tmpNameSync();

  const pdf = await ReactPDF.renderToFile(
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
                app.hotelLogo && <Image style={styles.footerLogo} src={app.hotelLogo} alt="Hotel Brand Logo" />
              }
            </View>

            <View style={styles.hotelInfo}>
              <Text>{app.stay.HotelBooked.name}</Text>
              <Text>{app.stay.HotelBooked.address}</Text>
              <Text>{app.stay.HotelBooked.address_2}</Text>
              <Text>{app.stay.HotelBooked.city}, {app.stay.HotelBooked.state}, {app.stay.HotelBooked.zip}</Text>
              <Text>{app.stay.HotelBooked.telephone}{app.stay.HotelBooked.extension ? ' x' + app.stay.HotelBooked.extension : ''}</Text>
            </View>

          </View>
          <Text style={[styles.strong, { fontSize: '20pt', paddingBottom: '10pt' }]}>
            Confirmation Number: <Text style={styles.confirmationNumberNumber}>{app.stay.confirmation_number}</Text>
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
    </Document>,
    fileName
  );

  return fs.readFileSync(fileName, { encoding: 'base64' });
};

export default handler;
