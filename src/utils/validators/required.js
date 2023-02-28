export default function validateRequired(value, fieldName = 'This field') {
  if (typeof value === 'undefined' || value === null) {
    return {
      valid: false,
      message: fieldName + ' is required.',
    };
  } else if (typeof value === 'object') {
    return {
      valid: true,
      message: '',
    };
  }

  if (typeof value === 'string') {
    value = value.trim();
  }

  if (value.length == 0) {
    return {
      valid: false,
      message: fieldName + ' is required.',
    };
  }

  return {
    valid: true,
    message: '',
  };
}
