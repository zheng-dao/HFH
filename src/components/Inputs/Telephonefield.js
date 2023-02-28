import Textfield from './Textfield';
import { API } from 'aws-amplify';
import { useEffect, useState } from 'react';

export default function Telephonefield(props) {
  const [defaultCountry, setDefaultCountry] = useState('');

  useEffect(() => {
    // if (valueOrEmptyString(props.inputValue) == '') {
    const apiName = 'Utils';
    const path = '/utils/country';
    const initOptions = {
      headers: {},
    };

    const request = API.get(apiName, path, initOptions)
      .then((response) => {
        console.log();
        setDefaultCountry(response.country);
      })
      .catch((error) => {
        console.log(error.response);
        // If we get an error, just use USA as the default country.
        setDefaultCountry('US');
      });

    return () => API.cancel(request, 'Cancelled in useEffect cleanup.');
    // }
  }, []);

  return <Textfield defaultCountry={defaultCountry} {...props} />;
}

Telephonefield.defaultProps = {
  inputType: 'tel',
};
