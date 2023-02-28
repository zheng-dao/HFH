export default function validateNumeric(value, required = false) {
  if (!required && value == null) {
    return {
      valid: true,
      message: '',
    };
  } else if (required && value == null) {
    return {
      valid: false,
      message: 'Please enter a valid number.',
    };
  }

  value = value.trim();

  if (value.length > 0 && !/^\d+$/.test(value)) {
    return {
      valid: false,
      message: 'Please enter a valid number.',
    };
  }

  return {
    valid: true,
    message: '',
  };
}
