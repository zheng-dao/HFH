export const makeTimezoneAwareDate = (input) => {
  const dt = new Date(input);
  return new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
};
