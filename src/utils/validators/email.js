import * as EmailValidator from 'email-validator';

export default function validateEmail(email) {
  if (typeof email === 'undefined' || email === null) {
    return {
      valid: false,
      message: 'This field is required.',
    };
  }

  email = email.trim();
  if (email.length == 0) {
    return {
      valid: false,
      message: 'Email is required.',
    };
  } else if (!EmailValidator.validate(email)) {
    return {
      valid: false,
      message: 'Please provide a valid email address.',
    };
  }

  return {
    valid: true,
    message: '',
  };
}
