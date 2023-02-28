export default function validateLetter(value) {
  if (value == null) {
    return {
      valid: true,
      message: '',
    };
  }

  value = value.trim();

  if (value.length > 0 && value.toUpperCase() == value.toLowerCase()) {
    return {
      valid: false,
      message: 'Please enter a valid letter.',
    };
  }

  return {
    valid: true,
    message: '',
  };
}
