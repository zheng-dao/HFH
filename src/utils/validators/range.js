export default function validateNumericRange(value, required = true, minimum = 0, maximum = 100) {
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

  if (value.length > 0 && !(!isNaN(parseFloat(value)) && isFinite(value))) {
    return {
      valid: false,
      message: 'Please enter a valid number.',
    };
  }

  if (value < minimum || value > maximum) {
    return {
      valid: false,
      message: 'Please enter a valid number within the range of ' + minimum + ' - ' + maximum + '.',
    };
  }

  return {
    valid: true,
    message: '',
  };
}
