import { Fragment } from 'react';
import formatPhoneNumber from '@utils/formatPhoneNumber';

export default function HotelPropertyBlock(props) {
  if (props.stay) {
    if (props.stay.HotelBooked) {
      return (
        <Fragment>
          <h4>{props.stay.HotelBooked?.name}</h4>
          <div className={`detail-block`}>
            <p>
              {props.stay.HotelBooked?.contact_name && (
                <Fragment>
                  {props.stay?.HotelBooked?.contact_name}
                  <br />
                </Fragment>
              )}
              {props.stay.HotelBooked?.email && (
                <Fragment>
                  <a href={'mailto:' + props.stay.HotelBooked?.email}>
                    {props.stay.HotelBooked?.email}
                  </a>
                  <br />
                </Fragment>
              )}
              {
                formatPhoneNumber(props.stay.HotelBooked?.telephone, props.stay.HotelBooked?.extension)
              }
            </p>
          </div>
        </Fragment>
      );
    }
  }
  return null;
}

HotelPropertyBlock.defaultProps = {
  stay: null,
};
