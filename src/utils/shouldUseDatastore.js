export const shouldUseDatastore = () => {
  return process.env.NEXT_PUBLIC_USE_DATASTORE === '1';
};
