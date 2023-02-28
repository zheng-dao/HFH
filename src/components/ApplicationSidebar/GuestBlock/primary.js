import { Fragment } from 'react';
import humanName from '@utils/humanName';
import formatPhoneNumber from '@utils/formatPhoneNumber';

export default function PrimaryGuestBlock(props) {
  if (props.guest != null && props.guest.first_name && props.guest.last_name) {
    return (
      <Fragment>
        <h4>Guests</h4>
        <div className={`detail-block`}>
          <strong>Primary Guest: </strong> {humanName(props.guest)}
          <br />
          {props.guest?.relationship && (
            <Fragment>
              <strong>Relationship: </strong>
              {props.guest?.relationship}
              <br />
            </Fragment>
          )}
          {props.guest.telephone && (
            <Fragment>
              <strong>Primary Guest Telephone: </strong>
              {
                formatPhoneNumber(props.guest.telephone, props.guest.extension)
              }
              <br />
            </Fragment>
          )}
          {props.guest.email && (
            <Fragment>
              <strong>Primary Guest Email: </strong>
              <a href={`mailto:${props.guest.email}`}>{props.guest.email}</a>
              <br />
            </Fragment>
          )}
          {
            <Fragment>
              <strong>Additional Guests: </strong>
              {props.numberOfAdditionalGuests}
            </Fragment>
          }
        </div>
      </Fragment>
    );
  }

  return null;
}

PrimaryGuestBlock.defaultProps = {
  guest: null,
  numberOfAdditionalGuests: 0,
};
