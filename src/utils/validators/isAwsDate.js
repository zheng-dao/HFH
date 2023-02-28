export default function validateIsAwsDate(value, required = false) {
  const todayDate = new Date();
  if (!required && value == null) {
    return {
      valid: true,
      message: '',
    };
  } else if (required && value == null) {
    return {
      valid: false,
      message:
        'Please enter a date from 1990 through next year (' + (todayDate.getFullYear() + 1) + ').',
    };
  }

  value = value.trim();
  const isAWSDateRegex =
    /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?(Z|[+-](?:2[0-3]|[01][0-9])(?::?(?:[0-5][0-9]))?)?$/;

  if (value.length > 0 && !isAWSDateRegex.test(value)) {
    return {
      valid: false,
      message:
        'Please enter a date from 1990 through next year (' + (todayDate.getFullYear() + 1) + ').',
    };
  }

  return {
    valid: true,
    message: '',
  };
}
