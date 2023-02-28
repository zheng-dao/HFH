export default function validateZip(value, required = false) {
  if (!required && value == null) {
    return {
      valid: true,
      message: '',
    };
  } else if (required && (value == null || value.trim().length == 0)) {
    return {
      valid: false,
      message: 'Please enter a valid zip code (xxxxx or xxxxx-xxxx).',
    };
  }

  value = value.trim();

  if (value.length > 0 && !/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value)) {
    return {
      valid: false,
      message: 'Please enter a valid zip code (xxxxx or xxxxx-xxxx).',
    };
  }

  return {
    valid: true,
    message: '',
  };
}
