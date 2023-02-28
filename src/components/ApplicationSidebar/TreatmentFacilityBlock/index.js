import { Fragment } from 'react';
import makeUrlFriendlyAddress from '@utils/makeUrlFriendlyAddress';

export default function TreatmentFacilityBlock(props) {
  if (props.facility != null) {
    return (
      <Fragment>
        <h4>Treatment Facility</h4>
        <div className={`detail-block`}>
          <p>
            {props.facility?.name}
            <br />
            {props.facility?.address}
            <br />
            {props.facility?.address_2 && (
              <Fragment>
                {props.facility?.address_2}
                <br />
              </Fragment>
            )}
            {props.facility?.city}, {props.facility?.state}, {props.facility?.zip}
          </p>
          <p>
            <a
              href={
                'https://www.google.com/maps/dir/?api=1&origin=' +
                // makeUrlFriendlyAddress(props.primaryGuest) +
                '&destination=' +
                makeUrlFriendlyAddress(props.facility)
              }
              target="_blank"
              rel="noreferrer"
            >
              Show distance in Google Maps
            </a>
          </p>
        </div>
      </Fragment>
    );
  }
  return null;
}

TreatmentFacilityBlock.defaultProps = {
  facility: null,
};
