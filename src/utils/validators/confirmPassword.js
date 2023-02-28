export default function validateConfirmPassword(value, match) {
  value = value.trim();

  match = match.trim();

  if (value != match) {
    return {
      valid: false,
      message: 'Please enter the same password for confirmation.',
    };
  }

  return {
    valid: true,
    message: '',
  };
}
