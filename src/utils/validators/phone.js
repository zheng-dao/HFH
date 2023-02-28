import { isValidPhoneNumber, parsePhoneNumber, validatePhoneNumberLength } from 'libphonenumber-js';

export default function validatePhoneNumber(value) {
  if (typeof value === 'undefined' || value === null) {
    return {
      valid: false,
      message: 'This field is required.',
    };
  }

  value = value.trim();

  let parsedPhone;

  try {
    if (!value.startsWith('+')) {
      parsedPhone = parsePhoneNumber(value, 'US');
    } else {
      parsedPhone = parsePhoneNumber(value);
    }
  } catch (e) {
    if (e.message == 'NOT_A_NUMBER') {
      return {
        valid: false,
        message: 'Enter a combination of digits and hyphens.',
      };
    } else if (e.message == 'TOO_SHORT') {
      return {
        valid: false,
        message: 'The phone number you entered is too short.',
      };
    } else if (e.message == 'TOO_LONG') {
      return {
        valid: false,
        message: 'The phone number you entered is too long.',
      };
    } else {
      return {
        valid: false,
        message: e.message,
      };
    }
  }

  if (value.length > 0 && !parsedPhone.isValid()) {
    return {
      valid: false,
      message: 'Please enter a valid phone number.',
    };
  }

  return {
    valid: true,
    message: '',
  };
}
