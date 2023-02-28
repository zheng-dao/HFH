import { Fragment } from 'react';
import humanName from '@utils/humanName';
import makeUrlFriendlyAddress from '@utils/makeUrlFriendlyAddress';

export default function GuestDetails(props) {
  return (
    <Fragment>
      <h4>Guests</h4>
      <div className="detail-block">
        <p>
          <strong>Primary Guest:</strong>
          <br />
          {humanName(props.primaryGuest)} ({props.primaryGuest?.relationship})
          <br />
          {props.primaryGuest?.address && (
            <Fragment>
              {props.primaryGuest?.address}
              <br />
            </Fragment>
          )}
          {props.primaryGuest?.address_2 && (
            <Fragment>
              {props.primaryGuest?.address_2}
              <br />
            </Fragment>
          )}
          {props.primaryGuest?.city}, {props.primaryGuest?.state}, {props.primaryGuest?.zip}
          <br />
          <a
            href={
              'https://www.google.com/maps/dir/?api=1&origin=' +
              makeUrlFriendlyAddress(props.primaryGuest) +
              '&destination=' +
              makeUrlFriendlyAddress(props.treatmentFacility)
            }
            target="_blank"
            rel="noreferrer"
          >
            Show Distance in Google Maps
          </a>
        </p>
        {props.additionalGuests.length > 0 && (
          <p>
            <strong>Additional Guests:</strong>
            <br />
            {props.additionalGuests
              .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
              .map((item) => {
                return (
                  <Fragment key={item.id}>
                    {humanName(item) +
                      ' (' +
                      item.relationship +
                      ')' +
                      (item.under_age_three == true ? ', Age Under 3' : '')}
                    <br />
                  </Fragment>
                );
              })}
          </p>
        )}
      </div>
    </Fragment>
  );
}

GuestDetails.defaultProps = {
  primaryGuest: null,
  additionalGuests: [],
  treatmentFacility: null,
};
