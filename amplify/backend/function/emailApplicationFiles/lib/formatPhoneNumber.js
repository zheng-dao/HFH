import { parsePhoneNumber } from 'libphonenumber-js';

const formatPhoneNumber = (phoneNumber, extension) => {
  if (phoneNumber) {
    const parsedPhoneNumber = parsePhoneNumber(phoneNumber, 'US');
    if (extension) {
      parsedPhoneNumber.setExt(extension);
    }
    if (parsedPhoneNumber.country == 'US') {
      return parsedPhoneNumber.formatNational();
    } else {
      return parsedPhoneNumber.formatInternational();
    }
  }
  return '';
};

export default formatPhoneNumber;
