import { Fragment, useEffect, useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { HotelProperty, HotelChain } from '@src/models';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { getHotelProperty, getHotelChain } from '@src/graphql/queries';
import { createConfigurationSetting, updateConfigurationSetting } from '@src/graphql/mutations';
import { deserializeModel, serializeModel } from '@aws-amplify/datastore/ssr';
import useDialog from '@contexts/DialogContext';
import classNames from 'classnames';
import formatPhoneNumber from '@utils/formatPhoneNumber';

export default function HotelDetails(props) {
  const [property, setProperty] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { setMessage } = useDialog();

  const detailBlockClassNames = classNames('detail-block', {
    loading: isLoading === true,
  });

  const { setHotelProperty } = props;

  useEffect(() => {
    if (props.hotelID && property?.id != props.hotelID) {
      // setIsLoading(true);
      if (shouldUseDatastore()) {
        DataStore.query(HotelProperty, props.hotelID).then((item) => {
          setProperty(item);
          setIsLoading(false);
        });
      } else {
        API.graphql(graphqlOperation(getHotelProperty, { id: props.hotelID }))
          .then((results) => {
            setProperty(results.data.getHotelProperty);
            setHotelProperty(results.data.getHotelProperty);
            setIsLoading(false);
          })
          .catch((err) => {
            console.log('Caught error', err);
            setIsLoading(false);
            setMessage(
              'There was an error loading the Hotel Property. Please refresh the page and try again.'
            );
          });
      }
    } else {
      setIsLoading(false);
    }
  }, [props.hotelID, setHotelProperty, setMessage, property?.id]);

  return (
    <div className={detailBlockClassNames}>
      <p>
        <strong>Name:</strong> {property?.name}
      </p>

      <p>
        <strong>Hotel Chain:</strong> {property?.HotelChain?.name}
      </p>

      <p>
        <strong>Hotel Brand:</strong> {property?.HotelBrand?.name}
      </p>

      <h5>Address:</h5>
      <p>
        {property?.address}
        <br />
        {property?.address_2 && (
          <Fragment>
            {property?.address_2}
            <br />
          </Fragment>
        )}
        {property?.city}, {property?.state}, {property?.zip}
      </p>

      <h5>Contact:</h5>
      <p>
        {property?.contact_name && (
          <Fragment>
            {property?.contact_name}
            <br />
          </Fragment>
        )}
        {property?.contact_position && (
          <Fragment>
            {property?.contact_position}
            <br />
          </Fragment>
        )}
        {property?.telephone && (
          <Fragment>
            {formatPhoneNumber(property?.telephone, property?.extension)}
            <br />
          </Fragment>
        )}
        {property?.email && (
          <Fragment>
            {property?.email}
            <br />
          </Fragment>
        )}
      </p>

      {props.children}
      {props.withEditHotelButton && (
        <button type="button" onClick={props.toggleEditWindow} disabled={props.inputDisabled}>
          Edit this Hotel
        </button>
      )}
    </div>
  );
}

HotelDetails.defaultProps = {
  withEditHotelButton: false,
  toggleEditWindow: () => {},
  inputDisabled: false,
  setHotelProperty: () => {},
};
