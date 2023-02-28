export default function makeUrlFriendlyAddress(object) {
  if (object == null) {
    return '';
  }
  const addressUrl =
    (object?.address ?? '') + ', ' + (object?.state ?? '') + ', ' + (object?.zip ?? '');
  return encodeURIComponent(addressUrl);
}
