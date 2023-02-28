import { parsePhoneNumber } from 'libphonenumber-js';
import validatePhoneNumer from './validators/phone';

const formatPhoneNumber = (phoneNumber, extension) => {
  if (phoneNumber && validatePhoneNumer(phoneNumber).valid) {
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
